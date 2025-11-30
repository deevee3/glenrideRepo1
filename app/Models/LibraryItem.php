<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class LibraryItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content_type',
        'access_level',
        'program_id',
        'program_cohort_id',
        'author_id',
        'external_url',
        'rich_content',
        'published_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'rich_content' => 'json',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
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
     * @return BelongsToMany<Pillar, $this>
     */
    public function pillars(): BelongsToMany
    {
        return $this->belongsToMany(Pillar::class, 'library_item_pillars');
    }

    /**
     * @return BelongsToMany<Theme, $this>
     */
    public function themes(): BelongsToMany
    {
        return $this->belongsToMany(Theme::class, 'library_item_themes');
    }

    /**
     * @return HasMany<LibraryItemView, $this>
     */
    public function views(): HasMany
    {
        return $this->hasMany(LibraryItemView::class);
    }

    /**
     * @return MorphMany<FileLink, $this>
     */
    public function fileLinks(): MorphMany
    {
        return $this->morphMany(FileLink::class, 'linked', 'linked_type', 'linked_id');
    }

    /**
     * Scope: published items only.
     *
     * @param  \Illuminate\Database\Eloquent\Builder<LibraryItem>  $query
     * @return \Illuminate\Database\Eloquent\Builder<LibraryItem>
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
