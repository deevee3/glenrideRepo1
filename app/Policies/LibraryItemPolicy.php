<?php

namespace App\Policies;

use App\Models\LibraryItem;
use App\Models\User;
use App\Services\AuthorizationService;

class LibraryItemPolicy
{
    public function __construct(
        protected AuthorizationService $authService
    ) {}

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_library_item');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LibraryItem $libraryItem): bool
    {
        return $this->authService->canViewLibraryItem($user, $libraryItem);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->authService->canCreateLibraryItem($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LibraryItem $libraryItem): bool
    {
        return $this->authService->canEditLibraryItem($user, $libraryItem);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LibraryItem $libraryItem): bool
    {
        // Admins, authors, or those with edit permission can delete
        return $user->hasPermission('admin_all')
            || $libraryItem->author_id === $user->id
            || $user->hasPermission('edit_library_item');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, LibraryItem $libraryItem): bool
    {
        return $user->hasPermission('admin_all');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, LibraryItem $libraryItem): bool
    {
        return $user->hasPermission('admin_all');
    }

    /**
     * Determine whether the user can publish the model.
     */
    public function publish(User $user, LibraryItem $libraryItem): bool
    {
        return $user->hasPermission('admin_all') || $user->hasPermission('publish_library_item');
    }
}
