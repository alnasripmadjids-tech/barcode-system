<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Attendance;
use Inertia\Inertia;

class BarcodeAttendanceController extends Controller
{
    // Ipakita ang scanner dashboard page
    public function index()
    {
        // Kukuha ng huling 10 na pumasok ngayon na may kasamang detalye ng estudyante
        $recentLogs = Attendance::with('student')->latest()->take(10)->get();
        return Inertia::render('BarcodeScanner', [
            'recentLogs' => $recentLogs
        ]);
    }

    // Saluhin ang barcode kapag ini-scan
    public function scan(Request $request)
    {
        $request->validate([
            'barcode' => 'required|string'
        ]);

        // Hanapin ang estudyante gamit ang barcode number (o student_id field mo)
        $student = Student::where('student_id', $request->barcode)->first();

        if (!$student) {
            return back()->with('error', 'Hindi mahanap ang Student Barcode ID na ito.');
        }

        // I-save sa attendance table ang pagpasok (walang presyo, oras at id lang)
        Attendance::create([
            'student_id' => $student->id,
            'status' => 'Present',
            'scanned_at' => now()
        ]);

        return back()->with('success', 'Matagumpay na na-scan si ' . $student->name);
    }
}
