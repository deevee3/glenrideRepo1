<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('library_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('content_type', ['article', 'video', 'audio', 'briefing', 'guide', 'recording', 'other'])->default('article');
            $table->enum('access_level', ['public', 'members', 'program_members', 'cohort_members'])->default('members');
            $table->foreignUuid('program_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('program_cohort_id')->nullable()->constrained('program_cohorts')->nullOnDelete();
            $table->foreignUuid('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('external_url')->nullable(); // For hosted video/audio
            $table->json('rich_content')->nullable(); // Article body or CMS pointer
            $table->timestamp('published_at')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamps();

            $table->index(['status', 'access_level']);
            $table->index('published_at');
        });

        // Junction table: library_items <-> pillars
        Schema::create('library_item_pillars', function (Blueprint $table) {
            $table->foreignUuid('library_item_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('pillar_id')->constrained()->cascadeOnDelete();
            $table->primary(['library_item_id', 'pillar_id']);
        });

        // Junction table: library_items <-> themes
        Schema::create('library_item_themes', function (Blueprint $table) {
            $table->foreignUuid('library_item_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('theme_id')->constrained()->cascadeOnDelete();
            $table->primary(['library_item_id', 'theme_id']);
        });

        // Library item views (analytics)
        Schema::create('library_item_views', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('library_item_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('user_id')->nullable()->constrained()->nullOnDelete(); // Nullable for anonymous
            $table->timestamp('viewed_at')->useCurrent();

            $table->index(['library_item_id', 'viewed_at']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('library_item_views');
        Schema::dropIfExists('library_item_themes');
        Schema::dropIfExists('library_item_pillars');
        Schema::dropIfExists('library_items');
    }
};
