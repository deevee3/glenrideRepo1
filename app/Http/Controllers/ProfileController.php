<?php

namespace App\Http\Controllers;

use App\Http\Resources\PillarResource;
use App\Http\Resources\SkillResource;
use App\Http\Resources\ThemeResource;
use App\Http\Resources\UserResource;
use App\Models\Pillar;
use App\Models\Skill;
use App\Models\Theme;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display a user's public profile.
     */
    public function show(Request $request, User $user): Response
    {
        $user->load(['roles', 'pillars', 'themes', 'skills']);

        // Get public projects
        $projects = $user->projects()
            ->with('pillars')
            ->wherePivot('is_active', true)
            ->limit(5)
            ->get();

        return Inertia::render('profile/show', [
            'profile' => new UserResource($user),
            'projects' => $projects->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
                'summary' => $p->summary,
                'status' => $p->status,
                'pillars' => $p->pillars->pluck('name'),
            ]),
        ]);
    }

    /**
     * Display the current user's profile edit page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $user->load(['roles', 'pillars', 'themes', 'skills']);

        return Inertia::render('profile/edit', [
            'user' => new UserResource($user),
            'allPillars' => PillarResource::collection(Pillar::all()),
            'allThemes' => ThemeResource::collection(Theme::all()),
            'allSkills' => SkillResource::collection(Skill::all()),
        ]);
    }

    /**
     * Update the current user's profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'display_name' => ['nullable', 'string', 'max:255'],
            'pronouns' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'pillar_ids' => ['nullable', 'array'],
            'pillar_ids.*' => ['uuid', 'exists:pillars,id'],
            'theme_ids' => ['nullable', 'array'],
            'theme_ids.*' => ['uuid', 'exists:themes,id'],
            'skills' => ['nullable', 'array'],
            'skills.*.id' => ['uuid', 'exists:skills,id'],
            'skills.*.proficiency' => ['in:beginner,intermediate,advanced,expert'],
        ]);

        $user->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'display_name' => $validated['display_name'] ?? null,
            'pronouns' => $validated['pronouns'] ?? null,
            'location' => $validated['location'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'website_url' => $validated['website_url'] ?? null,
        ]);

        // Sync pillars and themes
        if (isset($validated['pillar_ids'])) {
            $user->pillars()->sync($validated['pillar_ids']);
        }
        if (isset($validated['theme_ids'])) {
            $user->themes()->sync($validated['theme_ids']);
        }

        // Sync skills with proficiency
        if (isset($validated['skills'])) {
            $skillData = collect($validated['skills'])->mapWithKeys(fn ($s) => [
                $s['id'] => ['proficiency' => $s['proficiency']],
            ])->toArray();
            $user->skills()->sync($skillData);
        }

        // Log profile update
        ActivityLogService::log('profile_updated', 'user', $user->id, $user);

        return to_route('user-profile.edit')->with('success', 'Profile updated successfully.');
    }
}
