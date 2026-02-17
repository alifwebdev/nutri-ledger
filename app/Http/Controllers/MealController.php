<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class MealController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'date'  => 'nullable|date',
            'year'  => 'nullable|integer|min:2000|max:2100',
            'month' => 'nullable|integer|min:1|max:12',
        ]);

        $query = Meal::forUser(Auth::id())->orderBy('eaten_at', 'desc')->orderBy('created_at', 'desc');

        if ($request->filled('date')) {
            $query->onDate($request->date);
        } elseif ($request->filled('year') && $request->filled('month')) {
            $query->inMonth($request->year, $request->month);
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'type'     => 'required|in:breakfast,lunch,dinner,snack',
            'notes'    => 'nullable|string|max:1000',
            'calories' => 'nullable|numeric|min:0|max:99999',
            'eaten_at' => 'required|date',
        ]);

        $meal = Meal::create([
            ...$data,
            'user_id' => Auth::id(),
        ]);

        return response()->json($meal, 201);
    }

    public function show(Meal $meal): JsonResponse
    {
        $this->authorize('view', $meal);
        return response()->json($meal);
    }

    public function update(Request $request, Meal $meal): JsonResponse
    {
        $this->authorize('update', $meal);

        $data = $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'type'     => 'sometimes|required|in:breakfast,lunch,dinner,snack',
            'notes'    => 'nullable|string|max:1000',
            'calories' => 'nullable|numeric|min:0|max:99999',
            'eaten_at' => 'sometimes|required|date',
        ]);

        $meal->update($data);

        return response()->json($meal);
    }

    public function destroy(Meal $meal): JsonResponse
    {
        $this->authorize('delete', $meal);
        $meal->delete();

        return response()->json(['message' => 'Meal deleted successfully']);
    }

    public function dailySummary(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $meals = Meal::forUser(Auth::id())
            ->onDate($request->date)
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'date'          => $request->date,
            'total_meals'   => $meals->count(),
            'total_calories' => $meals->sum('calories'),
            'by_type'       => $meals->groupBy('type')->map->count(),
            'meals'         => $meals,
        ]);
    }
}