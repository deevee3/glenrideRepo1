<?php

namespace App\Services;

use App\Models\Channel;
use App\Models\Event;
use App\Models\LibraryItem;
use App\Models\Program;
use App\Models\Project;
use App\Models\ResourcePermission;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Centralized authorization service for access control.
 *
 * Combines RBAC permissions with resource-level rules using existing
 * relationships (cohort, project, program membership).
 */
class AuthorizationService
{
    /**
     * Check if user can view a program.
     */
    public function canViewProgram(User $user, Program $program): bool
    {
        if ($user->hasPermission('admin_all')) {
            return true;
        }

        // Public programs are viewable by anyone with view_program permission
        if ($program->is_public && $user->hasPermission('view_program')) {
            return true;
        }

        // Program members can view their programs
        if ($user->isProgramMember($program->id)) {
            return true;
        }

        return $this->hasResourceOverride($user, 'program', $program->id, 'view_program');
    }

    /**
     * Check if user can edit a program.
     */
    public function canEditProgram(User $user, Program $program): bool
    {
        if ($user->hasPermission('admin_all')) {
            return true;
        }

        if ($user->hasPermission('edit_program')) {
            return true;
        }

        // Check if user is a facilitator in any cohort of this program
        $isFacilitator = $user->cohorts()
            ->whereHas('program', fn ($q) => $q->where('id', $program->id))
            ->where('cohort_participants.role', 'facilitator')
            ->exists();

        if ($isFacilitator) {
            return true;
        }

        return $this->hasResourceOverride($user, 'program', $program->id, 'edit_program');
    }

    /**
     * Check if user can view a library item based on its access_level.
     */
    public function canViewLibraryItem(User $user, LibraryItem $libraryItem): bool
    {
        if ($user->hasPermission('admin_all')) {
            return true;
        }

        // Check resource-level override first
        if ($this->hasResourceOverride($user, 'library_item', $libraryItem->id, 'view_library_item')) {
            return true;
        }

        // Check resource-level denial
        if ($this->hasResourceDenial($user, 'library_item', $libraryItem->id, 'view_library_item')) {
            return false;
        }

        return match ($libraryItem->access_level) {
            'public' => true,
            'members' => $user->hasPermission('view_library_item'),
            'program_members' => $libraryItem->program_id && $user->isProgramMember($libraryItem->program_id),
            'cohort_members' => $libraryItem->program_cohort_id && $user->isCohortMember($libraryItem->program_cohort_id),
            default => false,
        };
    }

    /**
     * Check if user can create a library item.
     */
    public function canCreateLibraryItem(User $user): bool
    {
        return $user->hasPermission('admin_all')
            || $user->hasPermission('create_library_item');
    }

    /**
     * Check if user can edit a library item.
     */
    public function canEditLibraryItem(User $user, LibraryItem $libraryItem): bool
    {
        if ($user->hasPermission('admin_all')) {
            return true;
        }

        if ($user->hasPermission('edit_library_item')) {
            return true;
        }

        // Author can edit their own items
        if ($libraryItem->author_id === $user->id) {
            return true;
        }

        // Cohort facilitator can edit cohort-specific items
        if ($libraryItem->program_cohort_id && $user->isCohortFacilitator($libraryItem->program_cohort_id)) {
            return true;
        }

        return $this->hasResourceOverride($user, 'library_item', $libraryItem->id, 'edit_library_item');
    }

    /**
     * Check if user can post in a channel.
     */
    public function canPostInChannel(User $user, Channel $channel): bool
    {
        if ($user->hasPermission('admin_all')) {
            return true;
        }

        // Read-only channels require moderation permission
        if ($channel->is_read_only) {
            return $user->hasPermission('moderate_community');
        }

        // Check resource override
        if ($this->hasResourceOverride($user, 'channel', $channel->id, 'post_community_message')) {
            return true;
        }

        // Check resource denial
        if ($this->hasResourceDenial($user, 'channel', $channel->id, 'post_community_message')) {
            return false;
        }

        return match ($channel->visibility) {
            'public' => $user->hasPermission('post_community_message'),
            'members' => $user->hasPermission('post_community_message'),
            'program_only' => $channel->program_id && $user->isProgramMember($channel->program_id),
            default => false,
        };
    }

    /**
     * Check if user can view a channel.
     */
    public function canViewChannel(User $user, Channel $channel): bool
    {
        if ($user->hasPermission('admin_all')) {
            return true;
        }

        if ($this->hasResourceOverride($user, 'channel', $channel->id, 'view_community_channel')) {
            return true;
        }

        return match ($channel->visibility) {
            'public' => true,
            'members' => $user->hasPermission('view_community_channel'),
            'program_only' => $channel->program_id && $user->isProgramMember($channel->program_id),
            default => false,
        };
    }

    /**
     * Check if user can view a project.
     */
    public function canViewProject(User $user, Project $project): bool
    {
        if ($user->hasPermission('admin_all')) {
            return true;
        }

        if ($user->hasPermission('view_all_projects')) {
            return true;
        }

        // Project members can always view
        if ($user->isProjectMember($project->id)) {
            return true;
        }

        return $this->hasResourceOverride($user, 'project', $project->id, 'view_project');
    }

