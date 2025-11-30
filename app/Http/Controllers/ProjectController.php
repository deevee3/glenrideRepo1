<?php

namespace App\Http\Controllers;

use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\StoreTaskRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Http\Requests\Projects\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Models\Pillar;
use App\Models\Project;
use App\Models\Task;
use App\Models\Theme;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display the projects listing.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // User's projects
        $userProjects = $user->projects()
            ->with(['pillars', 'creator'])
            ->withCount(['tasks', 'members'])
            ->wherePivot('is_active', true)
            ->get();

        return Inertia::render('projects/index', [
            'userProjects' => ProjectResource::collection($userProjects),
            'pillars' => Pillar::all(['id', 'name']),
            'themes' => Theme::all(['id', 'name', 'slug']),
        ]);
    }

    /**
     * Display a project's workspace.
     */
    public function show(Request $request, Project $project): Response
    {
        $user = $request->user();

        // Check if user is a member
        $membership = $project->memberRecords()->where('user_id', $user->id)->first();

        if (! $membership) {
            abort(403, 'You are not a member of this project.');
        }

        $project->load([
            'pillars',
            'themes',
            'members',
            'creator',
            'program',
            'tasks' => fn ($q) => $q->with(['assignee', 'creator'])
                ->orderByRaw("CASE status WHEN 'in_progress' THEN 1 WHEN 'todo' THEN 2 WHEN 'review' THEN 3 WHEN 'done' THEN 4 WHEN 'archived' THEN 5 ELSE 6 END")
                ->orderByRaw("CASE WHEN due_date IS NOT NULL AND due_date < DATE('now') AND status NOT IN ('done', 'archived') THEN 0 ELSE 1 END")
                ->orderBy('sort_order')
                ->orderBy('priority', 'desc'),
            'reflections' => fn ($q) => $q->with('author')->latest()->limit(5),
        ]);

        return Inertia::render('projects/show', [
            'project' => new ProjectResource($project),
            'userRole' => $membership->role,
            'tasks' => TaskResource::collection($project->tasks),
        ]);
    }

    /**
     * Store a new project.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $project = Project::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']).'-'.Str::random(6),
            'summary' => $validated['summary'] ?? null,
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? 'idea',
            'created_by' => $user->id,
            'program_id' => $validated['program_id'] ?? null,
        ]);

        // Attach pillars and themes
        if (! empty($validated['pillar_ids'])) {
            $project->pillars()->attach($validated['pillar_ids']);
        }
        if (! empty($validated['theme_ids'])) {
            $project->themes()->attach($validated['theme_ids']);
        }

        // Add creator as lead member
        $project->members()->attach($user->id, [
            'role' => 'lead',
            'is_active' => true,
            'joined_at' => now(),
        ]);

        // Log project creation
        ActivityLogService::log('project_created', 'project', $project->id, $user, [
            'title' => $project->title,
            'slug' => $project->slug,
            'status' => $project->status,
            'url' => "/projects/{$project->slug}",
        ]);

        return to_route('projects.show', $project)->with('success', 'Project created successfully.');
    }

    /**
     * Update a project.
     */
    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $validated = $request->validated();

        $project->update([
            'title' => $validated['title'] ?? $project->title,
            'summary' => $validated['summary'] ?? $project->summary,
            'description' => $validated['description'] ?? $project->description,
            'status' => $validated['status'] ?? $project->status,
        ]);

        // Sync pillars and themes if provided
        if (isset($validated['pillar_ids'])) {
            $project->pillars()->sync($validated['pillar_ids']);
        }
        if (isset($validated['theme_ids'])) {
            $project->themes()->sync($validated['theme_ids']);
        }

        return back()->with('success', 'Project updated successfully.');
    }

    /**
     * Store a new task.
     */
    public function storeTask(StoreTaskRequest $request, Project $project): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        // Get max sort_order for the project to add new task at the end
        $maxSortOrder = $project->tasks()->max('sort_order') ?? 0;

        $task = Task::create([
            'project_id' => $project->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? 'todo',
            'priority' => $validated['priority'] ?? 'medium',
            'created_by' => $user->id,
            'assigned_to' => $validated['assigned_to'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'start_date' => $validated['start_date'] ?? null,
            'estimated_hours' => $validated['estimated_hours'] ?? null,
            'labels' => $validated['labels'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'sort_order' => $maxSortOrder + 1,
        ]);

        // Log task creation
        ActivityLogService::log('task_created', 'task', $task->id, $user, [
            'title' => $task->title,
            'project_id' => $project->id,
            'project_title' => $project->title,
            'project_slug' => $project->slug,
            'url' => "/projects/{$project->slug}",
        ]);

        return back()->with('success', 'Task created successfully.');
    }

    /**
     * Update a task.
     */
    public function updateTask(UpdateTaskRequest $request, Project $project, Task $task): RedirectResponse
    {
        $validated = $request->validated();

        // Handle status transitions with completed_at timestamp
        if (isset($validated['status'])) {
            if ($validated['status'] === 'done' && $task->status !== 'done') {
                // Task is being marked as complete
                $validated['completed_at'] = now();
            } elseif ($validated['status'] !== 'done' && $task->status === 'done') {
                // Task is being reopened
                $validated['completed_at'] = null;
            }
        }

        $wasCompleted = $task->status === 'done';
        $task->update($validated);

        // Log task completion (only when status changes to done)
        if (! $wasCompleted && $task->status === 'done') {
            ActivityLogService::log('task_completed', 'task', $task->id, $request->user(), [
                'title' => $task->title,
                'project_id' => $project->id,
                'project_title' => $project->title,
                'project_slug' => $project->slug,
                'url' => "/projects/{$project->slug}",
            ]);
        }

        return back()->with('success', 'Task updated successfully.');
    }

    /**
     * Delete a task.
     */
    public function destroyTask(Request $request, Project $project, Task $task): RedirectResponse
    {
        $task->delete();

        return back()->with('success', 'Task deleted successfully.');
    }
}
