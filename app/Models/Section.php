<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Course;

class Section extends Model
{
    protected $fillable = [
        'course_id',
        'name',
        'year_level',
        'is_active',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}