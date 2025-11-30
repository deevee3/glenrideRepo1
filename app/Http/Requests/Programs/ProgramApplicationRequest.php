<?php

namespace App\Http\Requests\Programs;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ProgramApplicationRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'program_id' => ['required', 'uuid', 'exists:programs,id'],
            'program_cohort_id' => ['nullable', 'uuid', 'exists:program_cohorts,id'],
            'role_self_identified' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:255'],
            'background' => ['required', 'string', 'min:50', 'max:5000'],
            'motivation' => ['required', 'string', 'min:50', 'max:5000'],
            'how_they_want_to_collaborate' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'background.min' => 'Please provide more detail about your background (at least 50 characters).',
            'motivation.min' => 'Please provide more detail about your motivation (at least 50 characters).',
        ];
    }
}
