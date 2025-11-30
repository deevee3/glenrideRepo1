<?php

namespace App\Http\Controllers;

use App\Http\Requests\Events\StoreEventRequest;
use App\Http\Resources\EventResource;
use App\Http\Resources\ProgramResource;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\Program;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Display the events listing.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Upcoming events
        $upcomingEvents = Event::query()
            ->where('starts_at', '>', now())
            ->where(function ($query) {
                $query->where('visibility', 'public')
                    ->orWhere('visibility', 'members');
            })
            ->with(['program', 'creator'])
            ->withCount('registrants')
            ->orderBy('starts_at')
            ->paginate(12);

        // Add user's registration status to each event
        $upcomingEvents->getCollection()->transform(function ($event) use ($user) {
            $registration = EventRegistration::where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->first();

            $event->user_registration = $registration ? [
                'status' => $registration->status,
                'registered_at' => $registration->registered_at,
            ] : null;

            return $event;
        });

        // User's registered events
        $myEvents = $user->registeredEvents()
            ->where('starts_at', '>', now())
            ->with('program')
            ->orderBy('starts_at')
            ->limit(5)
            ->get();

        return Inertia::render('events/index', [
            'upcomingEvents' => EventResource::collection($upcomingEvents),
            'myEvents' => EventResource::collection($myEvents),
            'canCreate' => $user->can('create', Event::class),
        ]);
    }

    /**
     * Show the form for creating a new event.
     */
    public function create(): Response
    {
        $programs = Program::query()
            ->whereIn('status', ['active', 'upcoming'])
            ->orderBy('title')
            ->get();

        return Inertia::render('events/create', [
            'programs' => ProgramResource::collection($programs),
            'locationTypes' => ['online', 'in_person', 'hybrid'],
            'visibilities' => ['public', 'members', 'program_only', 'cohort_only'],
        ]);
    }

    /**
     * Store a newly created event.
     */
    public function store(StoreEventRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;

        $event = Event::create($data);

        // Log event creation
        ActivityLogService::log('event_created', 'event', $event->id, $request->user(), [
            'title' => $event->title,
            'starts_at' => $event->starts_at,
            'location_type' => $event->location_type,
            'url' => "/events/{$event->id}",
        ]);

        return to_route('events.show', $event)->with('success', 'Event created successfully.');
    }

    /**
     * Show the form for editing an event.
     */
    public function edit(Event $event): Response
    {
        $event->load(['program', 'cohort']);

        $programs = Program::query()
            ->whereIn('status', ['active', 'upcoming'])
            ->orderBy('title')
            ->get();

        return Inertia::render('events/edit', [
            'event' => new EventResource($event),
            'programs' => ProgramResource::collection($programs),
            'locationTypes' => ['online', 'in_person', 'hybrid'],
            'visibilities' => ['public', 'members', 'program_only', 'cohort_only'],
        ]);
    }

    /**
     * Update the specified event.
     */
    public function update(StoreEventRequest $request, Event $event): RedirectResponse
    {
        $event->update($request->validated());

        return to_route('events.show', $event)->with('success', 'Event updated successfully.');
    }

    /**
     * Delete the specified event.
     */
    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        return to_route('events.index')->with('success', 'Event deleted successfully.');
    }

    /**
     * Display an event's details.
     */
    public function show(Request $request, Event $event): Response
    {
        $user = $request->user();

        $event->load(['program', 'cohort', 'creator']);
        $event->loadCount('registrants');

        $registration = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        $event->user_registration = $registration ? [
            'id' => $registration->id,
            'status' => $registration->status,
            'registered_at' => $registration->registered_at,
        ] : null;

        return Inertia::render('events/show', [
            'event' => new EventResource($event),
        ]);
    }

    /**
     * Register for an event.
     */
    public function register(Request $request, Event $event): RedirectResponse
    {
        $user = $request->user();

        // Check if already registered
        $existing = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return back()->withErrors(['general' => 'You are already registered for this event.']);
        }

        EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'status' => 'registered',
            'registered_at' => now(),
        ]);

        // Log event registration
        ActivityLogService::log('event_registered', 'event', $event->id, $user, [
            'title' => $event->title,
            'starts_at' => $event->starts_at,
            'url' => "/events/{$event->id}",
        ]);

        return back()->with('success', 'You have been registered for this event.');
    }

    /**
     * Cancel event registration.
     */
    public function cancelRegistration(Request $request, Event $event): RedirectResponse
    {
        $user = $request->user();

        $registration = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if (! $registration) {
            return back()->withErrors(['general' => 'You are not registered for this event.']);
        }

        $registration->update(['status' => 'cancelled']);

        return back()->with('success', 'Your registration has been cancelled.');
    }
}
