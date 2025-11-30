<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DirectMessageThread extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [];

    /**
     * @return BelongsToMany<User, $this>
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'direct_message_participants', 'thread_id')
            ->withPivot('joined_at');
    }

    /**
     * @return HasMany<DirectMessage, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(DirectMessage::class, 'thread_id');
    }

    /**
     * @return HasMany<DirectMessageReadState, $this>
     */
    public function readStates(): HasMany
    {
        return $this->hasMany(DirectMessageReadState::class, 'thread_id');
    }

    /**
     * Get the latest message.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne<DirectMessage, $this>
     */
    public function latestMessage()
    {
        return $this->hasOne(DirectMessage::class, 'thread_id')->latestOfMany();
    }
}
