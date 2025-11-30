<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityLogResource;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminActivityController extends Controller
{
    /**
     * Display the activity log dashboard.
     */
    public function index(Request $request): Response
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $query = ActivityLog::query()->with('actor');

        // Filter by action type
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filter by entity type
        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->entity_type);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('actor_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Search in metadata
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('entity_type', 'like', "%{$search}%")
                    ->orWhereHas('actor', function ($aq) use ($search) {
                        $aq->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $activities = $query->orderByDesc('created_at')->paginate(50);

        // Get stats
        $stats = [
            'total_today' => ActivityLog::whereDate('created_at', today())->count(),
            'total_week' => ActivityLog::where('created_at', '>=', now()->subWeek())->count(),
            'total_month' => ActivityLog::where('created_at', '>=', now()->subMonth())->count(),
            'points_awarded_today' => ActivityLog::whereDate('created_at', today())->sum('points_value'),
            'unique_users_today' => ActivityLog::whereDate('created_at', today())->distinct('actor_id')->count('actor_id'),
        ];

        // Get action types for filter
        $actionTypes = ActivityLog::select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action');

        // Get entity types for filter
        $entityTypes = ActivityLog::select('entity_type')
            ->distinct()
            ->orderBy('entity_type')
            ->pluck('entity_type');

        // Get top users by activity
        $topUsers = User::query()
            ->withCount(['activityLogs as activity_count' => function ($q) {
                $q->where('created_at', '>=', now()->subMonth());
            }])
            ->withSum(['activityLogs as points_total' => function ($q) {
                $q->where('created_at', '>=', now()->subMonth());
            }], 'points_value')
            ->orderByDesc('activity_count')
            ->limit(10)
            ->get(['id', 'first_name', 'last_name', 'email']);

        return Inertia::render('admin/activity/index', [
            'activities' => ActivityLogResource::collection($activities),
            'stats' => $stats,
            'actionTypes' => $actionTypes,
            'entityTypes' => $entityTypes,
            'topUsers' => $topUsers,
            'filters' => $request->only(['action', 'entity_type', 'user_id', 'from_date', 'to_date', 'search']),
        ]);
    }

    /**
     * Display activity for a specific user.
     */
    public function userActivity(Request $request, User $user): Response
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $activities = $user->activityLogs()
            ->orderByDesc('created_at')
            ->paginate(50);

        $stats = [
            'total_activities' => $user->activityLogs()->count(),
            'total_points' => $user->activityLogs()->sum('points_value'),
            'activities_this_month' => $user->activityLogs()->where('created_at', '>=', now()->subMonth())->count(),
        ];

        return Inertia::render('admin/activity/user', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'activities' => ActivityLogResource::collection($activities),
            'stats' => $stats,
        ]);
    }
}
