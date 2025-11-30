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
        // User connections (follow/connection graph)
        Schema::create('user_connections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('requester_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('addressee_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'blocked'])->default('pending');
            $table->timestamp('connected_at')->nullable();
            $table->text('message')->nullable(); // Optional invite note
            $table->timestamps();

            $table->unique(['requester_id', 'addressee_id']);
            $table->index(['addressee_id', 'status']);
        });

        // Saved items (bookmarks/watchlists)
        Schema::create('saved_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->enum('saveable_type', ['post', 'event', 'project', 'task', 'library_item', 'program']);
            $table->uuid('saveable_id');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'saveable_type', 'saveable_id']);
            $table->index(['saveable_type', 'saveable_id']);
        });

        // User settings
        Schema::create('user_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('setting_key'); // e.g., 'email_notifications', 'timezone'
            $table->json('setting_value')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'setting_key']);
        });

        // Feature flags
        Schema::create('feature_flags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_enabled')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feature_flags');
        Schema::dropIfExists('user_settings');
        Schema::dropIfExists('saved_items');
        Schema::dropIfExists('user_connections');
    }
};
