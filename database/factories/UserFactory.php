<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'display_name' => fake()->optional(0.3)->userName(),
            'pronouns' => fake()->optional(0.5)->randomElement(['he/him', 'she/her', 'they/them']),
            'location' => fake()->optional(0.6)->city(),
            'bio' => fake()->optional(0.4)->paragraph(),
            'profile_image_url' => fake()->optional(0.3)->imageUrl(200, 200, 'people'),
            'website_url' => fake()->optional(0.2)->url(),
            'status' => 'active',
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user has a specific status.
     */
    public function withStatus(string $status): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => $status,
        ]);
    }

    /**
     * Indicate that the user is invited (not yet active).
     */
    public function invited(): static
    {
        return $this->withStatus('invited')->state(fn (array $attributes) => [
            'password' => null,
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user is deactivated.
     */
    public function deactivated(): static
    {
        return $this->withStatus('deactivated');
    }

    /**
     * Indicate that the user is banned.
     */
    public function banned(): static
    {
        return $this->withStatus('banned');
    }

    /**
     * Indicate that the model does not have two-factor authentication configured.
     */
    public function withoutTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ]);
    }
}
