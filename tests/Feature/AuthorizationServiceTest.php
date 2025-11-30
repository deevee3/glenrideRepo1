<?php

use App\Models\Permission;
use App\Models\Program;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\Role;
use App\Models\User;
use App\Services\AuthorizationService;

beforeEach(function () {
    $this->authService = new AuthorizationService;
});

describe('User RBAC permissions', function () {
    test('admin users have all permissions via admin_all', function () {
        $adminRole = Role::factory()->admin()->create();
        $adminPermission = Permission::factory()->create(['name' => 'admin_all']);
        $adminRole->permissions()->attach($adminPermission);

        $user = User::factory()->create();
        $user->roles()->attach($adminRole);

        expect($user->hasPermission('admin_all'))->toBeTrue();
        expect($user->hasPermission('view_program'))->toBeTrue();
        expect($user->hasPermission('any_permission'))->toBeTrue();
    });

    test('user has permission through role', function () {
        $role = Role::factory()->create();
        $permission = Permission::factory()->create(['name' => 'view_program']);
        $role->permissions()->attach($permission);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        expect($user->hasPermission('view_program'))->toBeTrue();
        expect($user->hasPermission('edit_program'))->toBeFalse();
    });

    test('user has any permission checks multiple permissions', function () {
        $role = Role::factory()->create();
        $permission = Permission::factory()->create(['name' => 'view_program']);
        $role->permissions()->attach($permission);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        expect($user->hasAnyPermission(['view_program', 'edit_program']))->toBeTrue();
        expect($user->hasAnyPermission(['edit_program', 'delete_program']))->toBeFalse();
    });

    test('user can get all permissions', function () {
        $role = Role::factory()->create();
        $permission1 = Permission::factory()->create(['name' => 'view_program']);
        $permission2 = Permission::factory()->create(['name' => 'edit_program']);
        $role->permissions()->attach([$permission1->id, $permission2->id]);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        $permissions = $user->getAllPermissions();

        expect($permissions)->toContain('view_program');
        expect($permissions)->toContain('edit_program');
    });
});

describe('Role has permission', function () {
    test('role can check if it has a permission', function () {
        $role = Role::factory()->create();
        $permission = Permission::factory()->create(['name' => 'view_program']);
        $role->permissions()->attach($permission);

        expect($role->hasPermission('view_program'))->toBeTrue();
        expect($role->hasPermission('edit_program'))->toBeFalse();
    });
});

describe('Project authorization', function () {
    test('admin can view any project', function () {
        $adminRole = Role::factory()->admin()->create();
        $adminPermission = Permission::factory()->create(['name' => 'admin_all']);
        $adminRole->permissions()->attach($adminPermission);

        $user = User::factory()->create();
        $user->roles()->attach($adminRole);

        $project = Project::factory()->create();

        expect($this->authService->canViewProject($user, $project))->toBeTrue();
    });

    test('user with view_all_projects can view any project', function () {
        $role = Role::factory()->create();
        $permission = Permission::factory()->create(['name' => 'view_all_projects']);
        $role->permissions()->attach($permission);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        $project = Project::factory()->create();

        expect($this->authService->canViewProject($user, $project))->toBeTrue();
    });

    test('project member can view their project', function () {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        ProjectMember::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'role' => 'researcher',
            'is_active' => true,
        ]);

        expect($this->authService->canViewProject($user, $project))->toBeTrue();
    });

    test('non-member cannot view private project', function () {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        expect($this->authService->canViewProject($user, $project))->toBeFalse();
    });

    test('project lead can edit their project', function () {
        $role = Role::factory()->create();
        $permission = Permission::factory()->create(['name' => 'edit_own_project']);
        $role->permissions()->attach($permission);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        $project = Project::factory()->create();
        ProjectMember::factory()->lead()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
        ]);

        expect($this->authService->canEditProject($user, $project))->toBeTrue();
    });

    test('user with edit_own_project can edit projects they are members of', function () {
        $role = Role::factory()->create();
        $permission = Permission::factory()->create(['name' => 'edit_own_project']);
        $role->permissions()->attach($permission);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        $project = Project::factory()->create();
        ProjectMember::factory()->contributor()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
        ]);

        expect($this->authService->canEditProject($user, $project))->toBeTrue();
    });

    test('user cannot edit project they are not a member of', function () {
        $role = Role::factory()->create();
        $permission = Permission::factory()->create(['name' => 'edit_own_project']);
        $role->permissions()->attach($permission);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        $project = Project::factory()->create();

        expect($this->authService->canEditProject($user, $project))->toBeFalse();
    });
});

describe('Program authorization', function () {
    test('admin can view any program', function () {
        $adminRole = Role::factory()->admin()->create();
        $adminPermission = Permission::factory()->create(['name' => 'admin_all']);
        $adminRole->permissions()->attach($adminPermission);

        $user = User::factory()->create();
        $user->roles()->attach($adminRole);

        $program = Program::factory()->create(['is_public' => false]);

        expect($this->authService->canViewProgram($user, $program))->toBeTrue();
    });

    test('user with view_program can view public programs', function () {
        $role = Role::factory()->create();
        $permission = Permission::factory()->create(['name' => 'view_program']);
        $role->permissions()->attach($permission);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        $program = Program::factory()->create(['is_public' => true]);

        expect($this->authService->canViewProgram($user, $program))->toBeTrue();
    });

    test('user cannot view private program without membership', function () {
        $role = Role::factory()->create();
        $permission = Permission::factory()->create(['name' => 'view_program']);
        $role->permissions()->attach($permission);

        $user = User::factory()->create();
        $user->roles()->attach($role);

        $program = Program::factory()->create(['is_public' => false]);

        expect($this->authService->canViewProgram($user, $program))->toBeFalse();
    });
});

describe('User membership helpers', function () {
    test('isProjectMember returns true for active members', function () {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        ProjectMember::factory()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'role' => 'researcher',
            'is_active' => true,
        ]);

        expect($user->isProjectMember($project->id))->toBeTrue();
    });

    test('isProjectMember returns false for inactive members', function () {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        ProjectMember::factory()->inactive()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'role' => 'researcher',
        ]);

        expect($user->isProjectMember($project->id))->toBeFalse();
    });

    test('isProjectLead returns true for lead role', function () {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        ProjectMember::factory()->lead()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
        ]);

        expect($user->isProjectLead($project->id))->toBeTrue();
    });

    test('isProjectLead returns false for non-lead roles', function () {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        ProjectMember::factory()->contributor()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
        ]);

        expect($user->isProjectLead($project->id))->toBeFalse();
    });
});
