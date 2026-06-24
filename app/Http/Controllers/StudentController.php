<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::all();
        return view('students.index', compact('students'));
    }

    public function create()
    {
        return view('students.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|unique:students,student_id',
            'first_name' => 'required',
            'last_name' => 'required',
            'course' => 'required',
            'year_level' => 'required',
        ]);

        Student::create([
            'student_id' => $request->student_id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'course' => $request->course,
            'year_level' => $request->year_level,

            // Auto-generate barcode
            'barcode' => $request->student_id,
        ]);

        return redirect()->route('students.index')
            ->with('success', 'Student added successfully!');
    }
}