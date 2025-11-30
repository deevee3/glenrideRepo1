<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Skill>
 */
class SkillFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'category' => fake()->randomElement(['technical', 'organizing', 'research', 'creative', 'communication', 'other']),
        ];
    }

    /**
     * Create a technical skill.
     */
    public function technical(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'technical',
        ]);
    }

    /**
     * Create an organizing skill.
     */
    public function organizing(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'organizing',
        ]);
    }

    /**
     * Create a research skill.
     */
    public function research(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'research',
        ]);
    }
}
