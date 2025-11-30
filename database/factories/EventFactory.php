<?php

namespace Database\Factories;

use App\Models\Program;
use App\Models\ProgramCohort;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startsAt = fake()->dateTimeBetween('now', '+2 months');
        $endsAt = (clone $startsAt)->modify('+'.fake()->numberBetween(1, 3).' hours');

        return [
            'title' => fake()->sentence(4),
            'description' => fake()->paragraphs(2, true),
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'location_type' => fake()->randomElement(['online', 'in_person', 'hybrid']),
            'location_details' => fake()->optional(0.8)->url(),
            'visibility' => 'members',
            'program_id' => null,
            'program_cohort_id' => null,
            'created_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the event is public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'visibility' => 'public',
        ]);
    }

    /**
     * Indicate that the event is for a specific program.
     */
    public function forProgram(?Program $program = null): static
    {
        return $this->state(fn (array $attributes) => [
            'program_id' => $program?->id ?? Program::factory(),
            'visibility' => 'program_only',
        ]);
    }

    /**
     * Indicate that the event is for a specific cohort.
     */
    public function forCohort(?ProgramCohort $cohort = null): static
    {
        return $this->state(fn (array $attributes) => [
            'program_cohort_id' => $cohort?->id ?? ProgramCohort::factory(),
            'visibility' => 'cohort_only',
        ]);
    }

    /**
     * Indicate that the event has already passed.
     */
    public function past(): static
    {
        $startsAt = fake()->dateTimeBetween('-2 months', '-1 day');
        $endsAt = (clone $startsAt)->modify('+2 hours');

        return $this->state(fn (array $attributes) => [
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
        ]);
    }
}
