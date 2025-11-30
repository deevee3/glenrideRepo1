<?php

namespace App\Http\Controllers;

use App\Http\Requests\Library\StoreLibraryItemRequest;
use App\Http\Resources\LibraryItemResource;
use App\Http\Resources\PillarResource;
use App\Http\Resources\ProgramResource;
use App\Http\Resources\ThemeResource;
use App\Models\LibraryItem;
use App\Models\LibraryItemView;
use App\Models\Pillar;
use App\Models\Program;
use App\Models\Theme;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LibraryController extends Controller
{
    /**
     * Display the library (logged-in view with extra features).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = LibraryItem::query()
            ->published()
            ->where(function ($q) {
                $q->where('access_level', 'public')
                    ->orWhere('access_level', 'members');
            })
            ->with(['pillars', 'themes', 'author']);

        // Filter by pillar
        if ($request->filled('pillar')) {
            $query->whereHas('pillars', fn ($q) => $q->where('pillars.id', $request->pillar));
        }

        // Filter by theme
        if ($request->filled('theme')) {
            $query->whereHas('themes', fn ($q) => $q->where('themes.id', $request->theme));
        }

        // Filter by content type
        if ($request->filled('type')) {
            $query->where('content_type', $request->type);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $items = $query->orderByDesc('published_at')->paginate(12);

        // Personalized recommendations based on user's pillars
        $recommendedItems = LibraryItem::query()
            ->published()
            ->where('access_level', 'members')
            ->whereHas('pillars', fn ($q) => $q->whereIn('pillars.id', $user->pillars->pluck('id')))
            ->with(['pillars', 'author'])
            ->orderByDesc('published_at')
            ->limit(4)
            ->get();

        return Inertia::render('library/index', [
            'items' => LibraryItemResource::collection($items),
            'recommendedItems' => LibraryItemResource::collection($recommendedItems),
            'pillars' => PillarResource::collection(Pillar::all()),
            'themes' => ThemeResource::collection(Theme::all()),
            'contentTypes' => ['article', 'video', 'audio', 'briefing', 'guide', 'recording'],
            'filters' => $request->only(['pillar', 'theme', 'type', 'search']),
            'canCreate' => $user->can('create', LibraryItem::class),
        ]);
    }

    /**
     * Show the form for creating a new library item.
     */
    public function create(): Response
    {
        $programs = Program::query()
            ->whereIn('status', ['active', 'upcoming'])
            ->orderBy('title')
            ->get();

        return Inertia::render('library/create', [
            'pillars' => PillarResource::collection(Pillar::all()),
            'themes' => ThemeResource::collection(Theme::all()),
            'programs' => ProgramResource::collection($programs),
            'contentTypes' => ['article', 'video', 'audio', 'briefing', 'guide', 'recording', 'other'],
            'accessLevels' => ['public', 'members', 'program_members', 'cohort_members'],
            'statuses' => ['draft', 'published'],
        ]);
    }

    /**
     * Store a newly created library item.
     */
    public function store(StoreLibraryItemRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $data['author_id'] = $request->user()->id;

        // Set published_at if status is published
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        // Transform rich_content to JSON structure
        if (isset($data['rich_content']) && is_string($data['rich_content'])) {
            $data['rich_content'] = ['body' => $data['rich_content']];
        }

        $item = LibraryItem::create($data);

        // Attach pillars and themes
        if (! empty($data['pillars'])) {
            $item->pillars()->sync($data['pillars']);
        }
        if (! empty($data['themes'])) {
            $item->themes()->sync($data['themes']);
        }

        // Log the creation
        $action = $data['status'] === 'published' ? 'library_item_published' : 'library_item_created';
        ActivityLogService::log($action, 'library_item', $item->id, $request->user(), [
            'title' => $item->title,
            'slug' => $item->slug,
            'content_type' => $item->content_type,
            'url' => "/library/items/{$item->slug}",
        ]);

        return to_route('library.show', $item)->with('success', 'Library item created successfully.');
    }

    /**
     * Show the form for editing a library item.
     */
    public function edit(LibraryItem $item): Response
    {
        $item->load(['pillars', 'themes', 'program']);

        // Transform rich_content back to string for the form if it's an array/object
        if (is_array($item->rich_content) && isset($item->rich_content['body'])) {
            $item->rich_content = $item->rich_content['body'];
        }

        $programs = Program::query()
            ->whereIn('status', ['active', 'upcoming'])
            ->orderBy('title')
            ->get();

        return Inertia::render('library/edit', [
            'item' => new LibraryItemResource($item),
            'pillars' => PillarResource::collection(Pillar::all()),
            'themes' => ThemeResource::collection(Theme::all()),
            'programs' => ProgramResource::collection($programs),
            'contentTypes' => ['article', 'video', 'audio', 'briefing', 'guide', 'recording', 'other'],
            'accessLevels' => ['public', 'members', 'program_members', 'cohort_members'],
            'statuses' => ['draft', 'published', 'archived'],
        ]);
    }

    /**
     * Update the specified library item.
     */
    public function update(StoreLibraryItemRequest $request, LibraryItem $item): RedirectResponse
    {
        $data = $request->validated();

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        // Set published_at if status is being changed to published
        if ($data['status'] === 'published' && $item->status !== 'published') {
            $data['published_at'] = now();
        }

        // Transform rich_content to JSON structure
        if (isset($data['rich_content']) && is_string($data['rich_content'])) {
            $data['rich_content'] = ['body' => $data['rich_content']];
        }

        $item->update($data);

        // Sync pillars and themes
        if (isset($data['pillars'])) {
            $item->pillars()->sync($data['pillars']);
        }
        if (isset($data['themes'])) {
            $item->themes()->sync($data['themes']);
        }

        // Log the update (or publish if status changed to published)
        $action = ($data['status'] === 'published' && $item->wasChanged('status'))
            ? 'library_item_published'
            : 'library_item_updated';
        ActivityLogService::log($action, 'library_item', $item->id, $request->user(), [
            'title' => $item->title,
            'slug' => $item->slug,
            'url' => "/library/items/{$item->slug}",
        ]);

        return to_route('library.show', $item)->with('success', 'Library item updated successfully.');
    }

    /**
     * Delete the specified library item.
     */
    public function destroy(LibraryItem $item): RedirectResponse
    {
        $item->delete();

        return to_route('library.index')->with('success', 'Library item deleted successfully.');
    }

    /**
     * Display a library item.
     */
    public function show(Request $request, LibraryItem $item): Response
    {
        $user = $request->user();

        // Check access
        if ($item->status !== 'published') {
            abort(404);
        }

        if ($item->access_level === 'program_members' && ! $user->cohorts()->where('program_id', $item->program_id)->exists()) {
            abort(403, 'This content is only available to program members.');
        }

        $item->load(['pillars', 'themes', 'author', 'program']);

        // Record view and log activity (only for first view)
        $isFirstView = LibraryItemView::where('library_item_id', $item->id)
            ->where('user_id', $user->id)
            ->doesntExist();

        LibraryItemView::firstOrCreate(
            ['library_item_id' => $item->id, 'user_id' => $user->id],
            ['viewed_at' => now()]
        );

        if ($isFirstView) {
            ActivityLogService::log('library_item_viewed', 'library_item', $item->id, $user, [
                'title' => $item->title,
                'slug' => $item->slug,
                'content_type' => $item->content_type,
                'url' => "/library/items/{$item->slug}",
            ]);
        }

        // Related items
        $relatedItems = LibraryItem::query()
            ->published()
            ->where('id', '!=', $item->id)
            ->where(function ($q) use ($item) {
                $q->whereHas('pillars', fn ($pq) => $pq->whereIn('pillars.id', $item->pillars->pluck('id')))
                    ->orWhereHas('themes', fn ($tq) => $tq->whereIn('themes.id', $item->themes->pluck('id')));
            })
            ->with(['pillars', 'author'])
            ->limit(4)
            ->get();

        return Inertia::render('library/show', [
            'item' => new LibraryItemResource($item),
            'relatedItems' => LibraryItemResource::collection($relatedItems),
        ]);
    }
}
