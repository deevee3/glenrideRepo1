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
        Schema::create('program_cohorts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('program_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g., "Cohort 01 – 2025"
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->unsignedInteger('max_participants')->nullable();
            $table->enum('status', ['upcoming', 'active', 'completed', 'archived'])->default('upcoming');
            $table->text('meeting_cadence')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index(['program_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_cohorts');
    }
};
