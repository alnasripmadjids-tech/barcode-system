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
        Schema::table('sms_logs', function (Blueprint $table) {
            $table->string('student_id')
                ->nullable()
                ->change();

            $table->foreignId('announcement_id')
                ->nullable()
                ->after('student_id')
                ->constrained('announcements')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sms_logs', function (Blueprint $table) {
            $table->dropForeign(['announcement_id']);
            $table->dropColumn('announcement_id');

            $table->string('student_id')
                ->nullable(false)
                ->change();
        });
    }
};

