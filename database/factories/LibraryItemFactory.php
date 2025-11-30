<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LibraryItem>
 */
class LibraryItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(5);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'content_type' => fake()->randomElement(['article', 'video', 'audio', 'briefing', 'guide']),
            'access_level' => 'members',
            'program_id' => null,
            'program_cohort_id' => null,
            'author_id' => User::factory(),
            'external_url' => null,
            'rich_content' => ['body' => fake()->paragraphs(5, true)],
            'published_at' => now(),
            'status' => 'published',
        ];
    }

    /**
     * Indicate that the item is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the item is public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'access_level' => 'public',
        ]);
    }

    /**
     * Indicate that the item is a video.
     */
    public function video(): static
    {
        return $this->state(fn (array $attributes) => [
            'content_type' => 'video',
            'external_url' => 'https://youtube.com/watch?v='.Str::random(11),
            'rich_content' => null,
        ]);
    }

    /**
     * Indicate that the item is a recording.
     */
    public function recording(): static
    {
        return $this->state(fn (array $attributes) => [
            'content_type' => 'recording',
            'external_url' => fake()->url(),
        ]);
    }
}
