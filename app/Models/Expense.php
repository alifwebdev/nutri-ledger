<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'amount',
        'category',
        'notes',
        'spent_at',
    ];

    protected $casts = [
        'spent_at' => 'date',
        'amount' => 'decimal:2',
    ];

    public const CATEGORIES = [
        'food'          => 'Food & Dining',
        'groceries'     => 'Groceries',
        'transport'     => 'Transport',
        'utilities'     => 'Utilities',
        'entertainment' => 'Entertainment',
        'health'        => 'Health & Medical',
        'shopping'      => 'Shopping',
        'other'         => 'Other',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOnDate($query, string $date)
    {
        return $query->whereDate('spent_at', $date);
    }

    public function scopeInMonth($query, int $year, int $month)
    {
        return $query->whereYear('spent_at', $year)->whereMonth('spent_at', $month);
    }
}