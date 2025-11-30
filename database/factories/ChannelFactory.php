<?php

namespace Database\Factories;

use App\Models\Program;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Channel>
 */
class ChannelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $displayName = fake()->unique()->words(2, true);

        return [
            'name' => Str::slug($displayName),
            'display_name' => ucwords($displayName),
            'description' => fake()->optional(0.7)->sentence(),
            'visibility' => 'members',
            'program_id' => null,
            'is_read_only' => false,
            'created_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the channel is public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'visibility' => 'public',
        ]);
    }

    /**
     * Indicate that the channel is read-only.
     */
    public function readOnly(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read_only' => true,
        ]);
    }

    /**
     * Indicate that the channel belongs to a program.
     */
    public function forProgram(?Program $program = null): static
    {
        return $this->state(fn (array $attributes) => [
            'program_id' => $program?->id ?? Program::factory(),
            'visibility' => 'program_only',
        ]);
    }
}
