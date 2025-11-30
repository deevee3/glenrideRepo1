<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SavedItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'saveable_type',
        'saveable_id',
        'notes',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function saveable(): MorphTo
    {
        return $this->morphTo('saveable', 'saveable_type', 'saveable_id');
    }
}
