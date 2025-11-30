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
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['idea', 'design', 'in_progress', 'paused', 'completed', 'archived'])->default('idea');
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('program_id')->nullable()->constrained()->nullOnDelete(); // If birthed inside a program
            $table->timestamps();

            $table->index('status');
        });

        // Junction table: projects <-> pillars
        Schema::create('project_pillars', function (Blueprint $table) {
            $table->foreignUuid('project_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('pillar_id')->constrained()->cascadeOnDelete();
            $table->primary(['project_id', 'pillar_id']);
        });

        // Junction table: projects <-> themes
        Schema::create('project_themes', function (Blueprint $table) {
            $table->foreignUuid('project_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('theme_id')->constrained()->cascadeOnDelete();
            $table->primary(['project_id', 'theme_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_themes');
        Schema::dropIfExists('project_pillars');
        Schema::dropIfExists('projects');
    }
};
