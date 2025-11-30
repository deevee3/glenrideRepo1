<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeatureFlag extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'key',
        'description',
        'is_enabled',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
        ];
    }

    /**
     * Check if a feature is enabled.
     */
    public static function isEnabled(string $key): bool
    {
        $flag = self::where('key', $key)->first();

        return $flag?->is_enabled ?? false;
    }
}
