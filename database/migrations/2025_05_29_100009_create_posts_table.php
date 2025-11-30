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
        Schema::create('posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('channel_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignUuid('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('body');
            $table->uuid('parent_post_id')->nullable(); // Self-reference for threads
            $table->enum('context_type', ['channel', 'project', 'program', 'event', 'direct_message_thread'])->default('channel');
            $table->uuid('context_id')->nullable(); // Polymorphic: project_id, program_cohort_id, etc.
            $table->boolean('is_edited')->default(false);
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->foreign('parent_post_id')->references('id')->on('posts')->cascadeOnDelete();
            $table->index(['channel_id', 'created_at']);
            $table->index(['context_type', 'context_id']);
            $table->index('parent_post_id');
        });

        // Add FK to channel_memberships now that posts exists
        Schema::table('channel_memberships', function (Blueprint $table) {
            $table->foreign('last_read_post_id')->references('id')->on('posts')->nullOnDelete();
        });

        // Post reactions
        Schema::create('post_reactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('post_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->enum('reaction_type', ['like', 'insightful', 'support', 'celebrate'])->default('like');
            $table->timestamps();

            $table->unique(['post_id', 'user_id', 'reaction_type']);
        });

        // Post mentions
        Schema::create('post_mentions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('post_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('mentioned_user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['post_id', 'mentioned_user_id']);
            $table->index('mentioned_user_id');
        });

        // Post views (read receipts)
        Schema::create('post_views', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('post_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('viewed_at')->useCurrent();

            $table->unique(['post_id', 'user_id']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_views');
        Schema::dropIfExists('post_mentions');
        Schema::dropIfExists('post_reactions');

        Schema::table('channel_memberships', function (Blueprint $table) {
            $table->dropForeign(['last_read_post_id']);
        });

        Schema::dropIfExists('posts');
    }
};
