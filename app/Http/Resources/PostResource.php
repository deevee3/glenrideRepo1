<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Post
 */
class PostResource extends JsonResource
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
            'body' => $this->is_deleted ? '[This message was deleted]' : $this->body,
            'is_edited' => $this->is_edited,
            'is_deleted' => $this->is_deleted,
            'context_type' => $this->context_type,
            'context_id' => $this->context_id,
            'channel' => new ChannelResource($this->whenLoaded('channel')),
            'author' => new UserResource($this->whenLoaded('author')),
            'parent' => new PostResource($this->whenLoaded('parent')),
            'replies' => PostResource::collection($this->whenLoaded('replies')),
            'replies_count' => $this->whenCounted('replies'),
            'reactions' => PostReactionResource::collection($this->whenLoaded('reactions')),
            'reactions_summary' => $this->when(
                $this->relationLoaded('reactions'),
                fn () => $this->reactions->groupBy('reaction_type')->map->count()
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
