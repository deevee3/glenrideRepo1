<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserConnection extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'requester_id',
        'addressee_id',
        'status',
        'connected_at',
        'message',
    ];

    protected function casts(): array
    {
        return [
            'connected_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function addressee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'addressee_id');
    }

    /**
     * Accept the connection request.
     */
    public function accept(): void
    {
        $this->update([
            'status' => 'accepted',
            'connected_at' => now(),
        ]);
    }
}
