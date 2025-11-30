<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProjectMember>
 */
class ProjectMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'user_id' => User::factory(),
            'role' => fake()->randomElement(['lead', 'researcher', 'technologist', 'organizer', 'advisor', 'observer', 'other']),
            'is_active' => true,
            'joined_at' => now(),
        ];
    }

    /**
     * Configure as a project lead.
     */
    public function lead(): static
    {
        return $this->state(fn () => ['role' => 'lead']);
    }

    /**
     * Configure as a contributor.
     */
    public function contributor(): static
    {
        return $this->state(fn () => ['role' => 'researcher']);
    }

    /**
     * Configure as inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
