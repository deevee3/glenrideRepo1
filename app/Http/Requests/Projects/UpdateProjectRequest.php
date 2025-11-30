<?php

namespace App\Http\Requests\Projects;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
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
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string', 'max:10000'],
            'status' => ['nullable', 'string', 'in:idea,design,in_progress,paused,completed,archived'],
            'pillar_ids' => ['nullable', 'array'],
            'pillar_ids.*' => ['uuid', 'exists:pillars,id'],
            'theme_ids' => ['nullable', 'array'],
            'theme_ids.*' => ['uuid', 'exists:themes,id'],
        ];
    }
}
