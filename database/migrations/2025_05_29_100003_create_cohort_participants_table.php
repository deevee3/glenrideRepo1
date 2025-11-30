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
        Schema::create('cohort_participants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('program_cohort_id')->constrained('program_cohorts')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['participant', 'facilitator', 'mentor', 'admin'])->default('participant');
            $table->enum('status', ['active', 'completed', 'dropped'])->default('active');
            $table->timestamp('joined_at')->nullable();
            $table->timestamps();

            $table->unique(['program_cohort_id', 'user_id']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cohort_participants');
    }
};
