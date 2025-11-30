<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\ProgramSession
 */
class ProgramSessionResource extends JsonResource
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
            'is_upcoming' => $this->isUpcoming(),
            'is_in_progress' => $this->isInProgress(),
            'cohort' => new ProgramCohortResource($this->whenLoaded('cohort')),
            'created_at' => $this->created_at,
        ];
    }
}
