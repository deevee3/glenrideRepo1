<?php

namespace App\Http\Controllers;

use App\Http\Requests\Programs\ProgramApplicationRequest;
use App\Http\Requests\Programs\StoreProgramRequest;
use App\Http\Resources\PillarResource;
use App\Http\Resources\ProgramResource;
use App\Http\Resources\ThemeResource;
use App\Models\Pillar;
use App\Models\Program;
use App\Models\ProgramApplication;
use App\Models\Theme;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProgramController extends Controller
{
    /**
     * Display the programs listing.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // User's enrolled programs
        $userCohorts = $user->cohorts()
            ->with(['program.pillars', 'sessions' => fn ($q) => $q->where('starts_at', '>', now())->orderBy('starts_at')->limit(1)])
            ->wherePivot('status', 'active')
            ->get();

        // All public programs
        $programs = Program::query()
            ->where('is_public', true)
            ->whereIn('status', ['active', 'upcoming'])
            ->with(['pillars', 'themes'])
            ->withCount('cohorts')
            ->orderBy('status')
            ->orderBy('title')
            ->get();

        // Group by status
        $openPrograms = $programs->filter(fn ($p) => $p->isAcceptingApplications());
        $upcomingPrograms = $programs->filter(fn ($p) => ! $p->isAcceptingApplications() && $p->status === 'upcoming');
        $activePrograms = $programs->filter(fn ($p) => ! $p->isAcceptingApplications() && $p->status === 'active');

        return Inertia::render('programs/index', [
            'userCohorts' => $userCohorts->map(fn ($cohort) => [
                'id' => $cohort->id,
                'name' => $cohort->name,
                'status' => $cohort->status,
                'program' => [
                    'id' => $cohort->program->id,
                    'title' => $cohort->program->title,
                    'slug' => $cohort->program->slug,
                    'pillars' => $cohort->program->pillars->pluck('name'),
                ],
                'next_session' => $cohort->sessions->first() ? [
                    'title' => $cohort->sessions->first()->title,
                    'starts_at' => $cohort->sessions->first()->starts_at,
                ] : null,
            ]),
            'openPrograms' => ProgramResource::collection($openPrograms),
            'upcomingPrograms' => ProgramResource::collection($upcomingPrograms),
            'activePrograms' => ProgramResource::collection($activePrograms),
            'canCreate' => $user->can('create', Program::class),
        ]);
    }

    /**
     * Show the form for creating a new program.
     */
    public function create(): Response
    {
        return Inertia::render('programs/create', [
            'pillars' => PillarResource::collection(Pillar::all()),
            'themes' => ThemeResource::collection(Theme::all()),
            'programTypes' => ['fellowship', 'lab', 'school', 'incubator', 'studio', 'other'],
            'statuses' => ['draft', 'upcoming', 'active'],
        ]);
    }

    /**
     * Store a newly created program.
     */
    public function store(StoreProgramRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $data['created_by'] = $request->user()->id;

        $program = Program::create($data);

        // Attach pillars and themes
        if (! empty($data['pillars'])) {
            $program->pillars()->sync($data['pillars']);
        }
        if (! empty($data['themes'])) {
            $program->themes()->sync($data['themes']);
        }

        return to_route('programs.show', $program)->with('success', 'Program created successfully.');
    }

    /**
     * Show the form for editing a program.
     */
    public function edit(Program $program): Response
    {
        $program->load(['pillars', 'themes']);

        return Inertia::render('programs/edit', [
            'program' => new ProgramResource($program),
            'pillars' => PillarResource::collection(Pillar::all()),
            'themes' => ThemeResource::collection(Theme::all()),
            'programTypes' => ['fellowship', 'lab', 'school', 'incubator', 'studio', 'other'],
            'statuses' => ['draft', 'upcoming', 'active', 'completed', 'archived'],
        ]);
    }

    /**
     * Update the specified program.
     */
    public function update(StoreProgramRequest $request, Program $program): RedirectResponse
    {
        $data = $request->validated();

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $program->update($data);

        // Sync pillars and themes
        if (isset($data['pillars'])) {
            $program->pillars()->sync($data['pillars']);
        }
        if (isset($data['themes'])) {
            $program->themes()->sync($data['themes']);
        }

        return to_route('programs.show', $program)->with('success', 'Program updated successfully.');
    }

    /**
     * Display a program's details.
     */
    public function show(Request $request, Program $program): Response
    {
        $user = $request->user();

        $program->load(['pillars', 'themes', 'cohorts' => fn ($q) => $q->whereIn('status', ['upcoming', 'active']), 'creator']);

        // Check if user has already applied
        $existingApplication = ProgramApplication::where('user_id', $user->id)
            ->where('program_id', $program->id)
            ->first();

        // Check if user is already enrolled
        $isEnrolled = $user->cohorts()
            ->where('program_id', $program->id)
            ->wherePivot('status', 'active')
            ->exists();

        return Inertia::render('programs/show', [
            'program' => new ProgramResource($program),
            'existingApplication' => $existingApplication ? [
                'id' => $existingApplication->id,
                'status' => $existingApplication->status,
                'created_at' => $existingApplication->created_at,
            ] : null,
            'isEnrolled' => $isEnrolled,
        ]);
    }

    /**
     * Store a new program application.
     */
    public function apply(ProgramApplicationRequest $request, Program $program): RedirectResponse
    {
        $user = $request->user();

        // Check if already applied
        $existingApplication = ProgramApplication::where('user_id', $user->id)
            ->where('program_id', $program->id)
            ->whereIn('status', ['submitted', 'under_review'])
            ->exists();

        if ($existingApplication) {
            return back()->withErrors(['general' => 'You have already applied to this program.']);
        }

        $application = ProgramApplication::create([
            'user_id' => $user->id,
            'program_id' => $program->id,
            'program_cohort_id' => $request->validated('program_cohort_id'),
            'role_self_identified' => $request->validated('role_self_identified'),
            'location' => $request->validated('location') ?? $user->location,
            'background' => $request->validated('background'),
            'motivation' => $request->validated('motivation'),
            'how_they_want_to_collaborate' => $request->validated('how_they_want_to_collaborate'),
            'status' => 'submitted',
        ]);

        // Log program application
        ActivityLogService::log('program_applied', 'program', $program->id, $user, [
            'application_id' => $application->id,
            'program_title' => $program->title,
            'program_slug' => $program->slug,
            'program_type' => $program->program_type,
            'url' => "/programs/{$program->slug}",
        ]);

        return to_route('programs.show', $program)->with('success', 'Your application has been submitted successfully.');
    }
}
