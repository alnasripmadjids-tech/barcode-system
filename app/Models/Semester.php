<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\AcademicYear;

class Semester extends Model
{
    protected $fillable = [
        'academic_year_id',
        'name',
        'is_active',
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}