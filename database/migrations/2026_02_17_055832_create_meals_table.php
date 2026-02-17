<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('type', ['breakfast', 'lunch', 'dinner', 'snack']);
            $table->text('notes')->nullable();
            $table->decimal('calories', 8, 2)->nullable();
            $table->date('eaten_at');
            $table->timestamps();

            $table->index(['user_id', 'eaten_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};