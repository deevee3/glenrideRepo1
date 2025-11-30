<?php

namespace Database\Factories;

use App\Models\Program;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'summary' => fake()->paragraph(),
            'description' => fake()->paragraphs(3, true),
            'status' => fake()->randomElement(['idea', 'design', 'in_progress']),
            'created_by' => User::factory(),
            'program_id' => null,
        ];
    }

    /**
     * Indicate that the project is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    /**
     * Indicate that the project is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }

    /**
     * Indicate that the project belongs to a program.
     */
    public function forProgram(?Program $program = null): static
    {
        return $this->state(fn (array $attributes) => [
            'program_id' => $program?->id ?? Program::factory(),
        ]);
    }
}
