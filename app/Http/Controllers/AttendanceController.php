<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    // show scanner page
    public function index()
    {
        return view('attendance.scan');
    }

    // handle scan
    public function scan(Request $request)
    {
        $request->validate([
            'barcode' => 'required'
        ]);

        $barcode = trim($request->barcode);

        // find student by barcode
        $student = Student::where('barcode', $barcode)->first();

        if (!$student) {
            return back()->with('error', 'Student not found! Scanned: ' . $barcode);
        }

        // check if already scanned today (using created_at)
        $alreadyScanned = Attendance::where('student_id', $student->id)
            ->whereDate('created_at', Carbon::today())
            ->first();

        if ($alreadyScanned) {
            return back()->with('error', 'Already scanned today!');
        }

        // save attendance (TIME IN)
        Attendance::create([
            'student_id' => $student->id,
            'barcode' => $student->barcode,
            'time_in' => Carbon::now(),
        ]);

        return back()->with('success',
            $student->first_name . ' ' . $student->last_name . ' Time In recorded!'
        );
    }
}