<?php

namespace App\Http\Requests;

use App\Models\Meal;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMealRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['sometimes', 'required', 'string', 'max:255'],
            'type'     => ['sometimes', 'required', 'string', 'in:' . implode(',', Meal::TYPES)],
            'notes'    => ['nullable', 'string', 'max:1000'],
            'calories' => ['nullable', 'numeric', 'min:0', 'max:99999'],
            'eaten_at' => ['sometimes', 'required', 'date'],
        ];
    }
}