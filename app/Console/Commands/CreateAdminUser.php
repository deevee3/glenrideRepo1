<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin-user
                            {--email= : The email address for the admin user}
                            {--password= : The password (will be generated if not provided)}
                            {--seed-roles : Also seed the roles table if empty}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an admin user for the platform';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Check if roles exist, seed them if requested or if empty
        $adminRole = Role::where('name', 'admin')->first();

        if (! $adminRole) {
            if ($this->option('seed-roles') || $this->confirm('No roles found. Would you like to seed them now?', true)) {
                $this->info('Seeding roles...');
                $this->call('db:seed', ['--class' => 'RoleSeeder']);
                $this->call('db:seed', ['--class' => 'PermissionSeeder']);
                $adminRole = Role::where('name', 'admin')->first();
            } else {
                $this->error('Cannot create admin user without roles. Please seed the database first.');

                return self::FAILURE;
            }
        }

        // Get or generate credentials
        $email = $this->option('email') ?? $this->ask('Enter admin email', 'admin@glenride.org');
        $password = $this->option('password') ?? Str::random(16);

        // Check if user already exists
        $existingUser = User::where('email', $email)->first();
        if ($existingUser) {
            if ($existingUser->hasRole('admin')) {
                $this->warn("User {$email} already exists and is already an admin.");

                return self::SUCCESS;
            }

            if ($this->confirm("User {$email} already exists. Add admin role?", true)) {
                $existingUser->roles()->syncWithoutDetaching([$adminRole->id]);
                $this->info("Admin role added to {$email}");

                return self::SUCCESS;
            }

            return self::FAILURE;
        }

        // Create the admin user
        $user = User::create([
            'email' => $email,
            'first_name' => 'Admin',
            'last_name' => 'User',
            'password' => $password,
            'email_verified_at' => now(),
            'status' => 'active',
        ]);

        $user->roles()->attach($adminRole->id);

        $this->newLine();
        $this->info('✅ Admin user created successfully!');
        $this->newLine();
        $this->table(['Field', 'Value'], [
            ['Email', $email],
            ['Password', $password],
        ]);
        $this->newLine();
        $this->warn('⚠️  Save this password now - it cannot be retrieved later!');

        return self::SUCCESS;
    }
}
