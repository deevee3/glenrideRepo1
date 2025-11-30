<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Channel
 */
class ChannelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'display_name' => $this->display_name,
            'description' => $this->description,
            'visibility' => $this->visibility,
            'is_read_only' => $this->is_read_only,
            'program' => new ProgramResource($this->whenLoaded('program')),
            'members_count' => $this->whenCounted('members'),
            'posts_count' => $this->whenCounted('posts'),
            'unread_count' => $this->when(
                isset($this->unread_count),
                fn () => $this->unread_count
            ),
            'created_at' => $this->created_at,
        ];
    }
}
