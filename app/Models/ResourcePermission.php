<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResourcePermission extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'resource_type',
        'resource_id',
        'grantee_type',
        'grantee_id',
        'permission_id',
        'is_allowed',
    ];

    protected function casts(): array
    {
        return [
            'is_allowed' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Permission, $this>
     */
    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }

    /**
     * Check if this grant is for a specific user.
     */
    public function isForUser(): bool
    {
        return $this->grantee_type === 'user';
    }

    /**
     * Check if this grant is for a role.
     */
    public function isForRole(): bool
    {
        return $this->grantee_type === 'role';
    }
}
