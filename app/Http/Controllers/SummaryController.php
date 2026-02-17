<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Meal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SummaryController extends Controller
{
    public function monthly(Request $request): JsonResponse
    {
        $request->validate([
            'year'  => 'required|integer|min:2000|max:2100',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $userId = Auth::id();
        $year   = (int) $request->year;
        $month  = (int) $request->month;

        // Meals summary
        $meals = Meal::forUser($userId)->inMonth($year, $month)->get();
        $mealsByDay = $meals->groupBy(fn($m) => $m->eaten_at->format('Y-m-d'));

        $mealsByType = $meals->groupBy('type')
            ->map(fn($g) => $g->count())
            ->toArray();

        // Expenses summary
        $expenses = Expense::forUser($userId)->inMonth($year, $month)->get();
        $expensesByDay = $expenses->groupBy(fn($e) => $e->spent_at->format('Y-m-d'));

        $expensesByCategory = $expenses->groupBy('category')
            ->map(fn($g) => [
                'count'  => $g->count(),
                'total'  => round($g->sum('amount'), 2),
            ])
            ->toArray();

        // Build daily breakdown
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        $dailyBreakdown = [];

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $dateKey = sprintf('%04d-%02d-%02d', $year, $month, $day);
            $dailyMeals = $mealsByDay->get($dateKey, collect());
            $dailyExpenses = $expensesByDay->get($dateKey, collect());

            $dailyBreakdown[] = [
                'date'           => $dateKey,
                'meal_count'     => $dailyMeals->count(),
                'total_calories' => round($dailyMeals->sum('calories'), 2),
                'expense_total'  => round($dailyExpenses->sum('amount'), 2),
                'expense_count'  => $dailyExpenses->count(),
            ];
        }

        return response()->json([
            'year'  => $year,
            'month' => $month,
            'meals' => [
                'total'          => $meals->count(),
                'total_calories' => round($meals->sum('calories'), 2),
                'avg_per_day'    => $meals->count() > 0
                    ? round($meals->count() / $daysInMonth, 1)
                    : 0,
                'by_type'        => $mealsByType,
            ],
            'expenses' => [
                'total'       => round($expenses->sum('amount'), 2),
                'count'       => $expenses->count(),
                'avg_per_day' => $expenses->count() > 0
                    ? round($expenses->sum('amount') / $daysInMonth, 2)
                    : 0,
                'by_category' => $expensesByCategory,
            ],
            'daily_breakdown' => $dailyBreakdown,
        ]);
    }

    public function daily(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $userId = Auth::id();
        $date   = $request->date;

        $meals    = Meal::forUser($userId)->onDate($date)->orderBy('created_at')->get();
        $expenses = Expense::forUser($userId)->onDate($date)->orderBy('created_at')->get();

        return response()->json([
            'date' => $date,
            'meals' => [
                'total'          => $meals->count(),
                'total_calories' => round($meals->sum('calories'), 2),
                'by_type'        => $meals->groupBy('type')->map->count(),
                'items'          => $meals,
            ],
            'expenses' => [
                'total'       => round($expenses->sum('amount'), 2),
                'count'       => $expenses->count(),
                'by_category' => $expenses->groupBy('category')->map->count(),
                'items'       => $expenses,
            ],
        ]);
    }

    public function dashboard(): JsonResponse
    {
        $userId = Auth::id();
        $today  = now()->toDateString();
        $year   = now()->year;
        $month  = now()->month;

        $todayMeals    = Meal::forUser($userId)->onDate($today)->get();
        $todayExpenses = Expense::forUser($userId)->onDate($today)->get();
        $monthMeals    = Meal::forUser($userId)->inMonth($year, $month)->get();
        $monthExpenses = Expense::forUser($userId)->inMonth($year, $month)->get();

        // Last 7 days trend
        $last7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $dayMeals    = Meal::forUser($userId)->onDate($date)->get();
            $dayExpenses = Expense::forUser($userId)->onDate($date)->get();

            $last7Days[] = [
                'date'          => $date,
                'meal_count'    => $dayMeals->count(),
                'expense_total' => round($dayExpenses->sum('amount'), 2),
            ];
        }

        return response()->json([
            'today' => [
                'date'           => $today,
                'meal_count'     => $todayMeals->count(),
                'total_calories' => round($todayMeals->sum('calories'), 2),
                'expense_total'  => round($todayExpenses->sum('amount'), 2),
                'expense_count'  => $todayExpenses->count(),
            ],
            'this_month' => [
                'year'            => $year,
                'month'           => $month,
                'total_meals'     => $monthMeals->count(),
                'total_calories'  => round($monthMeals->sum('calories'), 2),
                'total_expenses'  => round($monthExpenses->sum('amount'), 2),
                'expense_count'   => $monthExpenses->count(),
            ],
            'last_7_days' => $last7Days,
        ]);
    }
}