<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FeedbackSubmission;

class AdminSubmissionController extends Controller
{
    public function index(Request $request)
    {
        $query = FeedbackSubmission::query();

        if ($request->has('search')) {
            // Search is removed because customer details are no longer tracked.
        }

        return response()->json($query->orderBy('submitted_at', 'desc')->get());
    }

    public function show($id)
    {
        $submission = FeedbackSubmission::with('answers.question')->findOrFail($id);
        return response()->json($submission);
    }

    public function markRead($id)
    {
        $submission = FeedbackSubmission::findOrFail($id);
        $submission->update(['is_read' => true]);
        return response()->json($submission);
    }

    public function destroy($id)
    {
        $submission = FeedbackSubmission::findOrFail($id);
        $submission->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function generateToken()
    {
        $token = \Illuminate\Support\Str::random(32);
        $feedbackToken = \App\Models\FeedbackToken::create([
            'token' => $token,
            'status' => 'active'
        ]);

        return response()->json([
            'token' => $token,
            'link' => "https://malefashion.in/Male/feedbackform?v=4&token=" . $token
        ]);
    }
}
