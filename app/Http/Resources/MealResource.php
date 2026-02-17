<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MealResource extends JsonResource
{
    // Disable the {"data": ...} wrapper for single resources
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'user_id'    => $this->user_id,
            'name'       => $this->name,
            'type'       => $this->type,
            'notes'      => $this->notes,
            'calories'   => $this->calories ? (float) $this->calories : null,
            'eaten_at'   => $this->eaten_at->format('Y-m-d'),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}