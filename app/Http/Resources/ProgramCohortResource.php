<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\ProgramCohort
 */
class ProgramCohortResource extends JsonResource
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
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'max_participants' => $this->max_participants,
            'status' => $this->status,
            'meeting_cadence' => $this->meeting_cadence,
            'has_capacity' => $this->hasCapacity(),
            'program' => new ProgramResource($this->whenLoaded('program')),
            'participants' => UserResource::collection($this->whenLoaded('participants')),
            'participants_count' => $this->whenCounted('participants'),
            'sessions' => ProgramSessionResource::collection($this->whenLoaded('sessions')),
            'next_session' => $this->when(
                $this->relationLoaded('sessions'),
                fn () => new ProgramSessionResource($this->sessions->where('starts_at', '>', now())->sortBy('starts_at')->first())
            ),
            'created_at' => $this->created_at,
        ];
    }
}
