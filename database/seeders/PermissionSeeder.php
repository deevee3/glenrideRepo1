<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Canonical permissions for the Glenride platform.
     *
     * @var array<array{name: string, description: string}>
     */
    protected array $permissions = [
        // Programs
        ['name' => 'view_program', 'description' => 'View program details'],
        ['name' => 'edit_program', 'description' => 'Edit program information'],
        ['name' => 'manage_program_cohort', 'description' => 'Manage program cohorts and participants'],

        // Library
        ['name' => 'view_library_item', 'description' => 'View library items'],
        ['name' => 'create_library_item', 'description' => 'Create new library items'],
        ['name' => 'edit_library_item', 'description' => 'Edit existing library items'],
        ['name' => 'publish_library_item', 'description' => 'Publish library items'],

        // Community / Channels
        ['name' => 'view_community_channel', 'description' => 'View community channels'],
        ['name' => 'post_community_message', 'description' => 'Post messages in community channels'],
        ['name' => 'moderate_community', 'description' => 'Moderate community content'],

        // Projects
        ['name' => 'view_all_projects', 'description' => 'View all projects regardless of membership'],
        ['name' => 'create_project', 'description' => 'Create new projects'],
        ['name' => 'edit_own_project', 'description' => 'Edit projects where user is a member'],
        ['name' => 'edit_any_project', 'description' => 'Edit any project'],

        // Events
        ['name' => 'view_event', 'description' => 'View events'],
        ['name' => 'create_event', 'description' => 'Create new events'],
        ['name' => 'manage_events', 'description' => 'Manage all events'],

        // Users / Admin
        ['name' => 'view_users', 'description' => 'View user profiles'],
        ['name' => 'manage_users', 'description' => 'Manage user accounts'],
        ['name' => 'manage_roles', 'description' => 'Manage user roles'],
        ['name' => 'admin_all', 'description' => 'Super-admin: full platform access'],
    ];

    /**
     * Role-permission mappings.
     *
     * @var array<string, array<string>>
     */
    protected array $rolePermissions = [
        'admin' => [
            'admin_all',
        ],
        'member' => [
            'view_program',
            'view_library_item',
            'view_community_channel',
            'post_community_message',
            'create_project',
            'edit_own_project',
            'view_event',
        ],
        'scholar' => [
            'view_program',
            'view_library_item',
            'view_community_channel',
            'post_community_message',
            'create_project',
            'edit_own_project',
            'view_event',
        ],
        'builder' => [
            'view_program',
            'view_library_item',
            'view_community_channel',
            'post_community_message',
            'create_project',
            'edit_own_project',
            'view_event',
        ],
        'organizer' => [
            'view_program',
            'edit_program',
            'manage_program_cohort',
            'view_library_item',
            'create_library_item',
            'edit_library_item',
            'publish_library_item',
            'view_community_channel',
            'post_community_message',
            'moderate_community',
            'view_all_projects',
            'create_project',
            'edit_own_project',
            'view_event',
            'create_event',
            'manage_events',
            'view_users',
        ],
        'partner' => [
            'view_program',
            'view_library_item',
            'view_community_channel',
            'view_all_projects',
            'view_event',
            'view_users',
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create all permissions
        foreach ($this->permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name']],
                ['description' => $permission['description']]
            );
        }

        // Map permissions to roles
        foreach ($this->rolePermissions as $roleName => $permissionNames) {
            $role = Role::where('name', $roleName)->first();
            if (! $role) {
                continue;
            }

            $permissionIds = Permission::whereIn('name', $permissionNames)->pluck('id');
            $role->permissions()->syncWithoutDetaching($permissionIds);
        }
    }
}
