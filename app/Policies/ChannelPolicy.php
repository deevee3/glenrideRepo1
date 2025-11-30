<?php

namespace App\Policies;

use App\Models\Channel;
use App\Models\User;
use App\Services\AuthorizationService;

class ChannelPolicy
{
    public function __construct(
        protected AuthorizationService $authService
    ) {}

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_community_channel');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Channel $channel): bool
    {
        return $this->authService->canViewChannel($user, $channel);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('admin_all') || $user->hasPermission('moderate_community');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Channel $channel): bool
    {
        return $user->hasPermission('admin_all') || $user->hasPermission('moderate_community');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Channel $channel): bool
    {
        return $user->hasPermission('admin_all');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Channel $channel): bool
    {
        return $user->hasPermission('admin_all');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Channel $channel): bool
    {
        return $user->hasPermission('admin_all');
    }

    /**
     * Determine whether the user can post in the channel.
     */
    public function post(User $user, Channel $channel): bool
    {
        return $this->authService->canPostInChannel($user, $channel);
    }
}
