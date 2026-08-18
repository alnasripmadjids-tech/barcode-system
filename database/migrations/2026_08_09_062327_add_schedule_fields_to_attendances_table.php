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
        Schema::table('attendances', function (Blueprint $table) {
            $table->foreignId('class_schedule_id')
                ->nullable()
                ->after('student_id')
                ->constrained('class_schedules')
                ->nullOnDelete();

            $table->date('attendance_date')
                ->nullable()
                ->after('class_schedule_id');

            $table->time('time_in')
                ->nullable()
                ->after('attendance_date');

            $table->string('status')
                ->default('Present')
                ->after('time_in');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['class_schedule_id']);
            $table->dropColumn([
                'class_schedule_id',
                'attendance_date',
                'time_in',
                'status',
            ]);
        });
    }
};