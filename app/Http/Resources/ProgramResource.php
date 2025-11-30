<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Program
 */
class ProgramResource extends JsonResource
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
            'short_description' => $this->short_description,
            'long_description' => $this->long_description,
            'program_type' => $this->program_type,
            'application_open_at' => $this->application_open_at,
            'application_close_at' => $this->application_close_at,
            'default_duration_weeks' => $this->default_duration_weeks,
            'is_public' => $this->is_public,
            'status' => $this->status,
            'is_accepting_applications' => $this->isAcceptingApplications(),
            'pillars' => PillarResource::collection($this->whenLoaded('pillars')),
            'themes' => ThemeResource::collection($this->whenLoaded('themes')),
            'cohorts' => ProgramCohortResource::collection($this->whenLoaded('cohorts')),
            'cohorts_count' => $this->whenCounted('cohorts'),
            'creator' => new UserResource($this->whenLoaded('creator')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
