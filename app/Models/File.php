<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class File extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'uploader_id',
        'storage_provider',
        'storage_key',
        'original_filename',
        'mime_type',
        'size_bytes',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    /**
     * @return HasMany<FileLink, $this>
     */
    public function links(): HasMany
    {
        return $this->hasMany(FileLink::class);
    }
}
