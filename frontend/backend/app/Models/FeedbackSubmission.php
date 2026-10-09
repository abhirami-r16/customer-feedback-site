<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackSubmission extends Model
{
    protected $fillable = [
        'customer_name',
        'customer_email',
        'customer_phone',
        'overall_rating',
        'is_read',
        'submitted_at',
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
