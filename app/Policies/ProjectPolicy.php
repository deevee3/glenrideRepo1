<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use App\Services\AuthorizationService;

class ProjectPolicy
{
    public function __construct(
        protected AuthorizationService $authService
    ) {}

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_all_projects') || $user->hasPermission('create_project');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Project $project): bool
    {
        return $this->authService->canViewProject($user, $project);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->authService->canCreateProject($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        return $this->authService->canEditProject($user, $project);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        // Only admins or project leads can delete
        return $user->hasPermission('admin_all') || $user->isProjectLead($project->id);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Project $project): bool
    {
        return $user->hasPermission('admin_all');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        return $user->hasPermission('admin_all');
    }
}
