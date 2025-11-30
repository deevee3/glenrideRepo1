<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasUuids, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'first_name',
        'last_name',
        'display_name',
        'pronouns',
        'location',
        'bio',
        'profile_image_url',
        'website_url',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'name',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the user's full name.
     */
    public function getNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * @return BelongsToMany<Role, $this>
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles')
            ->withPivot('created_at');
    }

    /**
     * @return BelongsToMany<Pillar, $this>
     */
    public function pillars(): BelongsToMany
    {
        return $this->belongsToMany(Pillar::class, 'user_pillars')
            ->withPivot('created_at');
    }

    /**
     * @return BelongsToMany<Theme, $this>
     */
    public function themes(): BelongsToMany
    {
        return $this->belongsToMany(Theme::class, 'user_themes')
            ->withPivot('created_at');
    }

    /**
     * @return BelongsToMany<Skill, $this>
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'user_skills')
            ->withPivot(['proficiency', 'created_at']);
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user has a specific permission through their roles.
     */
    public function hasPermission(string $permissionName): bool
    {
        // Admin users have all permissions
        if ($this->hasRole('admin')) {
            return true;
        }

        return $this->roles()
            ->whereHas('permissions', fn ($q) => $q->where('name', $permissionName))
            ->exists();
    }

    /**
     * Check if user has any of the given permissions.
     *
     * @param  array<string>  $permissionNames
     */
    public function hasAnyPermission(array $permissionNames): bool
    {
        if ($this->hasRole('admin')) {
            return true;
        }

        return $this->roles()
            ->whereHas('permissions', fn ($q) => $q->whereIn('name', $permissionNames))
            ->exists();
    }

    /**
     * Get all permission names for this user (cached for request lifecycle).
     *
     * @return array<string>
     */
    public function getAllPermissions(): array
    {
        if ($this->hasRole('admin')) {
            return Permission::pluck('name')->toArray();
        }

        return $this->roles()
            ->with('permissions')
            ->get()
            ->flatMap(fn ($role) => $role->permissions->pluck('name'))
            ->unique()
            ->values()
            ->toArray();
    }

    /**
     * Check if user is a cohort member (participant, facilitator, mentor, or admin).
     */
    public function isCohortMember(string $cohortId): bool
    {
        return $this->cohorts()
            ->where('program_cohort_id', $cohortId)
            ->where('cohort_participants.status', 'active')
            ->exists();
    }

    /**
     * Check if user is a cohort facilitator.
     */
    public function isCohortFacilitator(string $cohortId): bool
    {
        return $this->cohorts()
            ->where('program_cohort_id', $cohortId)
            ->where('cohort_participants.role', 'facilitator')
            ->where('cohort_participants.status', 'active')
            ->exists();
    }

    /**
     * Check if user is a member of any cohort in a program.
     */
    public function isProgramMember(string $programId): bool
    {
        return $this->cohorts()
            ->whereHas('program', fn ($q) => $q->where('id', $programId))
            ->where('cohort_participants.status', 'active')
            ->exists();
    }

    /**
     * Check if user is a project member.
     */
    public function isProjectMember(string $projectId): bool
    {
        return $this->projects()
            ->where('project_id', $projectId)
            ->where('project_members.is_active', true)
            ->exists();
    }

    /**
     * Check if user is a project lead.
     */
    public function isProjectLead(string $projectId): bool
    {
        return $this->projects()
            ->where('project_id', $projectId)
            ->where('project_members.role', 'lead')
            ->where('project_members.is_active', true)
            ->exists();
    }

    /**
     * @return HasMany<ProgramApplication, $this>
     */
    public function programApplications(): HasMany
    {
        return $this->hasMany(ProgramApplication::class);
    }

    /**
     * @return BelongsToMany<ProgramCohort, $this>
     */
    public function cohorts(): BelongsToMany
    {
        return $this->belongsToMany(ProgramCohort::class, 'cohort_participants')
            ->withPivot(['role', 'status', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * @return BelongsToMany<Project, $this>
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_members')
            ->withPivot(['role', 'is_active', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<Task, $this>
     */
    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    /**
     * @return BelongsToMany<Channel, $this>
     */
    public function channels(): BelongsToMany
    {
        return $this->belongsToMany(Channel::class, 'channel_memberships')
            ->withPivot(['role', 'notification_level', 'last_read_post_id', 'last_read_at', 'joined_at'])
            ->withTimestamps();
    }

    /**
     * @return BelongsToMany<DirectMessageThread, $this>
     */
    public function directMessageThreads(): BelongsToMany
    {
        return $this->belongsToMany(DirectMessageThread::class, 'direct_message_participants', 'user_id', 'thread_id')
            ->withPivot('joined_at');
    }

    /**
     * @return BelongsToMany<Event, $this>
     */
    public function registeredEvents(): BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'event_registrations')
            ->withPivot(['status', 'registered_at', 'checked_in_at'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<Notification, $this>
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * @return HasMany<SavedItem, $this>
     */
    public function savedItems(): HasMany
    {
        return $this->hasMany(SavedItem::class);
    }

    /**
     * @return HasMany<UserSetting, $this>
     */
    public function settings(): HasMany
    {
        return $this->hasMany(UserSetting::class);
    }

    /**
     * Get a specific user setting.
     */
    public function getSetting(string $key, mixed $default = null): mixed
    {
        $setting = $this->settings()->where('setting_key', $key)->first();

        return $setting?->setting_value ?? $default;
    }

    /**
     * @return HasMany<ActivityLog, $this>
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'actor_id');
    }

    /**
     * Get the user's total earned points from activities.
     */
    public function getTotalPointsAttribute(): int
    {
        return $this->activityLogs()->sum('points_value');
    }

    /**
     * Get the user's recent activity.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, ActivityLog>
     */
    public function recentActivity(int $limit = 20): \Illuminate\Database\Eloquent\Collection
    {
        return $this->activityLogs()
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }
}
