<?php

namespace App\Http\Controllers;

use App\Http\Resources\LibraryItemResource;
use App\Models\LibraryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicLibraryController extends Controller
{
    /**
     * Display the public library page.
     */
    public function index(Request $request): Response
    {
        $query = LibraryItem::query()
            ->published()
            ->where('access_level', 'public')
            ->with(['pillars', 'themes', 'author']);

        // Filter by Content Type
        if ($request->filled('type') && $request->type !== 'all') {
            switch ($request->type) {
                case 'read':
                    $query->whereIn('content_type', ['article', 'briefing', 'guide']);
                    break;
                case 'watch':
                    $query->whereIn('content_type', ['video', 'recording']);
                    break;
                case 'listen':
                    $query->whereIn('content_type', ['audio']);
                    break;
            }
        }

        // Filter by Pillar
        if ($request->filled('pillar') && $request->pillar !== 'all') {
            $query->whereHas('pillars', fn ($q) => $q->where('name', $request->pillar));
        }

        $items = $query->orderByDesc('published_at')->paginate(12)->withQueryString();

        return Inertia::render('library', [
            'items' => LibraryItemResource::collection($items),
            'filters' => $request->only(['type', 'pillar']),
        ]);
    }

    /**
     * Display a public library item.
     */
    public function show(LibraryItem $item): Response
    {
        if ($item->status !== 'published' || $item->access_level !== 'public') {
            abort(404);
        }

        $item->load(['pillars', 'themes', 'author', 'program']);

        return Inertia::render('library/public-show', [
            'item' => new LibraryItemResource($item),
            'relatedItems' => LibraryItemResource::collection(
                LibraryItem::query()
                    ->published()
                    ->where('access_level', 'public')
                    ->where('id', '!=', $item->id)
                    ->where(function ($q) use ($item) {
                        $q->whereHas('pillars', fn ($pq) => $pq->whereIn('pillars.id', $item->pillars->pluck('id')));
                    })
                    ->limit(3)
                    ->get()
            ),
        ]);
    }
}
