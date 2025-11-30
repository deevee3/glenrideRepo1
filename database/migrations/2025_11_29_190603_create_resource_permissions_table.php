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
        Schema::create('resource_permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('resource_type', 50);
            $table->uuid('resource_id');
            $table->string('grantee_type', 20); // 'user' or 'role'
            $table->uuid('grantee_id');
            $table->foreignUuid('permission_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_allowed')->default(true);
            $table->timestamps();

            // Index for quick lookups
            $table->index(['resource_type', 'resource_id']);
            $table->index(['grantee_type', 'grantee_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resource_permissions');
    }
};
