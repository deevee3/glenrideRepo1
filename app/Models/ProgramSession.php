<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgramSession extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'program_cohort_id',
        'title',
        'description',
        'starts_at',
        'ends_at',
        'location_type',
        'location_details',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
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
     * @return HasMany<SessionAttendance, $this>
     */
    public function attendance(): HasMany
    {
        return $this->hasMany(SessionAttendance::class, 'program_session_id');
    }

    /**
     * @return HasMany<SessionFeedback, $this>
     */
    public function feedback(): HasMany
    {
        return $this->hasMany(SessionFeedback::class, 'program_session_id');
    }

    /**
     * Check if session is upcoming.
     */
    public function isUpcoming(): bool
    {
        return $this->starts_at > now();
    }

    /**
     * Check if session is in progress.
     */
    public function isInProgress(): bool
    {
        $now = now();

        return $this->starts_at <= $now && ($this->ends_at === null || $this->ends_at >= $now);
    }
}
