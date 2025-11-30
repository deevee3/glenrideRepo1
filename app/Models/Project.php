<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Project extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'slug',
        'summary',
        'description',
        'status',
        'created_by',
        'program_id',
    ];

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
     * @return BelongsToMany<Pillar, $this>
     */
    public function pillars(): BelongsToMany
    {
        return $this->belongsToMany(Pillar::class, 'project_pillars');
    }

    /**
     * @return BelongsToMany<Theme, $this>
     */
    public function themes(): BelongsToMany
    {
        return $this->belongsToMany(Theme::class, 'project_themes');
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->using(ProjectMember::class)
            ->withPivot(['id', 'role', 'is_active', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<ProjectMember, $this>
     */
    public function memberRecords(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    /**
     * @return HasMany<Task, $this>
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * @return HasMany<ProjectReflection, $this>
     */
    public function reflections(): HasMany
    {
        return $this->hasMany(ProjectReflection::class);
    }

    /**
     * @return MorphMany<FileLink, $this>
     */
    public function fileLinks(): MorphMany
    {
        return $this->morphMany(FileLink::class, 'linked', 'linked_type', 'linked_id');
    }

    /**
     * Get active members only.
     *
     * @return BelongsToMany<User, $this>
     */
    public function activeMembers(): BelongsToMany
    {
        return $this->members()->wherePivot('is_active', true);
    }
}
