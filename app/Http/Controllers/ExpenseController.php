<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    /**
     * GET /api/expenses
     *
     * Query params:
     *   ?date=YYYY-MM-DD          → filter by single day
     *   ?year=2026&month=2        → filter by month
     *   ?category=food            → filter by category
     *   ?per_page=50              → paginate (omit for full list)
     */
    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        $request->validate([
            'date'     => ['nullable', 'date'],
            'year'     => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'month'    => ['nullable', 'integer', 'min:1', 'max:12'],
            'category' => ['nullable', 'string', 'in:' . implode(',', array_keys(Expense::CATEGORIES))],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:200'],
        ]);

        $query = Expense::forUser(Auth::id())
            ->orderBy('spent_at', 'desc')
            ->orderBy('created_at', 'desc');

        // Date filters
        if ($request->filled('date')) {
            $query->onDate($request->date);
        } elseif ($request->filled('year') && $request->filled('month')) {
            $query->inMonth((int) $request->year, (int) $request->month);
        }

        // Category filter
        if ($request->filled('category')) {
            $query->ofCategory($request->category);
        }

        // Optional pagination
        if ($request->filled('per_page')) {
            return ExpenseResource::collection($query->paginate((int) $request->per_page));
        }

        return ExpenseResource::collection($query->get());
    }

    /**
     * POST /api/expenses
     */
    public function store(StoreExpenseRequest $request): ExpenseResource
    {
        $expense = Expense::create([
            ...$request->validated(),
            'user_id' => Auth::id(),
        ]);

        return new ExpenseResource($expense);
    }

    /**
     * GET /api/expenses/{expense}
     */
    public function show(Expense $expense): ExpenseResource
    {
        $this->authorize('view', $expense);

        return new ExpenseResource($expense);
    }

    /**
     * PUT /api/expenses/{expense}
     */
    public function update(UpdateExpenseRequest $request, Expense $expense): ExpenseResource
    {
        $this->authorize('update', $expense);

        $expense->update($request->validated());

        return new ExpenseResource($expense->fresh());
    }

    /**
     * DELETE /api/expenses/{expense}
     */
    public function destroy(Expense $expense): JsonResponse
    {
        $this->authorize('delete', $expense);

        $expense->delete();

        return response()->json([
            'message' => 'Expense deleted successfully.',
        ]);
    }

    /**
     * GET /api/expenses/categories
     *
     * Returns the full list of available categories.
     */
    public function categories(): JsonResponse
    {
        $categories = collect(Expense::CATEGORIES)->map(fn ($label, $key) => [
            'key'   => $key,
            'label' => $label,
        ])->values();

        return response()->json($categories);
    }
}