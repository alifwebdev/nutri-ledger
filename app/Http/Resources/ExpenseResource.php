<?php

namespace App\Http\Resources;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    // Disable the {"data": ...} wrapper for single resources
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'user_id'        => $this->user_id,
            'title'          => $this->title,
            'amount'         => (float) $this->amount,
            'category'       => $this->category,
            'category_label' => Expense::CATEGORIES[$this->category] ?? 'Other',
            'notes'          => $this->notes,
            'spent_at'       => $this->spent_at->format('Y-m-d'),
            'created_at'     => $this->created_at->toISOString(),
            'updated_at'     => $this->updated_at->toISOString(),
        ];
    }
}