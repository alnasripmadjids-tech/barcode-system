<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\ClassSchedule;
use Carbon\Carbon;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    // Show scanner page
    public function index()
    {
        return view('attendance.scan');
    }

    // Handle barcode scan
    public function scan(Request $request)
    {
        $request->validate([
            'barcode' => 'required',
        ]);

        $barcode = trim($request->barcode);

        // 1. Find student using barcode
        $student = Student::where('barcode', $barcode)->first();

        if (!$student) {
            return back()->with(
                'error',
                'Student not found! Scanned: ' . $barcode
            );
        }

        // 2. Check if student has a section
        if (!$student->section_id) {
            return back()->with(
                'error',
                'Student is not assigned to a section.'
            );
        }

        // 3. Get current date and time
        $now = Carbon::now();

        $day = $now->format('D');

        // Convert current day to our schedule format
        $dayMap = [
            'Mon' => 'M',
            'Tue' => 'T',
            'Wed' => 'W',
            'Thu' => 'Th',
            'Fri' => 'F',
            'Sat' => 'Sat',
            'Sun' => 'Sun',
        ];

        $currentDay = $dayMap[$day] ?? $day;

        // 4. Find the student's current class schedule
        $schedule = ClassSchedule::where(
                'section_id',
                $student->section_id
            )
            ->where('is_active', true)
            ->where(function ($query) use ($currentDay) {
                $query->where('day', $currentDay)
                      ->orWhere('day', 'like', "%{$currentDay}%");
            })
            ->whereTime(
                'start_time',
                '<=',
                $now->format('H:i:s')
            )
            ->whereTime(
                'end_time',
                '>=',
                $now->format('H:i:s')
            )
            ->first();

        if (!$schedule) {
            return back()->with(
                'error',
                'No class schedule found for this student at the current time.'
            );
        }

        // 5. Check if already attended this class today
        $alreadyScanned = Attendance::where(
                'student_id',
                $student->student_id
            )
            ->where(
                'class_schedule_id',
                $schedule->id
            )
            ->whereDate(
                'attendance_date',
                $now->toDateString()
            )
            ->first();

        if ($alreadyScanned) {
            return back()->with(
                'error',
                'Student already scanned for this class today.'
            );
        }

        // 6. Save attendance
        Attendance::create([
            'student_id' => $student->student_id,
            'class_schedule_id' => $schedule->id,
            'attendance_date' => $now->toDateString(),
            'time_in' => $now->format('H:i:s'),
            'status' => 'Present',
        ]);

        // 7. Success message
        return back()->with(
            'success',
            $student->first_name . ' ' .
            $student->last_name .
            ' - Time In recorded!'
        );
    }

    // Show Student Attendance Log
    public function log(Request $request)
    {
        $query = Attendance::with([
            'student',
            'classSchedule.section',
            'classSchedule.subject',
            'classSchedule.instructor',
        ]);

        // Search student ID or name
        if ($request->filled('search')) {
            $search = $request->search;

            $query->whereHas('student', function ($q) use ($search) {
                $q->where('student_id', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        // Date filter
        if ($request->filled('date')) {
            $query->whereDate(
                'attendance_date',
                $request->date
            );
        }

        // Section filter
        if (
            $request->filled('section') &&
            $request->section !== 'all'
        ) {
            $query->whereHas('classSchedule', function ($q) use ($request) {
                $q->where(
                    'section_id',
                    $request->section
                );
            });
        }

        // Subject filter
        if (
            $request->filled('subject') &&
            $request->subject !== 'all'
        ) {
            $query->whereHas('classSchedule', function ($q) use ($request) {
                $q->where(
                    'subject_id',
                    $request->subject
                );
            });
        }

        // Get attendance records
        $attendances = $query
            ->latest('attendance_date')
            ->latest('time_in')
            ->get();

        // Summary
        $totalRecords = $attendances->count();

        $presentCount = $attendances
            ->where('status', 'Present')
            ->count();

        $lateCount = $attendances
            ->where('status', 'Late')
            ->count();

        $absentCount = $attendances
            ->where('status', 'Absent')
            ->count();

        return Inertia::render('StudentAttendanceLog', [
            'attendances' => $attendances,

            'summary' => [
                'total' => $totalRecords,
                'present' => $presentCount,
                'late' => $lateCount,
                'absent' => $absentCount,
            ],

            'filters' => [
                'search' => $request->search ?? '',
                'date' => $request->date ?? '',
                'section' => $request->section ?? 'all',
                'subject' => $request->subject ?? 'all',
            ],
        ]);
    }
}

