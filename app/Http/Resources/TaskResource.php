<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Task
 */
class TaskResource extends JsonResource
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
            'status' => $this->status,
            'priority' => $this->priority,

            // Date fields
            'due_date' => $this->due_date?->toDateString(),
            'start_date' => $this->start_date?->toDateString(),
            'completed_at' => $this->completed_at?->toIso8601String(),

            // Time tracking
            'estimated_hours' => $this->estimated_hours ? (float) $this->estimated_hours : null,
            'actual_hours' => $this->actual_hours ? (float) $this->actual_hours : null,

            // Organization
            'sort_order' => $this->sort_order,
            'labels' => $this->labels ?? [],
            'notes' => $this->notes,

            // Computed status indicators
            'is_overdue' => $this->isOverdue(),
            'is_due_soon' => $this->isDueSoon(),
            'is_start_overdue' => $this->isStartOverdue(),
            'days_until_due' => $this->getDaysUntilDue(),
            'progress_percentage' => $this->getProgressPercentage(),
            'time_remaining' => $this->getTimeRemaining(),

            // Relationships
            'project' => new ProjectResource($this->whenLoaded('project')),
            'creator' => new UserResource($this->whenLoaded('creator')),
            'assignee' => new UserResource($this->whenLoaded('assignee')),
            'comments' => TaskCommentResource::collection($this->whenLoaded('comments')),
            'comments_count' => $this->whenCounted('comments'),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
