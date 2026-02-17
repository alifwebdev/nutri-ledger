# NutriLedger — Meal & Expense Tracker

**Stack:** Laravel 12 · React (Inertia) · MySQL · Laravel Sanctum Auth

---

## Features

| Feature              | Details                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| **Authentication**   | Laravel default Starter Kit (register / login / logout)                   |
| **Meal Tracking**    | Log meals by type (Breakfast, Lunch, Dinner, Snack) with calories & notes |
| **Expense Tracking** | Track expenses by category with daily or monthly view                     |
| **Daily Summary**    | Meals eaten + calories + spend for any given day                          |
| **Monthly Summary**  | KPI cards, donut charts, calendar heatmap, day-by-day table               |
| **User Isolation**   | Every user only sees their own data (Policy-enforced)                     |

---

## Project Structure

```
app/
  Http/Controllers/
    MealController.php       # CRUD for meals
    ExpenseController.php    # CRUD for expenses
    SummaryController.php    # Dashboard, daily & monthly summaries
  Models/
    Meal.php
    Expense.php
  Policies/
    MealPolicy.php           # Owner-only access
    ExpensePolicy.php

database/migrations/
  ..._create_meals_table.php
  ..._create_expenses_table.php

routes/
  api.php                    # All JSON API routes (auth:sanctum)
  web.php                    # Inertia page routes

resources/
  css/app.css                # Full design system (DM Serif Display + DM Sans)
  js/
    hooks/useApi.js          # Axios wrapper hook
    Layouts/AppLayout.jsx    # Sidebar + topbar shell
    Pages/
      Dashboard.jsx          # Today stats + 7-day trend chart
      Meals/Index.jsx        # Meal CRUD with type grouping
      Expenses/Index.jsx     # Expense CRUD with category chips
      Summary/Monthly.jsx    # Full monthly report with donut charts
```

---

## Setup

### 1. Create a fresh Laravel 12 project with React starter kit

```bash
composer create-project laravel/laravel nutriledger
cd nutriledger
php artisan breeze:install react
npm install && npm run build
```

### 2. Copy files

Drop all files from this package into the corresponding paths in your project.

### 3. Configure `.env`

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nutriledger
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Run migrations

```bash
php artisan migrate
```

### 5. Register Policies

In `app/Providers/AuthServiceProvider.php` (or `AppServiceProvider.php` in Laravel 12):

```php
use App\Models\Meal;
use App\Models\Expense;
use App\Policies\MealPolicy;
use App\Policies\ExpensePolicy;

protected $policies = [
    Meal::class    => MealPolicy::class,
    Expense::class => ExpensePolicy::class,
];
```

Or use auto-discovery (Laravel 12 auto-discovers policies matching `App\Models\X` → `App\Policies\XPolicy`).

### 6. Add API routes

In `bootstrap/app.php`, ensure API routes are loaded:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    ...
)
```

### 7. Start dev server

```bash
php artisan serve
npm run dev
```

Visit `http://localhost:8000` → register → start tracking.

---

## API Reference

All routes require `auth:sanctum`. Base path: `/api`.

### Meals

| Method | Endpoint               | Description                                               |
| ------ | ---------------------- | --------------------------------------------------------- |
| GET    | `/meals`               | List meals. Params: `?date=YYYY-MM-DD` or `?year=&month=` |
| POST   | `/meals`               | Create meal                                               |
| PUT    | `/meals/{id}`          | Update meal                                               |
| DELETE | `/meals/{id}`          | Delete meal                                               |
| GET    | `/meals/summary/daily` | Daily meal summary. Param: `?date=`                       |

**Meal payload:**

```json
{
    "name": "Grilled Chicken Salad",
    "type": "lunch",
    "calories": 520,
    "notes": "Light dressing",
    "eaten_at": "2026-02-17"
}
```

### Expenses

| Method | Endpoint               | Description                                        |
| ------ | ---------------------- | -------------------------------------------------- |
| GET    | `/expenses`            | List expenses. Params: `?date=` or `?year=&month=` |
| POST   | `/expenses`            | Create expense                                     |
| PUT    | `/expenses/{id}`       | Update expense                                     |
| DELETE | `/expenses/{id}`       | Delete expense                                     |
| GET    | `/expenses/categories` | List available categories                          |

**Expense payload:**

```json
{
    "title": "Grocery Run",
    "amount": 42.5,
    "category": "groceries",
    "notes": "Whole Foods",
    "spent_at": "2026-02-17"
}
```

**Categories:** `food` · `groceries` · `transport` · `utilities` · `entertainment` · `health` · `shopping` · `other`

### Summaries

| Method | Endpoint             | Description                                  |
| ------ | -------------------- | -------------------------------------------- |
| GET    | `/summary/dashboard` | Today stats + this month + last 7 days       |
| GET    | `/summary/daily`     | Full daily breakdown. Param: `?date=`        |
| GET    | `/summary/monthly`   | Full monthly report. Params: `?year=&month=` |

---

## Design System

- **Fonts:** DM Serif Display (headings) + DM Sans (body)
- **Palette:** Warm cream/parchment base · amber accent · color-coded types/categories
- **Theme:** Refined editorial warmth — avoids generic blue/purple AI aesthetics
- **Responsive:** Sidebar collapses on mobile with hamburger toggle
