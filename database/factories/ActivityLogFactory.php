<?php

namespace Database\Factories;

use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $action = fake()->randomElement(array_keys(ActivityLogService::POINTS));

        return [
            'actor_id' => User::factory(),
            'action' => $action,
            'entity_type' => fake()->randomElement(['project', 'task', 'post', 'event', 'library_item']),
            'entity_id' => Str::uuid()->toString(),
            'metadata' => null,
            'points_value' => ActivityLogService::POINTS[$action] ?? 1,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }

    /**
     * Indicate the activity is for a specific action.
     */
    public function action(string $action): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => $action,
            'points_value' => ActivityLogService::POINTS[$action] ?? 1,
        ]);
    }

    /**
     * Indicate the activity is for a specific entity.
     */
    public function forEntity(string $entityType, ?string $entityId = null): static
    {
        return $this->state(fn (array $attributes) => [
            'entity_type' => $entityType,
            'entity_id' => $entityId ?? Str::uuid()->toString(),
        ]);
    }

    /**
     * Indicate the activity was performed by a specific user.
     */
    public function byUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'actor_id' => $user->id,
        ]);
    }

    /**
     * Indicate the activity is a system action (no actor).
     */
    public function system(): static
    {
        return $this->state(fn (array $attributes) => [
            'actor_id' => null,
        ]);
    }

    /**
     * Include metadata.
     */
    public function withMetadata(array $metadata): static
    {
        return $this->state(fn (array $attributes) => [
            'metadata' => $metadata,
        ]);
    }
}
