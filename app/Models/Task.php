<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Task extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'created_by',
        'assigned_to',
        'due_date',
        'start_date',
        'completed_at',
        'estimated_hours',
        'actual_hours',
        'sort_order',
        'labels',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'start_date' => 'date',
            'completed_at' => 'datetime',
            'estimated_hours' => 'decimal:2',
            'actual_hours' => 'decimal:2',
            'sort_order' => 'integer',
            'labels' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * @return HasMany<TaskComment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }

    /**
     * @return MorphMany<FileLink, $this>
     */
    public function fileLinks(): MorphMany
    {
        return $this->morphMany(FileLink::class, 'linked', 'linked_type', 'linked_id');
    }

    /**
     * Check if task is overdue.
     */
    public function isOverdue(): bool
    {
        return $this->due_date !== null
            && $this->due_date < now()->startOfDay()
            && ! in_array($this->status, ['done', 'archived']);
    }

    /**
     * Check if task is due soon (within 3 days).
     */
    public function isDueSoon(): bool
    {
        if ($this->due_date === null || in_array($this->status, ['done', 'archived'])) {
            return false;
        }

        $daysUntilDue = now()->startOfDay()->diffInDays($this->due_date, false);

        return $daysUntilDue >= 0 && $daysUntilDue <= 3;
    }

    /**
     * Check if task should have started (start_date is in the past).
     */
    public function isStartOverdue(): bool
    {
        return $this->start_date !== null
            && $this->start_date < now()->startOfDay()
            && $this->status === 'todo';
    }

    /**
     * Get days until due date (negative if overdue).
     */
    public function getDaysUntilDue(): ?int
    {
        if ($this->due_date === null) {
            return null;
        }

        return (int) now()->startOfDay()->diffInDays($this->due_date, false);
    }

    /**
     * Get progress percentage based on estimated vs actual hours.
     */
    public function getProgressPercentage(): ?int
    {
        if ($this->status === 'done') {
            return 100;
        }

        if ($this->estimated_hours === null || $this->estimated_hours <= 0) {
            return null;
        }

        if ($this->actual_hours === null) {
            return 0;
        }

        $percentage = (int) min(100, ($this->actual_hours / $this->estimated_hours) * 100);

        return $percentage;
    }

    /**
     * Get time remaining in hours.
     */
    public function getTimeRemaining(): ?float
    {
        if ($this->estimated_hours === null) {
            return null;
        }

        $actual = $this->actual_hours ?? 0;

        return max(0, $this->estimated_hours - $actual);
    }

    /**
     * Mark task as complete.
     */
    public function markComplete(): void
    {
        $this->update([
            'status' => 'done',
            'completed_at' => now(),
        ]);
    }

    /**
     * Mark task as incomplete.
     */
    public function markIncomplete(): void
    {
        $this->update([
            'status' => 'todo',
            'completed_at' => null,
        ]);
    }
}
