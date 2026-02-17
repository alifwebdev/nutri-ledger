<?php

namespace App\Http\Requests;

use App\Models\Expense;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'    => ['sometimes', 'required', 'string', 'max:255'],
            'amount'   => ['sometimes', 'required', 'numeric', 'min:0.01', 'max:9999999.99'],
            'category' => ['sometimes', 'required', 'string', 'in:' . implode(',', array_keys(Expense::CATEGORIES))],
            'notes'    => ['nullable', 'string', 'max:1000'],
            'spent_at' => ['sometimes', 'required', 'date'],
        ];
    }
}