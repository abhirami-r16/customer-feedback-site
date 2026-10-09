<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('feedback_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('token')->unique();
            $table->enum('status', ['active', 'used', 'expired'])->default('active');
            $table->timestamp('submitted_at')->nullable();
            $table->unsignedBigInteger('submission_id')->nullable();
            $table->timestamps();
            
            $table->foreign('submission_id')->references('id')->on('feedback_submissions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedback_tokens');
    }
};
