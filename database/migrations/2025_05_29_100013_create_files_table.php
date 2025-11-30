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
        // Files metadata
        Schema::create('files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('uploader_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('storage_provider', ['s3', 'gcs', 'local'])->default('local');
            $table->string('storage_key'); // Path in bucket
            $table->string('original_filename');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->timestamps();

            $table->index('uploader_id');
        });

        // Polymorphic file attachments
        Schema::create('file_links', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('file_id')->constrained()->cascadeOnDelete();
            $table->enum('linked_type', ['project', 'task', 'program', 'program_session', 'library_item', 'post', 'event']);
            $table->uuid('linked_id'); // Polymorphic ID
            $table->timestamps();

            $table->index(['linked_type', 'linked_id']);
            $table->index('file_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_links');
        Schema::dropIfExists('files');
    }
};
