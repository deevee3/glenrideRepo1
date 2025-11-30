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
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();
            $table->enum('location_type', ['online', 'in_person', 'hybrid'])->default('online');
            $table->text('location_details')->nullable();
            $table->enum('visibility', ['public', 'members', 'program_only', 'cohort_only'])->default('members');
            $table->foreignUuid('program_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUuid('program_cohort_id')->nullable()->constrained('program_cohorts')->nullOnDelete();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['starts_at', 'visibility']);
            $table->index('program_id');
        });

        // Event registrations
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('event_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['registered', 'waitlisted', 'cancelled', 'attended'])->default('registered');
            $table->timestamp('registered_at')->useCurrent();
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamps();

            $table->unique(['event_id', 'user_id']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('events');
    }
};
