<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JoinRequest extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'email',
        'self_description',
        'location',
        'current_work',
        'collaboration_idea',
        'status',
        'linked_user_id',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function linkedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'linked_user_id');
    }
}
