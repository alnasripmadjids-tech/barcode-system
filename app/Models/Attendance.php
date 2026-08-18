<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'student_id',
        'class_schedule_id',
        'attendance_date',
        'time_in',
        'status',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class);
    }
}