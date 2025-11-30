<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Event extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'description',
        'starts_at',
        'ends_at',
        'location_type',
        'location_details',
        'visibility',
        'program_id',
        'program_cohort_id',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
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
     * @return BelongsTo<ProgramCohort, $this>
     */
    public function cohort(): BelongsTo
    {
        return $this->belongsTo(ProgramCohort::class, 'program_cohort_id');
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function registrants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_registrations')
            ->withPivot(['status', 'registered_at', 'checked_in_at'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<EventRegistration, $this>
     */
    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }

    /**
     * @return MorphMany<FileLink, $this>
     */
    public function fileLinks(): MorphMany
    {
        return $this->morphMany(FileLink::class, 'linked', 'linked_type', 'linked_id');
    }

    /**
     * Check if event is upcoming.
     */
    public function isUpcoming(): bool
    {
        return $this->starts_at > now();
    }

    /**
     * Check if event is in progress.
     */
    public function isInProgress(): bool
    {
        $now = now();

        return $this->starts_at <= $now && ($this->ends_at === null || $this->ends_at >= $now);
    }

    /**
     * Check if event has ended.
     */
    public function hasEnded(): bool
    {
        return $this->ends_at !== null && $this->ends_at < now();
    }
}
