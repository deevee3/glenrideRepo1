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
        Schema::create('program_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('program_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('program_cohort_id')->nullable()->constrained('program_cohorts')->nullOnDelete();
            $table->string('role_self_identified')->nullable(); // scholar/builder/organizer/partner/other
            $table->string('location')->nullable(); // snapshot at time of application
            $table->text('background')->nullable();
            $table->text('motivation')->nullable();
            $table->text('how_they_want_to_collaborate')->nullable();
            $table->enum('status', ['submitted', 'under_review', 'accepted', 'rejected', 'withdrawn'])->default('submitted');
            $table->text('review_notes')->nullable();
            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index(['user_id', 'program_id']);
            $table->unique(['user_id', 'program_id', 'program_cohort_id'], 'unique_user_program_cohort_application');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_applications');
    }
};
