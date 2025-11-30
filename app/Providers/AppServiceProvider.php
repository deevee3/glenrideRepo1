<?php

namespace App\Providers;

use App\Services\ActivityLogService;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Log user logins
        Event::listen(Login::class, function (Login $event) {
            /** @var \App\Models\User $user */
            $user = $event->user;

            ActivityLogService::log('logged_in', 'user', $user->id, $user, [
                'guard' => $event->guard,
            ]);

            // Update last login timestamp
            $user->update(['last_login_at' => now()]);
        });

        // Log new user registrations
        Event::listen(Registered::class, function (Registered $event) {
            /** @var \App\Models\User $user */
            $user = $event->user;

            ActivityLogService::log('user_registered', 'user', $user->id, $user, [
                'email' => $user->email,
            ]);
        });
    }
}
