<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Channel extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'visibility',
        'program_id',
        'is_read_only',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_read_only' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsTo<Program, $this>
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'channel_memberships')
            ->withPivot(['role', 'notification_level', 'last_read_post_id', 'last_read_at', 'joined_at', 'muted_until'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<ChannelMembership, $this>
     */
    public function memberships(): HasMany
    {
        return $this->hasMany(ChannelMembership::class);
    }

    /**
     * @return HasMany<Post, $this>
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get root posts (not replies).
     *
     * @return HasMany<Post, $this>
     */
    public function rootPosts(): HasMany
    {
        return $this->posts()->whereNull('parent_post_id');
    }
}
