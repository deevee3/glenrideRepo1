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
        Schema::create('program_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('program_cohort_id')->constrained('program_cohorts')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();
            $table->enum('location_type', ['online', 'in_person', 'hybrid'])->default('online');
            $table->text('location_details')->nullable(); // Zoom link, address, etc.
            $table->timestamps();

            $table->index(['program_cohort_id', 'starts_at']);
        });

        // Session attendance tracking
        Schema::create('session_attendance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('program_session_id')->constrained('program_sessions')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['attended', 'absent', 'excused'])->default('absent');
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamps();

            $table->unique(['program_session_id', 'user_id']);
        });

        // Session feedback
        Schema::create('session_feedback', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('program_session_id')->constrained('program_sessions')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('rating')->nullable(); // 1-5
            $table->enum('mood', ['energized', 'neutral', 'stretched', 'concerned'])->nullable();
            $table->json('feedback_text')->nullable(); // Flexible for form answers
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();

            $table->unique(['program_session_id', 'user_id']);
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('session_feedback');
        Schema::dropIfExists('session_attendance');
        Schema::dropIfExists('program_sessions');
    }
};
