<?php

namespace Database\Seeders;

use App\Models\Pillar;
use Illuminate\Database\Seeder;

class PillarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pillars = [
            [
                'name' => 'ethics',
                'description' => 'Examining moral principles and frameworks for just technology. Ethics explores the foundations of what we ought to do and how we can build systems that respect human dignity.',
            ],
            [
                'name' => 'critique',
                'description' => 'Analyzing systems of power and challenging existing structures. Critique provides the tools to understand how technology reflects and reinforces social inequalities.',
            ],
            [
                'name' => 'praxis',
                'description' => 'Putting theory into practice through hands-on building. Praxis bridges the gap between understanding and action, creating tangible alternatives.',
            ],
        ];

        foreach ($pillars as $pillar) {
            Pillar::firstOrCreate(
                ['name' => $pillar['name']],
                ['description' => $pillar['description']]
            );
        }
    }
}
