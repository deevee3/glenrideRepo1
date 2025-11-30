<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pillar>
 */
class PillarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['ethics', 'critique', 'praxis']),
            'description' => fake()->paragraph(),
        ];
    }

    /**
     * Create the ethics pillar.
     */
    public function ethics(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'ethics',
            'description' => 'Examining moral principles and frameworks for just technology',
        ]);
    }

    /**
     * Create the critique pillar.
     */
    public function critique(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'critique',
            'description' => 'Analyzing systems of power and challenging existing structures',
        ]);
    }

    /**
     * Create the praxis pillar.
     */
    public function praxis(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'praxis',
            'description' => 'Putting theory into practice through hands-on building',
        ]);
    }
}
