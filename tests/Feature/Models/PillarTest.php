<?php

use App\Models\Pillar;
use App\Models\User;
use Illuminate\Support\Str;

test('pillars have uuid primary keys', function () {
    $pillar = Pillar::factory()->ethics()->create();

    expect($pillar->id)->toBeString();
    expect(Str::isUuid($pillar->id))->toBeTrue();
});

test('pillars have name and description', function () {
    $pillar = Pillar::factory()->ethics()->create([
        'description' => 'Ethics description',
    ]);

    expect($pillar->name)->toBe('ethics');
    expect($pillar->description)->toBe('Ethics description');
});

test('pillar name is constrained to enum values', function () {
    // These should work
    $ethics = Pillar::factory()->ethics()->create();
    $critique = Pillar::factory()->critique()->create();
    $praxis = Pillar::factory()->praxis()->create();

    expect($ethics->name)->toBe('ethics');
    expect($critique->name)->toBe('critique');
    expect($praxis->name)->toBe('praxis');
});

test('pillars can have multiple users', function () {
    $pillar = Pillar::factory()->ethics()->create();
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $pillar->users()->attach([$user1->id, $user2->id]);

    expect($pillar->users)->toHaveCount(2);
});

test('user pillar association stores created_at timestamp', function () {
    $pillar = Pillar::factory()->ethics()->create();
    $user = User::factory()->create();

    $user->pillars()->attach($pillar->id);

    $pivot = $user->pillars()->first()->pivot;
    expect($pivot->created_at)->not->toBeNull();
});
