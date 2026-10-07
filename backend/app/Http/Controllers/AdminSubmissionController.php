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
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%");
            });
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
}
