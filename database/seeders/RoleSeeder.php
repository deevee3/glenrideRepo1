<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'member',
                'description' => 'Standard community member',
            ],
            [
                'name' => 'scholar',
                'description' => 'Scholar participating in programs',
            ],
            [
                'name' => 'builder',
                'description' => 'Builder working on projects',
            ],
            [
                'name' => 'organizer',
                'description' => 'Organizer managing programs and events',
            ],
            [
                'name' => 'partner',
                'description' => 'Partner organization representative',
            ],
            [
                'name' => 'admin',
                'description' => 'Platform administrator with full access',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(
                ['name' => $role['name']],
                ['description' => $role['description']]
            );
        }
    }
}
