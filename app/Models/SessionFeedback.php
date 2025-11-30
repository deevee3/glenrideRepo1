<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessionFeedback extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'session_feedback';

    protected $fillable = [
        'program_session_id',
        'user_id',
        'rating',
        'mood',
        'feedback_text',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'feedback_text' => 'json',
            'submitted_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<ProgramSession, $this>
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(ProgramSession::class, 'program_session_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
