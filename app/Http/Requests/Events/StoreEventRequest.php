<?php

namespace App\Http\Requests\Events;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by route middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'starts_at' => ['required', 'date', 'after:now'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'location_type' => ['required', Rule::in(['online', 'in_person', 'hybrid'])],
            'location_details' => ['nullable', 'string', 'max:500'],
            'visibility' => ['required', Rule::in(['public', 'members', 'program_only', 'cohort_only'])],
            'program_id' => ['nullable', 'uuid', 'exists:programs,id'],
            'program_cohort_id' => ['nullable', 'uuid', 'exists:program_cohorts,id'],
        ];
    }

    /**
     * Custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'starts_at.after' => 'Event start time must be in the future.',
            'ends_at.after' => 'Event end time must be after the start time.',
        ];
    }
}
