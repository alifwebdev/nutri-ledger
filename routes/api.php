<?php

use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\MealController;
use App\Http\Controllers\SummaryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — NutriLedger
|--------------------------------------------------------------------------
| All routes are protected by auth:sanctum.
| Base URL: /api
*/

Route::middleware('auth:sanctum')->group(function () {

    // ── Auth user ──────────────────────────────────────────────────────
    Route::get('/user', fn(Request $r) => $r->user())->name('api.user');

    // ── Meals — static routes MUST come before apiResource ────────────
    // GET /api/meals/summary/daily?date=YYYY-MM-DD
    Route::get('meals/summary/daily', [MealController::class, 'dailySummary'])
        ->name('meals.daily-summary');

    // GET    /api/meals              list (filter: ?date= or ?year=&month=)
    // POST   /api/meals              create
    // GET    /api/meals/{id}         show
    // PUT    /api/meals/{id}         update
    // DELETE /api/meals/{id}         delete
    Route::apiResource('meals', MealController::class)
    ->names('api.meals');


    // ── Expenses — static routes MUST come before apiResource ─────────
    // GET /api/expenses/categories
    Route::get('expenses/categories', [ExpenseController::class, 'categories'])
        ->name('expenses.categories');

    // GET    /api/expenses           list (filter: ?date= or ?year=&month= or ?category=)
    // POST   /api/expenses           create
    // GET    /api/expenses/{id}      show
    // PUT    /api/expenses/{id}      update
    // DELETE /api/expenses/{id}      delete
    Route::apiResource('expenses', ExpenseController::class)
    ->names('api.expenses');

    // ── Summaries ──────────────────────────────────────────────────────
    // GET /api/summary/dashboard
    Route::get('summary/dashboard', [SummaryController::class, 'dashboard'])
        ->name('summary.dashboard');

    // GET /api/summary/daily?date=YYYY-MM-DD
    Route::get('summary/daily', [SummaryController::class, 'daily'])
        ->name('summary.daily');

    // GET /api/summary/monthly?year=2026&month=2
    Route::get('summary/monthly', [SummaryController::class, 'monthly'])
        ->name('summary.monthly');

});