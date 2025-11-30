<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DirectMessage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'thread_id',
        'sender_id',
        'body',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'is_deleted' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<DirectMessageThread, $this>
     */
    public function thread(): BelongsTo
    {
        return $this->belongsTo(DirectMessageThread::class, 'thread_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
