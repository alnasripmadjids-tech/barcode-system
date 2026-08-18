<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentScannerController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\StudentAttendanceLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\SmsLog;
use App\Services\HuaweiSmsService;
use App\Http\Controllers\UserManagementController;


// 1. Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


// 2. Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'totalStudents' => Student::count(),

        'students' => Student::all(),

        'sCannerToday' => Attendance::whereDate(
            'created_at',
            today()
        )->count(),

        'smsAllertsToday' => SmsLog::whereDate(
            'created_at',
            today()
        )->count(),

        'smsGatewayStutatus' => 'Connected',

        'flash' => [
            'success' => null,
            'error' => null,
            'student' => null,
            'real_student_id' => null,
            'attendanceRecorded' => false,
            'smsSent' => false,
        ],
    ]);
})->middleware(['web', 'auth'])->name('dashboard');


// 3. STUDENT LIST
Route::get('/studentlist', [
    StudentController::class,
    'index'
])->middleware(['web', 'auth'])->name('studentlist');


Route::post('/studentlist', [
    StudentController::class,
    'store'
])->middleware(['web', 'auth'])->name('studentlist.store');


// ARCHIVED STUDENTS
Route::get('/studentlist/archived', [
    StudentController::class,
    'archived'
])->middleware(['web', 'auth'])->name('students.archived');


// DELETE / ARCHIVE STUDENT
Route::delete('/studentlist/{student}', [
    StudentController::class,
    'destroy'
])->middleware(['web', 'auth'])->name('studentlist.destroy');


// RESTORE ARCHIVED STUDENT
Route::patch('/studentlist/{id}/restore', [
    StudentController::class,
    'restore'
])->middleware(['web', 'auth'])->name('students.restore');


// 4. BARCODE / STUDENT VERIFICATION
Route::post(
    '/verify-student',
    [StudentScannerController::class, 'scan']
)->middleware(['web', 'auth']);


// 5. STUDENT ATTENDANCE LOG
Route::get('/student-attendance', [
    StudentAttendanceLogController::class,
    'index'
])->middleware(['web', 'auth'])->name('student.attendance');


// 6. Profile
Route::middleware('auth')->group(function () {

    Route::get('/announcements', [
        AnnouncementController::class,
        'index'
    ])->name('announcements.index');


    Route::get('/profile', [
        ProfileController::class,
        'edit'
    ])->name('profile.edit');


    Route::patch('/profile', [
        ProfileController::class,
        'update'
    ])->name('profile.update');


    Route::delete('/profile', [
        ProfileController::class,
        'destroy'
    ])->name('profile.destroy');
});


Route::get('/sms-test', function (HuaweiSmsService $sms) {
    return $sms->testConnection();
})->middleware(['web', 'auth']);

// 7. USER MANAGEMENT
Route::middleware(['web', 'auth', 'admin'])->group(function () {

    Route::get('/user', [
        UserManagementController::class,
        'index'
    ])->name('user.management');

    Route::post('/user', [
        UserManagementController::class,
        'store'
    ])->name('user.store');

    Route::put('/user/{user}', [
        UserManagementController::class,
        'update'
    ])->name('user.update');

    Route::delete('/user/{user}', [
        UserManagementController::class,
        'destroy'
    ])->name('user.destroy');

});
require __DIR__ . '/auth.php';