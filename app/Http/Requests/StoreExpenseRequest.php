<?php

namespace App\Http\Requests;

use App\Models\Expense;
use Illuminate\Foundation\Http\FormRequest;

class StoreExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'    => ['required', 'string', 'max:255'],
            'amount'   => ['required', 'numeric', 'min:0.01', 'max:9999999.99'],
            'category' => ['required', 'string', 'in:' . implode(',', array_keys(Expense::CATEGORIES))],
            'notes'    => ['nullable', 'string', 'max:1000'],
            'spent_at' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'category.in' => 'Category must be one of: ' . implode(', ', array_keys(Expense::CATEGORIES)) . '.',
            'amount.min'  => 'Amount must be at least $0.01.',
        ];
    }
}