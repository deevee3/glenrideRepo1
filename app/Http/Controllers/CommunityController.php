<?php

namespace App\Http\Controllers;

use App\Http\Requests\Community\StorePostRequest;
use App\Http\Requests\Community\UpdatePostRequest;
use App\Http\Resources\ChannelResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\UserResource;
use App\Models\Channel;
use App\Models\ChannelMembership;
use App\Models\Post;
use App\Models\PostReaction;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommunityController extends Controller
{
    /**
     * Display the community hub.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get all channels the user can access
        $channels = Channel::query()
            ->where(function ($query) use ($user) {
                $query->where('visibility', 'public')
                    ->orWhere('visibility', 'members')
                    ->orWhereHas('memberships', fn ($q) => $q->where('user_id', $user->id));
            })
            ->whereNull('program_id') // Global channels only
            ->withCount('posts')
            ->get();

        // Recent activity feed
        $recentPosts = Post::query()
            ->visible()
            ->whereHas('channel', function ($query) {
                $query->where('visibility', 'public')
                    ->orWhere('visibility', 'members');
            })
            ->with(['author', 'channel'])
            ->whereNull('parent_post_id')
            ->latest()
            ->limit(10)
            ->get();

        // People directory (sample)
        $members = User::query()
            ->where('status', 'active')
            ->where('id', '!=', $user->id)
            ->with(['roles', 'pillars'])
            ->inRandomOrder()
            ->limit(6)
            ->get();

        return Inertia::render('community/index', [
            'channels' => ChannelResource::collection($channels),
            'recentPosts' => PostResource::collection($recentPosts),
            'members' => UserResource::collection($members),
        ]);
    }

    /**
     * Display a channel.
     */
    public function showChannel(Request $request, Channel $channel): Response
    {
        $user = $request->user();

        // Get or create membership
        $isNewMember = !ChannelMembership::where('channel_id', $channel->id)
            ->where('user_id', $user->id)
            ->exists();

        $membership = ChannelMembership::firstOrCreate(
            ['channel_id' => $channel->id, 'user_id' => $user->id],
            ['role' => 'member', 'joined_at' => now()]
        );

        // Log channel join (only for new members)
        if ($isNewMember) {
            ActivityLogService::log('channel_joined', 'channel', $channel->id, $user, [
                'channel_name' => $channel->name,
                'channel_display_name' => $channel->display_name,
            ]);
        }

        // Get posts with pagination
        $posts = $channel->rootPosts()
            ->visible()
            ->with(['author', 'replies' => fn ($q) => $q->visible()->with('author')->latest(), 'reactions'])
            ->withCount('replies')
            ->latest()
            ->paginate(20);

        // Update last read
        $latestPost = $posts->first();
        if ($latestPost) {
            $membership->update([
                'last_read_post_id' => $latestPost->id,
                'last_read_at' => now(),
            ]);
        }

        return Inertia::render('community/channel', [
            'channel' => new ChannelResource($channel),
            'posts' => PostResource::collection($posts),
            'membership' => [
                'role' => $membership->role,
                'notification_level' => $membership->notification_level,
            ],
        ]);
    }

    /**
     * Store a new post.
     */
    public function storePost(StorePostRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $post = Post::create([
            'channel_id' => $validated['channel_id'] ?? null,
            'author_id' => $user->id,
            'body' => $validated['body'],
            'parent_post_id' => $validated['parent_post_id'] ?? null,
            'context_type' => $validated['context_type'] ?? 'channel',
            'context_id' => $validated['context_id'] ?? null,
        ]);

        // Log post creation (reply vs new post)
        $action = isset($validated['parent_post_id']) ? 'post_replied' : 'post_created';
        $channel = $post->channel;
        ActivityLogService::log($action, 'post', $post->id, $user, [
            'channel_id' => $channel?->id,
            'channel_name' => $channel?->name,
            'is_reply' => isset($validated['parent_post_id']),
            'body_preview' => substr($post->body, 0, 100),
        ]);

        return back()->with('success', 'Post created successfully.');
    }

    /**
     * Update a post.
     */
    public function updatePost(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $user = $request->user();

        if ($post->author_id !== $user->id) {
            abort(403, 'You can only edit your own posts.');
        }

        $post->update([
            'body' => $request->validated('body'),
            'is_edited' => true,
        ]);

        return back()->with('success', 'Post updated successfully.');
    }

    /**
     * Delete a post (soft delete).
     */
    public function destroyPost(Request $request, Post $post): RedirectResponse
    {
        $user = $request->user();

        if ($post->author_id !== $user->id) {
            abort(403, 'You can only delete your own posts.');
        }

        $post->update(['is_deleted' => true]);

        return back()->with('success', 'Post deleted successfully.');
    }

    /**
     * Toggle a reaction on a post.
     */
    public function toggleReaction(Request $request, Post $post): RedirectResponse
    {
        $user = $request->user();
        $reactionType = $request->validate(['reaction_type' => ['required', 'in:like,insightful,support,celebrate']])['reaction_type'];

        $existing = PostReaction::where('post_id', $post->id)
            ->where('user_id', $user->id)
            ->where('reaction_type', $reactionType)
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            PostReaction::create([
                'post_id' => $post->id,
                'user_id' => $user->id,
                'reaction_type' => $reactionType,
            ]);

            // Log reaction (only when adding, not removing)
            ActivityLogService::log('post_reacted', 'post', $post->id, $user, [
                'reaction_type' => $reactionType,
                'channel_id' => $post->channel?->id,
                'channel_name' => $post->channel?->name,
            ]);
        }

        return back();
    }

    /**
     * Display the people directory.
     */
    public function people(Request $request): Response
    {
        $user = $request->user();

        $query = User::query()
            ->where('status', 'active')
            ->with(['roles', 'pillars', 'skills']);

        // Filter by pillar
        if ($request->filled('pillar')) {
            $query->whereHas('pillars', fn ($q) => $q->where('pillars.id', $request->pillar));
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->whereHas('roles', fn ($q) => $q->where('roles.name', $request->role));
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%");
            });
        }

        $members = $query->paginate(24);

        return Inertia::render('community/people', [
            'members' => UserResource::collection($members),
            'filters' => $request->only(['pillar', 'role', 'search']),
        ]);
    }
}
