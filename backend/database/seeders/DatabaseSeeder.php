<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\Admin::create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin123'),
        ]);

        $questions = [
            [
                'question' => 'How likely are you to recommend MALE to your friends or family?',
                'question_type' => 'Multiple Choice',
                'options' => json_encode(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
                'is_required' => true,
                'sort_order' => 1,
            ],
            [
                'question' => 'How is the fit and comfort of your purchase?',
                'question_type' => 'Multiple Choice',
                'options' => json_encode(['Excellent', 'Good', 'Average', 'Poor']),
                'is_required' => true,
                'sort_order' => 2,
            ],
            [
                'question' => 'How is the quality of your purchase?',
                'question_type' => 'Multiple Choice',
                'options' => json_encode(['Excellent', 'Good', 'Average', 'Poor']),
                'is_required' => true,
                'sort_order' => 3,
            ],
            [
                'question' => 'How do you feel about the value for money?',
                'question_type' => 'Multiple Choice',
                'options' => json_encode(['Excellent', 'Good', 'Average', 'Poor']),
                'is_required' => true,
                'sort_order' => 4,
            ],
            [
                'question' => 'What would you like MALE to improve?',
                'question_type' => 'Multiple Choice',
                'options' => json_encode(['Product Variety', 'Designs', 'Fit & Sizes', 'Quality', 'Price', 'Customer Service', 'Other']),
                'is_required' => true,
                'sort_order' => 5,
            ]
        ];

        foreach ($questions as $q) {
            \App\Models\FeedbackQuestion::create($q);
        }
    }
}
