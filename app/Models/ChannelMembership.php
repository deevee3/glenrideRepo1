<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChannelMembership extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'channel_id',
        'user_id',
        'role',
        'notification_level',
        'last_read_post_id',
        'last_read_at',
        'joined_at',
        'muted_until',
    ];

    protected function casts(): array
    {
        return [
            'last_read_at' => 'datetime',
            'joined_at' => 'datetime',
            'muted_until' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Channel, $this>
     */
    public function channel(): BelongsTo
    {
        return $this->belongsTo(Channel::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Post, $this>
     */
    public function lastReadPost(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'last_read_post_id');
    }

    /**
     * Check if membership is muted.
     */
    public function isMuted(): bool
    {
        return $this->notification_level === 'muted'
            || ($this->muted_until !== null && $this->muted_until > now());
    }
}
