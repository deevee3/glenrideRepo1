<?php

namespace App\Http\Requests\Programs;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProgramRequest extends FormRequest
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
            'slug' => ['nullable', 'string', 'max:255', 'unique:programs,slug'],
            'short_description' => ['required', 'string', 'max:500'],
            'long_description' => ['nullable', 'string'],
            'program_type' => ['required', Rule::in(['fellowship', 'lab', 'school', 'incubator', 'studio', 'other'])],
            'application_open_at' => ['nullable', 'date'],
            'application_close_at' => ['nullable', 'date', 'after:application_open_at'],
            'default_duration_weeks' => ['nullable', 'integer', 'min:1', 'max:52'],
            'is_public' => ['boolean'],
            'status' => ['required', Rule::in(['draft', 'upcoming', 'active', 'completed', 'archived'])],
            'pillars' => ['array'],
            'pillars.*' => ['uuid', 'exists:pillars,id'],
            'themes' => ['array'],
            'themes.*' => ['uuid', 'exists:themes,id'],
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
            'application_close_at.after' => 'Application close date must be after the open date.',
        ];
    }
}
