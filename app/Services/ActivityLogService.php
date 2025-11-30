<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

/**
 * Centralized service for logging user activities and interactions.
 *
 * This service tracks all meaningful actions on the platform to:
 * 1. Provide an audit trail for accountability
 * 2. Enable future gamification/points system
 * 3. Power analytics and engagement metrics
 */
class ActivityLogService
{
    /**
     * Point values for different action types.
     * Higher points = more valuable contribution.
     *
     * @var array<string, int>
     */
    public const POINTS = [
        // Authentication & Profile
        'logged_in' => 1,
        'user_registered' => 5,
        'profile_updated' => 2,
        'avatar_uploaded' => 3,

        // Content Creation (high value)
        'library_item_created' => 15,
        'library_item_published' => 10,
        'library_item_updated' => 5,
        'library_item_viewed' => 1,

        // Community Engagement
        'post_created' => 10,
        'post_replied' => 5,
        'post_reacted' => 2,
        'channel_joined' => 3,

        // Events
        'event_created' => 15,
        'event_registered' => 5,
        'event_attended' => 10,

        // Projects
        'project_created' => 20,
        'project_joined' => 5,
        'task_created' => 8,
        'task_completed' => 10,
        'task_commented' => 3,
        'reflection_created' => 12,

        // Programs
        'program_applied' => 10,
        'program_accepted' => 0, // System action, no points
        'cohort_joined' => 5,
        'session_attended' => 8,
        'feedback_submitted' => 10,

        // Direct Messaging
        'dm_sent' => 2,
        'dm_thread_created' => 3,

        // Connections
        'connection_requested' => 3,
        'connection_accepted' => 3,

        // Admin Actions (no points)
        'user_created' => 0,
        'user_updated' => 0,
        'user_deleted' => 0,
        'role_assigned' => 0,
        'role_removed' => 0,

        // Default for unspecified actions
        'default' => 1,
    ];

    /**
     * Log an activity with full context.
     */
    public static function log(
        string $action,
        string $entityType,
        ?string $entityId = null,
        ?User $actor = null,
        ?array $metadata = null
    ): ActivityLog {
        $pointsValue = self::POINTS[$action] ?? self::POINTS['default'];

        return ActivityLog::create([
            'actor_id' => $actor?->id,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'metadata' => $metadata,
            'points_value' => $pointsValue,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    /**
     * Log activity for a model with automatic entity type extraction.
     */
    public static function logModel(
        string $action,
        Model $model,
        ?User $actor = null,
        ?array $metadata = null
    ): ActivityLog {
        $entityType = self::getEntityType($model);
        $entityId = $model->getKey();

        return self::log($action, $entityType, $entityId, $actor, $metadata);
    }

    /**
     * Log a creation action.
     */
    public static function created(Model $model, ?User $actor = null, ?array $metadata = null): ActivityLog
    {
        $entityType = self::getEntityType($model);
        $action = "{$entityType}_created";

        return self::logModel($action, $model, $actor, $metadata);
    }

    /**
     * Log an update action.
     */
    public static function updated(Model $model, ?User $actor = null, ?array $changedFields = null): ActivityLog
    {
        $entityType = self::getEntityType($model);
        $action = "{$entityType}_updated";

        $metadata = $changedFields ? ['changed_fields' => $changedFields] : null;

        return self::logModel($action, $model, $actor, $metadata);
    }

    /**
     * Log a deletion action.
     */
    public static function deleted(Model $model, ?User $actor = null, ?array $metadata = null): ActivityLog
    {
        $entityType = self::getEntityType($model);
        $action = "{$entityType}_deleted";

        return self::logModel($action, $model, $actor, $metadata);
    }

    /**
     * Log a view action.
     */
    public static function viewed(Model $model, ?User $actor = null): ActivityLog
    {
        $entityType = self::getEntityType($model);
        $action = "{$entityType}_viewed";

        return self::logModel($action, $model, $actor);
    }

    /**
     * Get the total points for a user.
     */
    public static function getUserPoints(User $user): int
    {
        return ActivityLog::where('actor_id', $user->id)->sum('points_value');
    }

    /**
     * Get activity feed for a user (their own actions).
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, ActivityLog>
     */
    public static function getUserActivity(User $user, int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return ActivityLog::where('actor_id', $user->id)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Get activity feed for an entity (all actions on that entity).
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, ActivityLog>
     */
    public static function getEntityActivity(Model $model, int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        $entityType = self::getEntityType($model);

        return ActivityLog::where('entity_type', $entityType)
            ->where('entity_id', $model->getKey())
            ->with('actor')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Get recent platform activity.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, ActivityLog>
     */
    public static function getRecentActivity(int $limit = 100): \Illuminate\Database\Eloquent\Collection
    {
        return ActivityLog::with('actor')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Extract entity type from a model class name.
     */
    private static function getEntityType(Model $model): string
    {
        // Convert App\Models\LibraryItem to library_item
        $className = class_basename($model);

        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $className));
    }
}
