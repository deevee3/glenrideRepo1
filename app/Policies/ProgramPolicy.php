<?php

namespace App\Policies;

use App\Models\Program;
use App\Models\User;
use App\Services\AuthorizationService;

class ProgramPolicy
{
    public function __construct(
        protected AuthorizationService $authService
    ) {}

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_program');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Program $program): bool
    {
        return $this->authService->canViewProgram($user, $program);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('admin_all') || $user->hasPermission('edit_program');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Program $program): bool
    {
        return $this->authService->canEditProgram($user, $program);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Program $program): bool
    {
        return $user->hasPermission('admin_all');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Program $program): bool
    {
        return $user->hasPermission('admin_all');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Program $program): bool
    {
        return $user->hasPermission('admin_all');
    }

    /**
     * Determine whether the user can manage cohorts for this program.
     */
    public function manageCohorts(User $user, Program $program): bool
    {
        return $user->hasPermission('admin_all') || $user->hasPermission('manage_program_cohort');
    }
}
