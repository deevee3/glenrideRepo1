<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class FileLink extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'file_id',
        'linked_type',
        'linked_id',
    ];

    /**
     * @return BelongsTo<File, $this>
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class);
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function linked(): MorphTo
    {
        return $this->morphTo('linked', 'linked_type', 'linked_id');
    }
}
