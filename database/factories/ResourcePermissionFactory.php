<?php

namespace Database\Factories;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ResourcePermission>
 */
class ResourcePermissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resource_type' => fake()->randomElement(['project', 'program', 'channel', 'library_item', 'event']),
            'resource_id' => Str::uuid(),
            'grantee_type' => 'user',
            'grantee_id' => User::factory(),
            'permission_id' => Permission::factory(),
            'is_allowed' => true,
        ];
    }

    /**
     * Configure the grant to be for a user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn () => [
            'grantee_type' => 'user',
            'grantee_id' => $user->id,
        ]);
    }

    /**
     * Configure the grant as a denial.
     */
    public function denied(): static
    {
        return $this->state(fn () => [
            'is_allowed' => false,
        ]);
    }
}
