<?php

namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Http\Resources\LibraryItemResource;
use App\Http\Resources\NotificationResource;
use App\Http\Resources\ProgramCohortResource;
use App\Http\Resources\ProjectResource;
use App\Models\Event;
use App\Models\LibraryItem;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user's dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Your active involvements (programs and projects)
        $activeCohorts = $user->cohorts()
            ->with(['program.pillars', 'sessions' => fn ($q) => $q->where('starts_at', '>', now())->orderBy('starts_at')->limit(1)])
            ->wherePivot('status', 'active')
            ->get();

        $activeProjects = $user->projects()
            ->with(['pillars'])
            ->wherePivot('is_active', true)
            ->limit(5)
            ->get();

        // Upcoming events
        $upcomingEvents = Event::query()
            ->where('starts_at', '>', now())
            ->where(function ($query) {
                $query->where('visibility', 'public')
                    ->orWhere('visibility', 'members');
            })
            ->with('program')
            ->orderBy('starts_at')
            ->limit(3)
            ->get();

        // Recent library items
        $recentLibraryItems = LibraryItem::query()
            ->published()
            ->where(function ($query) {
                $query->where('access_level', 'public')
                    ->orWhere('access_level', 'members');
            })
            ->with('pillars', 'author')
            ->orderByDesc('published_at')
            ->limit(3)
            ->get();

        // Unread notifications
        $unreadNotifications = $user->notifications()
            ->unread()
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // Open programs (for discovery section)
        $openPrograms = Program::query()
            ->where('status', 'active')
            ->where('is_public', true)
            ->where(function ($query) {
                $query->whereNull('application_close_at')
                    ->orWhere('application_close_at', '>=', now());
            })
            ->with('pillars')
            ->limit(3)
            ->get();

        return Inertia::render('dashboard', [
            'activeCohorts' => ProgramCohortResource::collection($activeCohorts),
            'activeProjects' => ProjectResource::collection($activeProjects),
            'upcomingEvents' => EventResource::collection($upcomingEvents),
            'recentLibraryItems' => LibraryItemResource::collection($recentLibraryItems),
            'unreadNotifications' => NotificationResource::collection($unreadNotifications),
            'openPrograms' => $openPrograms->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'short_description' => $p->short_description,
                'program_type' => $p->program_type,
                'pillars' => $p->pillars->pluck('name'),
                'application_close_at' => $p->application_close_at,
            ]),
        ]);
    }
}
