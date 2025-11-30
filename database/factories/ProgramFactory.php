<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Program>
 */
class ProgramFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'short_description' => fake()->paragraph(),
            'long_description' => fake()->paragraphs(3, true),
            'program_type' => fake()->randomElement(['fellowship', 'lab', 'school', 'incubator', 'studio']),
            'application_open_at' => null,
            'application_close_at' => null,
            'default_duration_weeks' => fake()->randomElement([8, 12, 16, 24]),
            'is_public' => true,
            'status' => 'active',
            'created_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the program is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'is_public' => false,
        ]);
    }

    /**
     * Indicate that the program is accepting applications.
     */
    public function acceptingApplications(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'application_open_at' => now()->subDays(7),
            'application_close_at' => now()->addDays(30),
        ]);
    }

    /**
     * Indicate that the program is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
            'is_public' => false,
        ]);
    }
}
