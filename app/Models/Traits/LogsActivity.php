<?php

namespace App\Models\Traits;

use App\Services\ActivityLogService;
use Illuminate\Support\Facades\Auth;

/**
 * Trait for automatically logging model create/update/delete events.
 *
 * Use this on models where you want automatic audit trail logging.
 * The trait uses model observers to capture events without manual intervention.
 *
 * Usage:
 *   class Project extends Model
 *   {
 *       use LogsActivity;
 *
 *       // Optionally customize which events to log
 *       protected static array $logEvents = ['created', 'updated', 'deleted'];
 *
 *       // Optionally specify attributes to exclude from change tracking
 *       protected static array $logExcept = ['updated_at'];
 *   }
 */
trait LogsActivity
{
    /**
     * Boot the LogsActivity trait.
     */
    public static function bootLogsActivity(): void
    {
        static::created(function ($model) {
            if (static::shouldLogEvent('created')) {
                ActivityLogService::created($model, Auth::user());
            }
        });

        static::updated(function ($model) {
            if (static::shouldLogEvent('updated')) {
                $changedFields = static::getChangedFields($model);
                if (! empty($changedFields)) {
                    ActivityLogService::updated($model, Auth::user(), $changedFields);
                }
            }
        });

        static::deleted(function ($model) {
            if (static::shouldLogEvent('deleted')) {
                ActivityLogService::deleted($model, Auth::user());
            }
        });
    }

    /**
     * Check if a specific event type should be logged.
     */
    protected static function shouldLogEvent(string $event): bool
    {
        $events = property_exists(static::class, 'logEvents')
            ? static::$logEvents
            : ['created', 'updated', 'deleted'];

        return in_array($event, $events);
    }

    /**
     * Get the list of changed fields, excluding specified attributes.
     *
     * @return array<string>
     */
    protected static function getChangedFields(self $model): array
    {
        $except = property_exists(static::class, 'logExcept')
            ? static::$logExcept
            : ['updated_at', 'created_at'];

        $changed = $model->getDirty();

        return array_keys(array_diff_key($changed, array_flip($except)));
    }
}
