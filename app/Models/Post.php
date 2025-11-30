<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Post extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'channel_id',
        'author_id',
        'body',
        'parent_post_id',
        'context_type',
        'context_id',
        'is_edited',
        'is_deleted',
    ];

    protected function casts(): array
    {
        return [
            'is_edited' => 'boolean',
            'is_deleted' => 'boolean',
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
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * @return BelongsTo<Post, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'parent_post_id');
    }

    /**
     * @return HasMany<Post, $this>
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Post::class, 'parent_post_id');
    }

    /**
     * @return HasMany<PostReaction, $this>
     */
    public function reactions(): HasMany
    {
        return $this->hasMany(PostReaction::class);
    }

    /**
     * @return HasMany<PostMention, $this>
     */
    public function mentions(): HasMany
    {
        return $this->hasMany(PostMention::class);
    }

    /**
     * @return HasMany<PostView, $this>
     */
    public function views(): HasMany
    {
        return $this->hasMany(PostView::class);
    }

    /**
     * @return MorphMany<FileLink, $this>
     */
    public function fileLinks(): MorphMany
    {
        return $this->morphMany(FileLink::class, 'linked', 'linked_type', 'linked_id');
    }

    /**
     * Check if post is a reply.
     */
    public function isReply(): bool
    {
        return $this->parent_post_id !== null;
    }

    /**
     * Scope: visible posts (not deleted).
     *
     * @param  \Illuminate\Database\Eloquent\Builder<Post>  $query
     * @return \Illuminate\Database\Eloquent\Builder<Post>
     */
    public function scopeVisible($query)
    {
        return $query->where('is_deleted', false);
    }
}
