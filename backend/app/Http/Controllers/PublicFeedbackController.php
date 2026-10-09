<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FeedbackQuestion;
use App\Models\FeedbackSubmission;
use Illuminate\Support\Facades\DB;

class PublicFeedbackController extends Controller
{
    public function getActiveQuestions()
    {
        return response()->json(FeedbackQuestion::where('is_active', true)->orderBy('sort_order')->get());
    }

    public function validateToken($token)
    {
        $feedbackToken = \App\Models\FeedbackToken::where('token', $token)->first();
        if (!$feedbackToken) {
            return response()->json(['message' => 'Invalid token'], 404);
        }
        if ($feedbackToken->status !== 'active') {
            return response()->json(['message' => 'This feedback link has expired. Thank you for your feedback!'], 400);
        }
        return response()->json(['message' => 'Valid token']);
    }

    public function storeFeedback(Request $request)
    {
        $validated = $request->validate([
            'token' => 'nullable|string',
            'wants_contact' => 'nullable|string',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:feedback_questions,id',
            'answers.*.question_text' => 'required|string',
            'answers.*.answer' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $tokenRecord = null;
            if (!empty($validated['token'])) {
                $tokenRecord = \App\Models\FeedbackToken::where('token', $validated['token'])->lockForUpdate()->first();
                if (!$tokenRecord || $tokenRecord->status !== 'active') {
                    DB::rollBack();
                    return response()->json(['message' => 'This feedback link has expired. Thank you for your feedback!'], 400);
                }
            }

            $overallRating = null;
            $questions = FeedbackQuestion::all()->keyBy('id');
            foreach ($validated['answers'] as $ans) {
                if (isset($questions[$ans['question_id']])) {
                    $q = $questions[$ans['question_id']];
                    // Map 0-10 scale to 1-5 stars for overall rating
                    if (str_contains(strtolower($q->question), 'recommend') && is_numeric($ans['answer'])) {
                        $val = (int)$ans['answer'];
                        $mapped = (int)ceil($val / 2);
                        $overallRating = $mapped < 1 ? 1 : $mapped;
                    }
                }
            }

            $submission = FeedbackSubmission::create([
                'wants_contact' => $validated['wants_contact'] ?? 'No',
                'customer_name' => $validated['customer_name'] ?? null,
                'customer_phone' => $validated['customer_phone'] ?? null,
                'overall_rating' => $overallRating,
            ]);

            foreach ($validated['answers'] as $ans) {
                $submission->answers()->create($ans);
            }

            if ($tokenRecord) {
                $tokenRecord->update([
                    'status' => 'used',
                    'submitted_at' => now(),
                    'submission_id' => $submission->id
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Feedback submitted successfully'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to submit feedback', 'error' => $e->getMessage()], 500);
        }
    }
}
