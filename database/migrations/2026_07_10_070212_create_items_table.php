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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('barcode_code')->unique();       // Code mula sa barcode scanner
            $table->string('name');                         // Pangalan ng libro o equipment
            $table->string('category');                     // Halimbawa: Book, Lab Tool, IT Equipment
            $table->string('location')->nullable();         // Halimbawa: Library, Science Lab, Room 101
            $table->string('status')->default('Available'); // Halimbawa: Available, Borrowed, Damaged
            $table->text('description')->nullable();        // Karagdagang detalye o remarks
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
