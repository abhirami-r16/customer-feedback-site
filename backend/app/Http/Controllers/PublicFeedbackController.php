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

    public function storeFeedback(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:feedback_questions,id',
            'answers.*.question_text' => 'required|string',
            'answers.*.answer' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
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
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'overall_rating' => $overallRating,
            ]);

            foreach ($validated['answers'] as $ans) {
                $submission->answers()->create($ans);
            }

            DB::commit();

            return response()->json(['message' => 'Feedback submitted successfully'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to submit feedback', 'error' => $e->getMessage()], 500);
        }
    }
}
