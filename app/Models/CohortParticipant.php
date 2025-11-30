<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CohortParticipant extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'program_cohort_id',
        'user_id',
        'role',
        'status',
        'joined_at',
    ];

    protected function casts(): array
    {
        return [
            'joined_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<ProgramCohort, $this>
     */
    public function cohort(): BelongsTo
    {
        return $this->belongsTo(ProgramCohort::class, 'program_cohort_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if participant is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
