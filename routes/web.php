<?php

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

Route::get('/library', function () {
    return Inertia::render('library');
})->name('library');

Route::get('/join', function () {
    return Inertia::render('join');
})->name('join');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::get('/faq', function () {
    return Inertia::render('faq');
})->name('faq');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
