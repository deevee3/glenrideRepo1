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
        // DM threads
        Schema::create('direct_message_threads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
        });

        // DM thread participants
        Schema::create('direct_message_participants', function (Blueprint $table) {
            $table->foreignUuid('thread_id')->constrained('direct_message_threads')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('joined_at')->useCurrent();

            $table->primary(['thread_id', 'user_id']);
        });

        // Direct messages
        Schema::create('direct_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('thread_id')->constrained('direct_message_threads')->cascadeOnDelete();
            $table->foreignUuid('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('body');
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            $table->index(['thread_id', 'created_at']);
        });

        // DM read states
        Schema::create('direct_message_read_states', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('thread_id')->constrained('direct_message_threads')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('last_read_message_id')->nullable()->constrained('direct_messages')->nullOnDelete();
            $table->timestamp('last_read_at')->nullable();
            $table->boolean('notifications_muted')->default(false);
            $table->timestamp('muted_until')->nullable();
            $table->timestamps();

            $table->unique(['thread_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('direct_message_read_states');
        Schema::dropIfExists('direct_messages');
        Schema::dropIfExists('direct_message_participants');
        Schema::dropIfExists('direct_message_threads');
    }
};
