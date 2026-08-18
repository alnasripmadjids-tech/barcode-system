<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Instructor;

class ClassSchedule extends Model
{
    protected $fillable = [
        'academic_year_id',
        'semester_id',
        'section_id',
        'subject_id',
        'instructor_id',
        'day',
        'start_time',
        'end_time',
        'room',
        'is_active',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }
}