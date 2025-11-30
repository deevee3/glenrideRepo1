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
        // Join requests (public-to-logged-in bridge)
        Schema::create('join_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('self_description')->nullable(); // Role they chose
            $table->string('location')->nullable();
            $table->text('current_work')->nullable();
            $table->text('collaboration_idea')->nullable();
            $table->enum('status', ['new', 'in_review', 'responded', 'converted_to_user'])->default('new');
            $table->foreignUuid('linked_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('status');
            $table->index('email');
        });

        // Contact messages
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('subject')->nullable();
            $table->text('message');
            $table->enum('status', ['new', 'in_review', 'responded', 'archived'])->default('new');
            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('join_requests');
    }
};
