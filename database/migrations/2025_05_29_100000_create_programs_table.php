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
        Schema::create('programs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('short_description')->nullable();
            $table->text('long_description')->nullable();
            $table->enum('program_type', ['fellowship', 'lab', 'school', 'incubator', 'studio', 'other'])->default('other');
            $table->timestamp('application_open_at')->nullable();
            $table->timestamp('application_close_at')->nullable();
            $table->unsignedInteger('default_duration_weeks')->nullable();
            $table->boolean('is_public')->default(false);
            $table->enum('status', ['draft', 'upcoming', 'active', 'completed', 'archived'])->default('draft');
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('status');
            $table->index('is_public');
        });

        // Junction table: programs <-> pillars
        Schema::create('program_pillars', function (Blueprint $table) {
            $table->foreignUuid('program_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('pillar_id')->constrained()->cascadeOnDelete();
            $table->primary(['program_id', 'pillar_id']);
        });

        // Junction table: programs <-> themes
        Schema::create('program_themes', function (Blueprint $table) {
            $table->foreignUuid('program_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('theme_id')->constrained()->cascadeOnDelete();
            $table->primary(['program_id', 'theme_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_themes');
        Schema::dropIfExists('program_pillars');
        Schema::dropIfExists('programs');
    }
};
