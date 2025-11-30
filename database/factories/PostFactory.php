<?php

namespace Database\Factories;

use App\Models\Channel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'channel_id' => Channel::factory(),
            'author_id' => User::factory(),
            'body' => fake()->paragraphs(fake()->numberBetween(1, 3), true),
            'parent_post_id' => null,
            'context_type' => 'channel',
            'context_id' => null,
            'is_edited' => false,
            'is_deleted' => false,
        ];
    }

    /**
     * Indicate that the post is a reply.
     */
    public function reply($parentPost): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_post_id' => $parentPost->id,
            'channel_id' => $parentPost->channel_id,
        ]);
    }

    /**
     * Indicate that the post is deleted.
     */
    public function deleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_deleted' => true,
        ]);
    }

    /**
     * Indicate that the post is edited.
     */
    public function edited(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_edited' => true,
        ]);
    }
}
