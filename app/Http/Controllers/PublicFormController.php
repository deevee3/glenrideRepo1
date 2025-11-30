<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\JoinRequest;
use App\Models\Subscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class PublicFormController extends Controller
{
    public function storeContact(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        ContactMessage::create($validated);

        return Redirect::back()->with('success', 'Thank you for your message. We will get back to you soon.');
    }

    public function storeSubscriber(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255|unique:subscribers,email',
        ]);

        Subscriber::create($validated);

        return Redirect::back()->with('success', 'Thank you for subscribing!');
    }

    public function storeJoinRequest(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'self_description' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'current_work' => 'nullable|string',
            'collaboration_idea' => 'nullable|string',
        ]);

        JoinRequest::create($validated);

        return Redirect::back()->with('success', 'Thank you for your interest. We will be in touch soon.');
    }
}
