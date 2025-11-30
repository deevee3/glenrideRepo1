<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
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
            'action' => $this->action,
            'action_label' => $this->formatAction($this->action),
            'entity_type' => $this->entity_type,
            'entity_type_label' => ucfirst(str_replace('_', ' ', $this->entity_type)),
            'entity_id' => $this->entity_id,
            'metadata' => $this->metadata,
            'points_value' => $this->points_value,
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'created_at' => $this->created_at,
            'created_at_human' => $this->created_at->diffForHumans(),
            'actor' => $this->when($this->relationLoaded('actor') && $this->actor, [
                'id' => $this->actor?->id,
                'name' => $this->actor?->name,
                'email' => $this->actor?->email,
            ]),
        ];
    }

    /**
     * Format action name to human-readable label.
     */
    private function formatAction(string $action): string
    {
        return ucfirst(str_replace('_', ' ', $action));
    }
}
