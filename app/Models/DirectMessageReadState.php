<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DirectMessageReadState extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'thread_id',
        'user_id',
        'last_read_message_id',
        'last_read_at',
        'notifications_muted',
        'muted_until',
    ];

    protected function casts(): array
    {
        return [
            'last_read_at' => 'datetime',
            'notifications_muted' => 'boolean',
            'muted_until' => 'datetime',
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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<DirectMessage, $this>
     */
    public function lastReadMessage(): BelongsTo
    {
        return $this->belongsTo(DirectMessage::class, 'last_read_message_id');
    }

    /**
     * Check if notifications are muted.
     */
    public function isMuted(): bool
    {
        return $this->notifications_muted
            || ($this->muted_until !== null && $this->muted_until > now());
    }
}
