<?php

use App\Models\Pillar;
use App\Models\Role;
use App\Models\Skill;
use App\Models\Theme;
use App\Models\User;
use Illuminate\Support\Str;

test('users have uuid primary keys', function () {
    $user = User::factory()->create();

    expect($user->id)->toBeString();
    expect(Str::isUuid($user->id))->toBeTrue();
});

test('users have required profile fields', function () {
    $user = User::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
        'display_name' => 'johnd',
        'pronouns' => 'he/him',
        'location' => 'New York',
        'bio' => 'A test bio',
        'status' => 'active',
    ]);

    expect($user->first_name)->toBe('John');
    expect($user->last_name)->toBe('Doe');
    expect($user->display_name)->toBe('johnd');
    expect($user->pronouns)->toBe('he/him');
    expect($user->location)->toBe('New York');
    expect($user->bio)->toBe('A test bio');
    expect($user->status)->toBe('active');
});

test('user name accessor returns full name', function () {
    $user = User::factory()->create([
        'first_name' => 'Jane',
        'last_name' => 'Smith',
    ]);

    expect($user->name)->toBe('Jane Smith');
});

test('users can have multiple roles', function () {
    $user = User::factory()->create();
    $memberRole = Role::factory()->member()->create();
    $scholarRole = Role::factory()->scholar()->create();

    $user->roles()->attach([$memberRole->id, $scholarRole->id]);

    expect($user->roles)->toHaveCount(2);
    expect($user->roles->pluck('name')->toArray())->toContain('member', 'scholar');
});

test('user role assignment is unique per user-role pair', function () {
    $user = User::factory()->create();
    $role = Role::factory()->create();

    $user->roles()->attach($role->id);

    // Attempting to attach again should not create duplicate
    $user->roles()->syncWithoutDetaching([$role->id]);

    expect($user->roles)->toHaveCount(1);
});

test('hasRole method correctly checks user roles', function () {
    $user = User::factory()->create();
    $adminRole = Role::factory()->admin()->create();
    Role::factory()->member()->create();

    $user->roles()->attach($adminRole->id);

    expect($user->hasRole('admin'))->toBeTrue();
    expect($user->hasRole('member'))->toBeFalse();
});

test('isAdmin method correctly identifies administrators', function () {
    $user = User::factory()->create();
    $adminRole = Role::factory()->admin()->create();

    expect($user->isAdmin())->toBeFalse();

    $user->roles()->attach($adminRole->id);

    expect($user->isAdmin())->toBeTrue();
});

test('users can have multiple pillars', function () {
    $user = User::factory()->create();
    $ethics = Pillar::factory()->ethics()->create();
    $praxis = Pillar::factory()->praxis()->create();

    $user->pillars()->attach([$ethics->id, $praxis->id]);

    expect($user->pillars)->toHaveCount(2);
    expect($user->pillars->pluck('name')->toArray())->toContain('ethics', 'praxis');
});

test('users can have multiple themes', function () {
    $user = User::factory()->create();
    $theme1 = Theme::factory()->create(['name' => 'Climate', 'slug' => 'climate']);
    $theme2 = Theme::factory()->create(['name' => 'AI Ethics', 'slug' => 'ai-ethics']);

    $user->themes()->attach([$theme1->id, $theme2->id]);

    expect($user->themes)->toHaveCount(2);
});

test('users can have multiple skills with proficiency levels', function () {
    $user = User::factory()->create();
    $skill1 = Skill::factory()->create(['name' => 'Python']);
    $skill2 = Skill::factory()->create(['name' => 'Research']);

    $user->skills()->attach([
        $skill1->id => ['proficiency' => 'advanced'],
        $skill2->id => ['proficiency' => 'intermediate'],
    ]);

    expect($user->skills)->toHaveCount(2);
    expect($user->skills->firstWhere('name', 'Python')->pivot->proficiency)->toBe('advanced');
    expect($user->skills->firstWhere('name', 'Research')->pivot->proficiency)->toBe('intermediate');
});

test('user status enum is validated', function () {
    $user = User::factory()->create(['status' => 'active']);
    expect($user->status)->toBe('active');

    $invitedUser = User::factory()->invited()->create();
    expect($invitedUser->status)->toBe('invited');

    $deactivatedUser = User::factory()->deactivated()->create();
    expect($deactivatedUser->status)->toBe('deactivated');

    $bannedUser = User::factory()->banned()->create();
    expect($bannedUser->status)->toBe('banned');
});

test('user email must be unique', function () {
    User::factory()->create(['email' => 'unique@example.com']);

    expect(fn () => User::factory()->create(['email' => 'unique@example.com']))
        ->toThrow(Illuminate\Database\QueryException::class);
});
