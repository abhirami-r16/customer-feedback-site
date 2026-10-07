<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminQuestionController;
use App\Http\Controllers\AdminSubmissionController;
use App\Http\Controllers\PublicFeedbackController;

// Auth Routes
Route::post('/admin/login', [AuthController::class, 'login']);

// Public Routes
Route::get('/questions/active', [PublicFeedbackController::class, 'getActiveQuestions']);
Route::post('/feedback', [PublicFeedbackController::class, 'storeFeedback']);

// Protected Admin Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    
    // Questions Management
    Route::get('/admin/questions', [AdminQuestionController::class, 'index']);
    Route::post('/admin/questions', [AdminQuestionController::class, 'store']);
    Route::put('/admin/questions/{id}', [AdminQuestionController::class, 'update']);
    Route::delete('/admin/questions/{id}', [AdminQuestionController::class, 'destroy']);
    
    // Submissions Management
    Route::get('/admin/submissions', [AdminSubmissionController::class, 'index']);
    Route::get('/admin/submissions/{id}', [AdminSubmissionController::class, 'show']);
    Route::put('/admin/submissions/{id}/read', [AdminSubmissionController::class, 'markRead']);
    Route::delete('/admin/submissions/{id}', [AdminSubmissionController::class, 'destroy']);
});