    /**
     * Check if user can edit a project.
     */
    public function canEditProject(User $user, Project $project): bool
    {
        if ($user->hasPermission('admin_all')) {
            return true;
        }

        if ($user->hasPermission('edit_any_project')) {
            return true;
        }

        // Project members with edit_own_project can edit
        if ($user->hasPermission('edit_own_project') && $user->isProjectMember($project->id)) {
            return true;
        }

        // Project leads can always edit
        if ($user->isProjectLead($project->id)) {
            return true;
        }

        return $this->hasResourceOverride($user, 'project', $project->id, 'edit_project');
    }

    /**
     * Check if user can create a project.
     */
    public function canCreateProject(User $user): bool
    {
        return $user->hasPermission('admin_all')
            || $user->hasPermission('create_project');
    }

    /**
     * Check if user can view an event based on its visibility.
     */
    public function canViewEvent(User $user, Event $event): bool
    {
        if ($user->hasPermission('admin_all')) {
            return true;
        }

        if ($this->hasResourceOverride($user, 'event', $event->id, 'view_event')) {
            return true;
        }

        return match ($event->visibility) {
            'public' => true,
            'members' => $user->hasPermission('view_event'),
            'program_only' => $event->program_id && $user->isProgramMember($event->program_id),
            'cohort_only' => $event->program_cohort_id && $user->isCohortMember($event->program_cohort_id),
            default => false,
        };
    }

    /**
     * Check if user can manage an event (edit/delete).
     */
    public function canManageEvent(User $user, Event $event): bool
    {
        if ($user->hasPermission('admin_all')) {
            return true;
        }

        if ($user->hasPermission('manage_events')) {
            return true;
        }

        // Event creator can manage their own events
        if ($event->created_by === $user->id) {
            return true;
        }

        // Cohort facilitator can manage cohort events
        if ($event->program_cohort_id && $user->isCohortFacilitator($event->program_cohort_id)) {
            return true;
        }

        return $this->hasResourceOverride($user, 'event', $event->id, 'manage_events');
    }

    /**
     * Check if user can create an event.
     */
    public function canCreateEvent(User $user): bool
    {
        return $user->hasPermission('admin_all')
            || $user->hasPermission('create_event')
            || $user->hasPermission('manage_events');
    }

    /**
     * Check for a resource-level permission override (allow).
     */
    protected function hasResourceOverride(User $user, string $resourceType, string $resourceId, string $permissionName): bool
    {
        // Check user-specific override
        $userOverride = ResourcePermission::where('resource_type', $resourceType)
            ->where('resource_id', $resourceId)
            ->where('grantee_type', 'user')
            ->where('grantee_id', $user->id)
            ->where('is_allowed', true)
            ->whereHas('permission', fn ($q) => $q->where('name', $permissionName))
            ->exists();

        if ($userOverride) {
            return true;
        }

        // Check role-based override
        $roleIds = $user->roles()->pluck('roles.id');

        return ResourcePermission::where('resource_type', $resourceType)
            ->where('resource_id', $resourceId)
            ->where('grantee_type', 'role')
            ->whereIn('grantee_id', $roleIds)
            ->where('is_allowed', true)
            ->whereHas('permission', fn ($q) => $q->where('name', $permissionName))
            ->exists();
    }

    /**
     * Check for a resource-level permission denial.
     */
    protected function hasResourceDenial(User $user, string $resourceType, string $resourceId, string $permissionName): bool
    {
        // Check user-specific denial
        $userDenial = ResourcePermission::where('resource_type', $resourceType)
            ->where('resource_id', $resourceId)
            ->where('grantee_type', 'user')
            ->where('grantee_id', $user->id)
            ->where('is_allowed', false)
            ->whereHas('permission', fn ($q) => $q->where('name', $permissionName))
            ->exists();

        if ($userDenial) {
            return true;
        }

        // Check role-based denial
        $roleIds = $user->roles()->pluck('roles.id');

        return ResourcePermission::where('resource_type', $resourceType)
            ->where('resource_id', $resourceId)
            ->where('grantee_type', 'role')
            ->whereIn('grantee_id', $roleIds)
            ->where('is_allowed', false)
            ->whereHas('permission', fn ($q) => $q->where('name', $permissionName))
            ->exists();
    }

    /**
     * Grant a resource-specific permission to a user.
     */
    public function grantResourcePermission(
        string $resourceType,
        string $resourceId,
        User $user,
        string $permissionName
    ): ResourcePermission {
        $permission = \App\Models\Permission::where('name', $permissionName)->firstOrFail();

        return ResourcePermission::updateOrCreate(
            [
                'resource_type' => $resourceType,
                'resource_id' => $resourceId,
                'grantee_type' => 'user',
                'grantee_id' => $user->id,
                'permission_id' => $permission->id,
            ],
            ['is_allowed' => true]
        );
    }

    /**
     * Revoke a resource-specific permission from a user.
     */
    public function revokeResourcePermission(
        string $resourceType,
        string $resourceId,
        User $user,
        string $permissionName
    ): bool {
        $permission = \App\Models\Permission::where('name', $permissionName)->first();

        if (! $permission) {
            return false;
        }

        return ResourcePermission::where('resource_type', $resourceType)
            ->where('resource_id', $resourceId)
            ->where('grantee_type', 'user')
            ->where('grantee_id', $user->id)
            ->where('permission_id', $permission->id)
            ->delete() > 0;
    }
}
