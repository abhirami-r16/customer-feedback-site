<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackAnswer extends Model
{
    protected $fillable = [
        'feedback_submission_id',
        'question_id',
        'question_text',
        'answer',
    ];

    public function submission()
    {
        return $this->belongsTo(FeedbackSubmission::class, 'feedback_submission_id');
    }

    public function question()
    {
        return $this->belongsTo(FeedbackQuestion::class, 'question_id');
    }
}
