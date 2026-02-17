<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Meal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'notes',
        'calories',
        'eaten_at',
    ];

    protected $casts = [
        'eaten_at' => 'date',
        'calories' => 'decimal:2',
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
        return $query->whereDate('eaten_at', $date);
    }

    public function scopeInMonth($query, int $year, int $month)
    {
        return $query->whereYear('eaten_at', $year)->whereMonth('eaten_at', $month);
    }
}