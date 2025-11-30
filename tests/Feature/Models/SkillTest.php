<?php

use App\Models\Skill;
use App\Models\User;
use Illuminate\Support\Str;

test('skills have uuid primary keys', function () {
    $skill = Skill::factory()->create();

    expect($skill->id)->toBeString();
    expect(Str::isUuid($skill->id))->toBeTrue();
});

test('skills have name and category', function () {
    $skill = Skill::factory()->create([
        'name' => 'Python',
        'category' => 'technical',
    ]);

    expect($skill->name)->toBe('Python');
    expect($skill->category)->toBe('technical');
});

test('skill categories are constrained to enum values', function () {
    $technical = Skill::factory()->technical()->create(['name' => 'Python']);
    $organizing = Skill::factory()->organizing()->create(['name' => 'Community Building']);
    $research = Skill::factory()->research()->create(['name' => 'Data Analysis']);

    expect($technical->category)->toBe('technical');
    expect($organizing->category)->toBe('organizing');
    expect($research->category)->toBe('research');
});

test('skills can have multiple users', function () {
    $skill = Skill::factory()->create();
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $skill->users()->attach([
        $user1->id => ['proficiency' => 'beginner'],
        $user2->id => ['proficiency' => 'expert'],
    ]);

    expect($skill->users)->toHaveCount(2);
});

test('user skill proficiency levels are stored correctly', function () {
    $skill = Skill::factory()->create();
    $user = User::factory()->create();

    $user->skills()->attach($skill->id, ['proficiency' => 'advanced']);

    $pivot = $user->skills()->first()->pivot;
    expect($pivot->proficiency)->toBe('advanced');
});

test('proficiency defaults to beginner', function () {
    $skill = Skill::factory()->create();
    $user = User::factory()->create();

    // Attach without specifying proficiency
    $user->skills()->attach($skill->id);

    $pivot = $user->skills()->first()->pivot;
    expect($pivot->proficiency)->toBe('beginner');
});
