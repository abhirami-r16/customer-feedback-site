<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackToken extends Model
{
    protected $fillable = ['token', 'status', 'submitted_at', 'submission_id'];
}
