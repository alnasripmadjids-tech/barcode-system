<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\AttendanceLog;
use App\Models\SmsLog;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Bilangin ang totoong estudyante sa Laragon
        $totalStudents = Student::count();
        
        // 2. Bilangin ang attendance ngayong araw
        $sCannerToday = AttendanceLog::whereDate('created_at', Carbon::today())->count();
        
        // 3. Bilangin ang napadalang SMS ngayong araw
        $smsAllertsToday = SmsLog::whereDate('created_at', Carbon::today())
            ->where('status', 'Sent')
            ->count();

        // 4. Ipadala ang totoong mga numero sa iyong Dashboard.jsx
        return Inertia::render('Dashboard', [
            'totalStudents' => $totalStudents,
            'sCannerToday' => $sCannerToday,
            'smsAllertsToday' => $smsAllertsToday,
            'smsGatewayStutatus' => 'Connected'
        ]);
    }
}
