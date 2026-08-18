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
        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->string('student_id');   // 🌟 IDINAGDAG: Dito isusulat kung kanino ang ID na nag-scan
            $table->string('phone_number'); // 🌟 IDINAGDAG: Cellphone number ng magulang
            $table->text('message');         // 🌟 IDINAGDAG: Ang eksaktong text alert na ipinadala
            $table->string('status');       // 🌟 IDINAGDAG: 'Sent' o 'Simulation' ang lagay
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_logs');
    }
};
