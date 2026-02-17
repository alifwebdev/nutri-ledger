<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->decimal('amount', 10, 2);
            $table->string('category')->default('other');
            $table->text('notes')->nullable();
            $table->date('spent_at');
            $table->timestamps();

            $table->index(['user_id', 'spent_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};