<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\LibraryItem
 */
class LibraryItemResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'content_type' => $this->content_type,
            'access_level' => $this->access_level,
            'external_url' => $this->external_url,
            'rich_content' => $this->rich_content,
            'published_at' => $this->published_at,
            'status' => $this->status,
            'pillars' => PillarResource::collection($this->whenLoaded('pillars')),
            'themes' => ThemeResource::collection($this->whenLoaded('themes')),
            'author' => new UserResource($this->whenLoaded('author')),
            'program' => new ProgramResource($this->whenLoaded('program')),
            'views_count' => $this->whenCounted('views'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
