<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackSubmission extends Model
{
    protected $fillable = [
        'overall_rating',
        'is_read',
        'submitted_at',
        'wants_contact',
        'customer_name',
        'customer_phone',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'submitted_at' => 'datetime',
    ];

    public function answers()
    {
        return $this->hasMany(FeedbackAnswer::class);
    }
}
