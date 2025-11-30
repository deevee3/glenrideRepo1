<?php

namespace Database\Factories;

use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProgramCohort>
 */
class ProgramCohortFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = fake()->year();
        $cohortNum = fake()->numberBetween(1, 5);

        return [
            'program_id' => Program::factory(),
            'name' => "Cohort {$cohortNum} – {$year}",
            'start_date' => fake()->dateTimeBetween('now', '+3 months'),
            'end_date' => fake()->dateTimeBetween('+4 months', '+12 months'),
            'max_participants' => fake()->optional(0.7)->numberBetween(10, 50),
            'status' => 'upcoming',
            'meeting_cadence' => fake()->randomElement(['Weekly', 'Bi-weekly', 'Monthly']),
        ];
    }

    /**
     * Indicate that the cohort is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'start_date' => now()->subWeeks(2),
            'end_date' => now()->addMonths(4),
        ]);
    }

    /**
     * Indicate that the cohort is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'start_date' => now()->subMonths(6),
            'end_date' => now()->subWeeks(2),
        ]);
    }
}
