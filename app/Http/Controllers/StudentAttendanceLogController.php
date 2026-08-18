<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Inertia\Inertia;

class StudentAttendanceLogController extends Controller
{
    public function index(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | ATTENDANCE RECORDS
        |--------------------------------------------------------------------------
        | Attendance is now based directly on the registered student.
        | No subject, section, instructor, or class schedule is required.
        */

        $query = Attendance::with([
            'student',
        ]);

        /*
        |--------------------------------------------------------------------------
        | SEARCH STUDENT
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->whereHas('student', function ($studentQuery) use ($search) {
                $studentQuery->where(function ($q) use ($search) {
                    $q->where('student_id', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                });
            });
        }

        /*
        |--------------------------------------------------------------------------
        | FILTER BY DATE
        |--------------------------------------------------------------------------
        */

        if ($request->filled('date')) {
            $query->whereDate(
                'attendance_date',
                $request->date
            );
        }

        /*
        |--------------------------------------------------------------------------
        | GET ATTENDANCE RECORDS
        |--------------------------------------------------------------------------
        */

        $attendances = $query
            ->latest('attendance_date')
            ->latest('time_in')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | SUMMARY
        |--------------------------------------------------------------------------
        */

        $summary = [
            'total' => $attendances->count(),

            'present' => $attendances
                ->where('status', 'Present')
                ->count(),

            'late' => $attendances
                ->where('status', 'Late')
                ->count(),

            'absent' => $attendances
                ->where('status', 'Absent')
                ->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | SEND DATA TO REACT
        |--------------------------------------------------------------------------
        */

        return Inertia::render('StudentAttendanceLog', [
            'attendances' => $attendances,

            'filters' => [
                'search' => $request->search ?? '',
                'date' => $request->date ?? '',
            ],

            'summary' => $summary,
        ]);
    }
}