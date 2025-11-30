<?php

namespace App\Http\Requests\Library;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLibraryItemRequest extends FormRequest
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
            'slug' => ['nullable', 'string', 'max:255', 'unique:library_items,slug'],
            'description' => ['required', 'string', 'max:500'],
            'content_type' => ['required', Rule::in(['article', 'video', 'audio', 'briefing', 'guide', 'recording', 'other'])],
            'access_level' => ['required', Rule::in(['public', 'members', 'program_members', 'cohort_members'])],
            'external_url' => ['nullable', 'url', 'max:500'],
            'rich_content' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'program_id' => ['nullable', 'uuid', 'exists:programs,id'],
            'program_cohort_id' => ['nullable', 'uuid', 'exists:program_cohorts,id'],
            'pillars' => ['array'],
            'pillars.*' => ['uuid', 'exists:pillars,id'],
            'themes' => ['array'],
            'themes.*' => ['uuid', 'exists:themes,id'],
        ];
    }
}
