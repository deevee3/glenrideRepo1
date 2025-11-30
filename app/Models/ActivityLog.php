<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'activity_log';

    protected $fillable = [
        'actor_id',
        'action',
        'entity_type',
        'entity_id',
        'metadata',
        'points_value',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'json',
            'points_value' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    /**
     * Log an activity (basic method for backward compatibility).
     * Prefer using ActivityLogService for new code.
     */
    public static function log(string $action, string $entityType, ?string $entityId = null, ?User $actor = null, ?array $metadata = null): self
    {
        return self::create([
            'actor_id' => $actor?->id,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'metadata' => $metadata,
            'points_value' => 0,
        ]);
    }

    /**
     * Scope to filter by action type.
     *
     * @param  \Illuminate\Database\Eloquent\Builder<self>  $query
     * @return \Illuminate\Database\Eloquent\Builder<self>
     */
    public function scopeAction(\Illuminate\Database\Eloquent\Builder $query, string $action): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('action', $action);
    }

    /**
     * Scope to filter by entity type.
     *
     * @param  \Illuminate\Database\Eloquent\Builder<self>  $query
     * @return \Illuminate\Database\Eloquent\Builder<self>
     */
    public function scopeForEntity(\Illuminate\Database\Eloquent\Builder $query, string $entityType, ?string $entityId = null): \Illuminate\Database\Eloquent\Builder
    {
        $query->where('entity_type', $entityType);

        if ($entityId !== null) {
            $query->where('entity_id', $entityId);
        }

        return $query;
    }

    /**
     * Scope to filter by actor.
     *
     * @param  \Illuminate\Database\Eloquent\Builder<self>  $query
     * @return \Illuminate\Database\Eloquent\Builder<self>
     */
    public function scopeByActor(\Illuminate\Database\Eloquent\Builder $query, User|string $actor): \Illuminate\Database\Eloquent\Builder
    {
        $actorId = $actor instanceof User ? $actor->id : $actor;

        return $query->where('actor_id', $actorId);
    }

    /**
     * Get a human-readable description of the action.
     */
    public function getDescriptionAttribute(): string
    {
        $actorName = $this->actor?->name ?? 'System';
        $action = str_replace('_', ' ', $this->action);

        return "{$actorName} {$action}";
    }
}
