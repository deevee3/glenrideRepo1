<?php

namespace App\Http\Requests\Projects;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['nullable', 'string', 'in:todo,in_progress,review,done,archived'],
            'priority' => ['nullable', 'string', 'in:low,medium,high,urgent'],
            'assigned_to' => ['nullable', 'uuid', 'exists:users,id'],
            'due_date' => ['nullable', 'date'],
            'start_date' => ['nullable', 'date'],
            'estimated_hours' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'actual_hours' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'labels' => ['nullable', 'array'],
            'labels.*' => ['string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
