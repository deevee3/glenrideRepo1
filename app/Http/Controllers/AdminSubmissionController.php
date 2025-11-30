<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\JoinRequest;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSubmissionController extends Controller
{
    public function index(Request $request): Response
    {
        // Ensure user is admin
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $subscribers = Subscriber::query()
            ->orderByDesc('created_at')
            ->paginate(10, ['*'], 'subscribers_page');

        $contactMessages = ContactMessage::query()
            ->orderByDesc('created_at')
            ->paginate(10, ['*'], 'contact_page');

        $joinRequests = JoinRequest::query()
            ->orderByDesc('created_at')
            ->paginate(10, ['*'], 'join_page');

        return Inertia::render('admin/submissions/index', [
            'subscribers' => $subscribers,
            'contactMessages' => $contactMessages,
            'joinRequests' => $joinRequests,
        ]);
    }

    public function updateContactMessage(Request $request, ContactMessage $contactMessage)
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|in:new,in_review,responded,archived',
        ]);

        $contactMessage->update($validated);

        return back()->with('success', 'Contact message status updated.');
    }

    public function updateJoinRequest(Request $request, JoinRequest $joinRequest)
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|in:new,in_review,responded,converted_to_user',
        ]);

        $joinRequest->update($validated);

        return back()->with('success', 'Join request status updated.');
    }
    
    public function updateSubscriber(Request $request, Subscriber $subscriber)
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|in:active,unsubscribed',
        ]);

        $subscriber->update($validated);

        return back()->with('success', 'Subscriber status updated.');
    }
}
