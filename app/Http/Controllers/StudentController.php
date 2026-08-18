<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Inertia\Inertia;

class StudentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | STUDENT LIST
    |--------------------------------------------------------------------------
    |
    | Displays active students only.
    |
    | Because the Student model uses SoftDeletes, students with a
    | deleted_at value are automatically excluded from this query.
    |
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $students = Student::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('student_id', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('course', 'like', "%{$search}%")
                        ->orWhere('year_level', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%");
                });
            })
            ->get();

        return Inertia::render('StudentList', [
            'students' => $students,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE STUDENT PAGE
    |--------------------------------------------------------------------------
    */

    public function create()
    {
        return Inertia::render('StudentCreate');
    }

    /*
    |--------------------------------------------------------------------------
    | STORE NEW STUDENT
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Normalize Student ID
        |--------------------------------------------------------------------------
        |
        | Manual input:
        |
        | 23-0050
        |
        | Becomes:
        |
        | SCHOOL: ID 23-0050
        |
        |--------------------------------------------------------------------------
        */

        $studentId = trim($request->student_id);

        if (!str_starts_with(strtoupper($studentId), 'SCHOOL: ID ')) {
            $studentId = 'SCHOOL: ID ' . $studentId;
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Student
        |--------------------------------------------------------------------------
        */

        $request->merge([
            'student_id' => $studentId,
        ]);

        $request->validate([
            'student_id' => 'required|unique:students,student_id',
            'first_name' => 'required',
            'middle_name' => 'nullable',
            'last_name' => 'required',
            'course' => 'required',
            'year_level' => 'required',
            'address' => 'nullable',
            'date_of_birth' => 'nullable|date',
            'contact_number' => 'nullable|string|max:20',
            'id_validity' => 'nullable|date',
        ]);

        /*
        |--------------------------------------------------------------------------
        | SAVE STUDENT
        |--------------------------------------------------------------------------
        */

        Student::create([
            'student_id' => $studentId,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'course' => $request->course,
            'year_level' => $request->year_level,
            'address' => $request->address,
            'date_of_birth' => $request->date_of_birth,
            'contact_number' => $request->contact_number,
            'id_validity' => $request->id_validity,

            // Barcode value matches the actual scanner output
            'barcode' => $studentId,
        ]);

        return redirect()
            ->route('studentlist')
            ->with('success', 'Student added successfully!');
    }

    /*
    |--------------------------------------------------------------------------
    | ARCHIVE / SOFT DELETE STUDENT
    |--------------------------------------------------------------------------
    |
    | This does NOT permanently delete the student.
    |
    | Laravel's SoftDeletes changes the deleted_at column instead.
    |
    |--------------------------------------------------------------------------
    */

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()
            ->route('studentlist')
            ->with('success', 'Student archived successfully.');
    }

    /*
    |--------------------------------------------------------------------------
    | VIEW ARCHIVED STUDENTS
    |--------------------------------------------------------------------------
    */

    public function archived()
    {
        $students = Student::onlyTrashed()
            ->orderByDesc('deleted_at')
            ->get();

        return Inertia::render('ArchivedStudents', [
            'students' => $students,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | RESTORE ARCHIVED STUDENT
    |--------------------------------------------------------------------------
    */

    public function restore($id)
    {
        $student = Student::onlyTrashed()
            ->findOrFail($id);

        $student->restore();

        return redirect()
            ->route('students.archived')
            ->with('success', 'Student restored successfully.');
    }
}