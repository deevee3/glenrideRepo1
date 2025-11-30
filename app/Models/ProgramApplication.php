<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramApplication extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'program_id',
        'program_cohort_id',
        'role_self_identified',
        'location',
        'background',
        'motivation',
        'how_they_want_to_collaborate',
        'status',
        'review_notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'reviewed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Program, $this>
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
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
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Check if application is pending.
     */
    public function isPending(): bool
    {
        return in_array($this->status, ['submitted', 'under_review']);
    }
}
