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
        Schema::create('channels', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // slug-safe e.g., "announcements"
            $table->string('display_name'); // e.g., "Announcements"
            $table->text('description')->nullable();
            $table->enum('visibility', ['public', 'members', 'program_only'])->default('members');
            $table->foreignUuid('program_id')->nullable()->constrained()->cascadeOnDelete();
            $table->boolean('is_read_only')->default(false);
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['name', 'program_id']);
            $table->index('visibility');
        });

        // Channel memberships
        Schema::create('channel_memberships', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('channel_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['owner', 'moderator', 'member', 'guest'])->default('member');
            $table->enum('notification_level', ['muted', 'default', 'high'])->default('default');
            $table->uuid('last_read_post_id')->nullable(); // Will add FK after posts table
            $table->timestamp('last_read_at')->nullable();
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamp('muted_until')->nullable();
            $table->timestamps();

            $table->unique(['channel_id', 'user_id']);
            $table->index('last_read_post_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('channel_memberships');
        Schema::dropIfExists('channels');
    }
};
