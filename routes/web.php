<?php

use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\MealController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SummaryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes — NutriLedger
|--------------------------------------------------------------------------
*/

// ── Welcome ────────────────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
})->name('welcome');


// ── Authenticated + Verified ───────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Meals
    Route::get('/meals', function () {
        return Inertia::render('Meals/Index');
    })->name('meals.index');

    // Expenses
    Route::get('/expenses', function () {
        return Inertia::render('Expenses/Index');
    })->name('expenses.index');

    // Monthly Summary
    Route::get('/summary/monthly', function () {
        return Inertia::render('Summary/Monthly');
    })->name('summary.monthly');

});


// ── Profile (auth only, no verified required) ──────────────────────────────
Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

});


require __DIR__ . '/auth.php';