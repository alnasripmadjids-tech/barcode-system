<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'student_id',
        'date',
        'time_in'
        'time_out'
    ];
    public fuction student()
    {
  return $this->belongsTo(Student::class);
  }      
}