<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'long_description',
        'program_type',
        'application_open_at',
        'application_close_at',
        'default_duration_weeks',
        'is_public',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'application_open_at' => 'datetime',
            'application_close_at' => 'datetime',
            'is_public' => 'boolean',
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
     * @return BelongsToMany<Pillar, $this>
     */
    public function pillars(): BelongsToMany
    {
        return $this->belongsToMany(Pillar::class, 'program_pillars');
    }

    /**
     * @return BelongsToMany<Theme, $this>
     */
    public function themes(): BelongsToMany
    {
        return $this->belongsToMany(Theme::class, 'program_themes');
    }

    /**
     * @return HasMany<ProgramCohort, $this>
     */
    public function cohorts(): HasMany
    {
        return $this->hasMany(ProgramCohort::class);
    }

    /**
     * @return HasMany<ProgramApplication, $this>
     */
    public function applications(): HasMany
    {
        return $this->hasMany(ProgramApplication::class);
    }

    /**
     * @return HasMany<Project, $this>
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    /**
     * @return HasMany<Event, $this>
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    /**
     * @return HasMany<Channel, $this>
     */
    public function channels(): HasMany
    {
        return $this->hasMany(Channel::class);
    }

    /**
     * Check if applications are currently open.
     */
    public function isAcceptingApplications(): bool
    {
        $now = now();

        return $this->status === 'active'
            && ($this->application_open_at === null || $this->application_open_at <= $now)
            && ($this->application_close_at === null || $this->application_close_at >= $now);
    }
}
