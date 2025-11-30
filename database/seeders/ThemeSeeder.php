<?php

namespace Database\Seeders;

use App\Models\Theme;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $themes = [
            'Climate & Extractive Economies',
            'Migration & Borders',
            'Artificial Intelligence',
            'Surveillance & Privacy',
            'Digital Labor',
            'Platform Governance',
            'Data Justice',
            'Algorithmic Accountability',
            'Community Technology',
            'Decolonial Design',
        ];

        foreach ($themes as $name) {
            Theme::firstOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'description' => null,
                ]
            );
        }
    }
}
