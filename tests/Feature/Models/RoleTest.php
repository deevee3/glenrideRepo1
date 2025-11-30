<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Str;

test('roles have uuid primary keys', function () {
    $role = Role::factory()->create();

    expect($role->id)->toBeString();
    expect(Str::isUuid($role->id))->toBeTrue();
});

test('roles have name and description', function () {
    $role = Role::factory()->create([
        'name' => 'test-role',
        'description' => 'A test role description',
    ]);

    expect($role->name)->toBe('test-role');
    expect($role->description)->toBe('A test role description');
});

test('role name must be unique', function () {
    Role::factory()->create(['name' => 'unique-role']);

    expect(fn () => Role::factory()->create(['name' => 'unique-role']))
        ->toThrow(Illuminate\Database\QueryException::class);
});

test('roles can have multiple users', function () {
    $role = Role::factory()->create();
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $role->users()->attach([$user1->id, $user2->id]);

    expect($role->users)->toHaveCount(2);
});

test('role factory states create correct roles', function () {
    $member = Role::factory()->member()->create();
    $scholar = Role::factory()->scholar()->create();
    $builder = Role::factory()->builder()->create();
    $organizer = Role::factory()->organizer()->create();
    $partner = Role::factory()->partner()->create();
    $admin = Role::factory()->admin()->create();

    expect($member->name)->toBe('member');
    expect($scholar->name)->toBe('scholar');
    expect($builder->name)->toBe('builder');
    expect($organizer->name)->toBe('organizer');
    expect($partner->name)->toBe('partner');
    expect($admin->name)->toBe('admin');
});
