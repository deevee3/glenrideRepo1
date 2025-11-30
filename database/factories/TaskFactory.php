<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->optional(0.5)->dateTimeBetween('-1 week', '+1 week');
        $dueDate = fake()->optional(0.6)->dateTimeBetween($startDate ?? 'now', '+2 months');

        return [
            'project_id' => Project::factory(),
            'title' => fake()->sentence(5),
            'description' => fake()->optional(0.7)->paragraph(),
            'status' => 'todo',
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'created_by' => User::factory(),
            'assigned_to' => null,
            'due_date' => $dueDate,
            'start_date' => $startDate,
            'estimated_hours' => fake()->optional(0.5)->randomFloat(1, 0.5, 40),
            'actual_hours' => null,
            'sort_order' => fake()->numberBetween(1, 100),
            'labels' => fake()->optional(0.3)->randomElements(['bug', 'feature', 'docs', 'design', 'research', 'testing'], fake()->numberBetween(1, 3)),
            'notes' => fake()->optional(0.2)->sentence(),
        ];
    }

    /**
     * Indicate that the task is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    /**
     * Indicate that the task is done.
     */
    public function done(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'done',
            'completed_at' => now(),
            'actual_hours' => $attributes['estimated_hours'] ?? fake()->randomFloat(1, 0.5, 20),
        ]);
    }

    /**
     * Indicate that the task is assigned to a user.
     */
    public function assignedTo(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'assigned_to' => $user->id,
        ]);
    }

    /**
     * Indicate that the task is urgent.
     */
    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'urgent',
        ]);
    }

    /**
     * Indicate that the task is overdue.
     */
    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'due_date' => fake()->dateTimeBetween('-2 weeks', '-1 day'),
            'status' => fake()->randomElement(['todo', 'in_progress']),
        ]);
    }

    /**
     * Indicate that the task is due soon (within 3 days).
     */
    public function dueSoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'due_date' => fake()->dateTimeBetween('now', '+3 days'),
            'status' => fake()->randomElement(['todo', 'in_progress']),
        ]);
    }

    /**
     * Indicate that the task has time tracking.
     */
    public function withTimeTracking(): static
    {
        return $this->state(fn (array $attributes) => [
            'estimated_hours' => fake()->randomFloat(1, 2, 20),
            'actual_hours' => fake()->randomFloat(1, 0.5, 15),
        ]);
    }
}
