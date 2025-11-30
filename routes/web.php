<?php

use App\Http\Controllers\CommunityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicFormController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Public pages
Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/pillars', function () {
    return Inertia::render('pillars');
})->name('pillars');

Route::get('/manifesto', function () {
    return Inertia::render('manifesto');
})->name('manifesto');

Route::get('/library', [\App\Http\Controllers\PublicLibraryController::class, 'index'])->name('library.public');

Route::get('/join', function () {
    return Inertia::render('join');
})->name('join');
Route::post('/join', [PublicFormController::class, 'storeJoinRequest'])->name('join.store');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');
Route::post('/contact', [PublicFormController::class, 'storeContact'])->name('contact.store');

Route::get('/faq', function () {
    return Inertia::render('faq');
})->name('faq');

Route::get('/future', function () {
    return Inertia::render('future');
})->name('future');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Programs
    Route::prefix('programs')->name('programs.')->group(function () {
        Route::get('/', [ProgramController::class, 'index'])->name('index');
        Route::get('/create', [ProgramController::class, 'create'])->name('create')->can('create', \App\Models\Program::class);
        Route::post('/', [ProgramController::class, 'store'])->name('store')->can('create', \App\Models\Program::class);
        Route::get('/{program:slug}', [ProgramController::class, 'show'])->name('show');
        Route::get('/{program:slug}/edit', [ProgramController::class, 'edit'])->name('edit')->can('update', 'program');
        Route::patch('/{program}', [ProgramController::class, 'update'])->name('update')->can('update', 'program');
        Route::post('/{program}/apply', [ProgramController::class, 'apply'])->name('apply');
    });

    // Projects
    Route::prefix('projects')->name('projects.')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::post('/', [ProjectController::class, 'store'])->name('store');
        Route::get('/{project:slug}', [ProjectController::class, 'show'])->name('show');
        Route::patch('/{project}', [ProjectController::class, 'update'])->name('update');
        Route::post('/{project}/tasks', [ProjectController::class, 'storeTask'])->name('tasks.store');
        Route::patch('/{project}/tasks/{task}', [ProjectController::class, 'updateTask'])->name('tasks.update');
        Route::delete('/{project}/tasks/{task}', [ProjectController::class, 'destroyTask'])->name('tasks.destroy');
    });

    // Community
    Route::prefix('community')->name('community.')->group(function () {
        Route::get('/', [CommunityController::class, 'index'])->name('index');
        Route::get('/people', [CommunityController::class, 'people'])->name('people');
        Route::get('/channels/{channel:name}', [CommunityController::class, 'showChannel'])->name('channels.show');
        Route::post('/posts', [CommunityController::class, 'storePost'])->name('posts.store');
        Route::patch('/posts/{post}', [CommunityController::class, 'updatePost'])->name('posts.update');
        Route::delete('/posts/{post}', [CommunityController::class, 'destroyPost'])->name('posts.destroy');
        Route::post('/posts/{post}/reactions', [CommunityController::class, 'toggleReaction'])->name('posts.reactions.toggle');
    });

    // Events
    Route::prefix('events')->name('events.')->group(function () {
        Route::get('/', [EventController::class, 'index'])->name('index');
        Route::get('/create', [EventController::class, 'create'])->name('create')->can('create', \App\Models\Event::class);
        Route::post('/', [EventController::class, 'store'])->name('store')->can('create', \App\Models\Event::class);
        Route::get('/{event}', [EventController::class, 'show'])->name('show');
        Route::get('/{event}/edit', [EventController::class, 'edit'])->name('edit')->can('update', 'event');
        Route::patch('/{event}', [EventController::class, 'update'])->name('update')->can('update', 'event');
        Route::delete('/{event}', [EventController::class, 'destroy'])->name('destroy')->can('delete', 'event');
        Route::post('/{event}/register', [EventController::class, 'register'])->name('register');
        Route::delete('/{event}/register', [EventController::class, 'cancelRegistration'])->name('register.cancel');
    });

    // Library (authenticated)
    Route::prefix('library')->name('library.')->group(function () {
        Route::get('/browse', [LibraryController::class, 'index'])->name('index');
        Route::get('/create', [LibraryController::class, 'create'])->name('create')->can('create', \App\Models\LibraryItem::class);
        Route::post('/', [LibraryController::class, 'store'])->name('store')->can('create', \App\Models\LibraryItem::class);
        Route::get('/items/{item:slug}', [LibraryController::class, 'show'])->name('show');
        Route::get('/items/{item:slug}/edit', [LibraryController::class, 'edit'])->name('edit')->can('update', 'item');
        Route::patch('/items/{item}', [LibraryController::class, 'update'])->name('update')->can('update', 'item');
        Route::delete('/items/{item}', [LibraryController::class, 'destroy'])->name('destroy')->can('delete', 'item');
    });

    // User Profile (public profiles and interests/skills editing)
    Route::get('/profile/interests', [ProfileController::class, 'edit'])->name('user-profile.edit');
    Route::patch('/profile/interests', [ProfileController::class, 'update'])->name('user-profile.update');
    Route::get('/members/{user}', [ProfileController::class, 'show'])->name('members.show');

    // Notifications
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::patch('/{notification}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
    });

    // Admin Submissions
    Route::prefix('admin/submissions')->name('admin.submissions.')->group(function () {
        Route::get('/', [\App\Http\Controllers\AdminSubmissionController::class, 'index'])->name('index');
        Route::patch('/contact/{contactMessage}', [\App\Http\Controllers\AdminSubmissionController::class, 'updateContactMessage'])->name('contact.update');
        Route::patch('/join/{joinRequest}', [\App\Http\Controllers\AdminSubmissionController::class, 'updateJoinRequest'])->name('join.update');
        Route::patch('/subscriber/{subscriber}', [\App\Http\Controllers\AdminSubmissionController::class, 'updateSubscriber'])->name('subscriber.update');
    });

    // Admin Activity Log
    Route::prefix('admin/activity')->name('admin.activity.')->group(function () {
        Route::get('/', [\App\Http\Controllers\AdminActivityController::class, 'index'])->name('index');
        Route::get('/user/{user}', [\App\Http\Controllers\AdminActivityController::class, 'userActivity'])->name('user');
    });
});

require __DIR__.'/settings.php';

Route::get('/library/{item:slug}', [\App\Http\Controllers\PublicLibraryController::class, 'show'])->name('library.public.show');
