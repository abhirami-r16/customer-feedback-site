<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FeedbackQuestion;

class AdminQuestionController extends Controller
{
    public function index()
    {
        return response()->json(FeedbackQuestion::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'question_type' => 'required|string',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $question = FeedbackQuestion::create($validated);
        return response()->json($question, 201);
    }

    public function update(Request $request, $id)
    {
        $question = FeedbackQuestion::findOrFail($id);

        $validated = $request->validate([
            'question' => 'string',
            'question_type' => 'string',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $question->update($validated);
        return response()->json($question);
    }

    public function destroy($id)
    {
        FeedbackQuestion::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
