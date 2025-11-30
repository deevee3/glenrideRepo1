<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgramCohort extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'program_id',
        'name',
        'start_date',
        'end_date',
        'max_participants',
        'status',
        'meeting_cadence',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
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
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'cohort_participants')
            ->withPivot(['role', 'status', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<CohortParticipant, $this>
     */
    public function participantRecords(): HasMany
    {
        return $this->hasMany(CohortParticipant::class);
    }

    /**
     * @return HasMany<ProgramSession, $this>
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(ProgramSession::class);
    }

    /**
     * @return HasMany<ProgramApplication, $this>
     */
    public function applications(): HasMany
    {
        return $this->hasMany(ProgramApplication::class);
    }

    /**
     * @return HasMany<Event, $this>
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Check if cohort has capacity.
     */
    public function hasCapacity(): bool
    {
        if ($this->max_participants === null) {
            return true;
        }

        return $this->participants()->count() < $this->max_participants;
    }
}
