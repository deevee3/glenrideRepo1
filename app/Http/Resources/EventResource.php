<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Event
 */
class EventResource extends JsonResource
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
            'description' => $this->description,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'location_type' => $this->location_type,
            'location_details' => $this->location_details,
            'visibility' => $this->visibility,
            'is_upcoming' => $this->isUpcoming(),
            'is_in_progress' => $this->isInProgress(),
            'has_ended' => $this->hasEnded(),
            'program' => new ProgramResource($this->whenLoaded('program')),
            'cohort' => new ProgramCohortResource($this->whenLoaded('cohort')),
            'creator' => new UserResource($this->whenLoaded('creator')),
            'registrants_count' => $this->whenCounted('registrants'),
            'user_registration' => $this->when(
                isset($this->user_registration),
                fn () => $this->user_registration
            ),
            'created_at' => $this->created_at,
        ];
    }
}
