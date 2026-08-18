<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Section;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'students';

    protected $fillable = [
        'student_id',
        'first_name',
        'middle_name',
        'last_name',
        'address',
        'date_of_birth',
        'contact_number',
        'id_validity',
        'course',
        'year_level',
        'section_id',
        'barcode',
        'parent_contact',
        'parent_name',
    ];

    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}

