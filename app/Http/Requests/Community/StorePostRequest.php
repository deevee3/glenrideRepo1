<?php

namespace App\Http\Requests\Community;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'body' => ['required', 'string', 'min:1', 'max:10000'],
            'channel_id' => ['required_without:context_id', 'uuid', 'exists:channels,id'],
            'parent_post_id' => ['nullable', 'uuid', 'exists:posts,id'],
            'context_type' => ['nullable', 'string', 'in:channel,project,program,event'],
            'context_id' => ['nullable', 'uuid'],
        ];
    }
}
