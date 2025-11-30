<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
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
            'description' => fake()->sentence(),
        ];
    }

    /**
     * Create a member role.
     */
    public function member(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'member',
            'description' => 'Standard community member',
        ]);
    }

    /**
     * Create a scholar role.
     */
    public function scholar(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'scholar',
            'description' => 'Scholar participating in programs',
        ]);
    }

    /**
     * Create a builder role.
     */
    public function builder(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'builder',
            'description' => 'Builder working on projects',
        ]);
    }

    /**
     * Create an organizer role.
     */
    public function organizer(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'organizer',
            'description' => 'Organizer managing programs and events',
        ]);
    }

    /**
     * Create a partner role.
     */
    public function partner(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'partner',
            'description' => 'Partner organization representative',
        ]);
    }

    /**
     * Create an admin role.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'admin',
            'description' => 'Platform administrator with full access',
        ]);
    }
}
