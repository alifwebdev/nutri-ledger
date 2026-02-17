<?php

namespace App\Http\Requests;

use App\Models\Meal;
use Illuminate\Foundation\Http\FormRequest;

class StoreMealRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // gate handled by controller + policy
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'type'     => ['required', 'string', 'in:' . implode(',', Meal::TYPES)],
            'notes'    => ['nullable', 'string', 'max:1000'],
            'calories' => ['nullable', 'numeric', 'min:0', 'max:99999'],
            'eaten_at' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.in' => 'Meal type must be one of: ' . implode(', ', Meal::TYPES) . '.',
        ];
    }
}