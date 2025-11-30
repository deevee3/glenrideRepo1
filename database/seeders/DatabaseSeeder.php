<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Test users with different roles.
     * All passwords are: password
     *
     * @var array<array{email: string, first_name: string, last_name: string, roles: array<string>}>
     */
    protected array $testUsers = [
        [
            'email' => 'admin@glenride.com',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'roles' => ['admin'],
        ],
        [
            'email' => 'organizer@glenride.com',
            'first_name' => 'Olivia',
            'last_name' => 'Organizer',
            'roles' => ['organizer', 'member'],
        ],
        [
            'email' => 'partner@glenride.com',
            'first_name' => 'Patrick',
            'last_name' => 'Partner',
            'roles' => ['partner'],
        ],
        [
            'email' => 'scholar@glenride.com',
            'first_name' => 'Sarah',
            'last_name' => 'Scholar',
            'roles' => ['scholar', 'member'],
        ],
        [
            'email' => 'builder@glenride.com',
            'first_name' => 'Brian',
            'last_name' => 'Builder',
            'roles' => ['builder', 'member'],
        ],
        [
            'email' => 'member@glenride.com',
            'first_name' => 'Maya',
            'last_name' => 'Member',
            'roles' => ['member'],
        ],
    ];

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed reference data first
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class, // Must run after RoleSeeder
            PillarSeeder::class,
            ThemeSeeder::class,
            SkillSeeder::class,
            ChannelSeeder::class,
        ]);

        // Create test users with their respective roles
        $this->createTestUsers();
    }

    /**
     * Create test users with assigned roles.
     */
    protected function createTestUsers(): void
    {
        foreach ($this->testUsers as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'first_name' => $userData['first_name'],
                    'last_name' => $userData['last_name'],
                    'password' => 'password',
                    'email_verified_at' => now(),
                    'status' => 'active',
                ]
            );

            // Attach roles
            foreach ($userData['roles'] as $roleName) {
                $role = Role::where('name', $roleName)->first();
                if ($role && ! $user->roles()->where('role_id', $role->id)->exists()) {
                    $user->roles()->attach($role->id);
                }
            }
        }
    }
}
