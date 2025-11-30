<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            // Research
            ['name' => 'Research', 'category' => 'research'],
            ['name' => 'Data Analysis', 'category' => 'research'],
            ['name' => 'Qualitative Methods', 'category' => 'research'],
            ['name' => 'Quantitative Methods', 'category' => 'research'],
            ['name' => 'Policy Analysis', 'category' => 'research'],

            // Technical
            ['name' => 'Software Development', 'category' => 'technical'],
            ['name' => 'Data Science', 'category' => 'technical'],
            ['name' => 'Machine Learning', 'category' => 'technical'],
            ['name' => 'UX/UI Design', 'category' => 'technical'],
            ['name' => 'Product Management', 'category' => 'technical'],

            // Organizing
            ['name' => 'Community Organizing', 'category' => 'organizing'],
            ['name' => 'Campaign Strategy', 'category' => 'organizing'],
            ['name' => 'Coalition Building', 'category' => 'organizing'],
            ['name' => 'Advocacy', 'category' => 'organizing'],
            ['name' => 'Grassroots Mobilization', 'category' => 'organizing'],

            // Communication
            ['name' => 'Writing', 'category' => 'communication'],
            ['name' => 'Public Speaking', 'category' => 'communication'],
            ['name' => 'Facilitation', 'category' => 'communication'],
            ['name' => 'Storytelling', 'category' => 'communication'],
            ['name' => 'Media Relations', 'category' => 'communication'],

            // Policy (categorized under research/other)
            ['name' => 'Policy Drafting', 'category' => 'research'],
            ['name' => 'Legislative Analysis', 'category' => 'research'],
            ['name' => 'Regulatory Affairs', 'category' => 'other'],
            ['name' => 'Government Relations', 'category' => 'other'],

            // Other
            ['name' => 'Project Management', 'category' => 'other'],
            ['name' => 'Fundraising', 'category' => 'other'],
            ['name' => 'Legal Analysis', 'category' => 'other'],
            ['name' => 'Education & Training', 'category' => 'other'],
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate(
                ['name' => $skill['name']],
                ['category' => $skill['category']]
            );
        }
    }
}
