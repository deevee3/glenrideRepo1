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
        Schema::table('tasks', function (Blueprint $table) {
            // Date tracking
            $table->date('start_date')->nullable()->after('due_date');
            $table->timestamp('completed_at')->nullable()->after('start_date');

            // Time estimation and tracking
            $table->decimal('estimated_hours', 6, 2)->nullable()->after('completed_at');
            $table->decimal('actual_hours', 6, 2)->nullable()->after('estimated_hours');

            // Organization
            $table->integer('sort_order')->default(0)->after('actual_hours');
            $table->json('labels')->nullable()->after('sort_order');

            // Additional notes (internal)
            $table->text('notes')->nullable()->after('labels');

            // Index for sorting and filtering
            $table->index(['project_id', 'sort_order']);
            $table->index('start_date');
            $table->index('completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropIndex(['project_id', 'sort_order']);
            $table->dropIndex(['start_date']);
            $table->dropIndex(['completed_at']);

            $table->dropColumn([
                'start_date',
                'completed_at',
                'estimated_hours',
                'actual_hours',
                'sort_order',
                'labels',
                'notes',
            ]);
        });
    }
};
