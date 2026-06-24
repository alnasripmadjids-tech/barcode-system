<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\GradeController;

/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return view('index');
});

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
Route::get('/login', function () {
    return view('login');
});

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    return view('dashboard');
});

/*
|--------------------------------------------------------------------------
| STUDENTS MODULE
|--------------------------------------------------------------------------
*/
Route::get('/students', [StudentController::class, 'index'])
    ->name('students.index');

Route::get('/students/create', [StudentController::class, 'create'])
    ->name('students.create');

Route::post('/students/store', [StudentController::class, 'store'])
    ->name('students.store');

/*
|--------------------------------------------------------------------------
| ATTENDANCE MODULE
|--------------------------------------------------------------------------
*/
Route::get('/attendance', [AttendanceController::class, 'index'])
    ->name('attendance.index');

Route::get('/attendance/scan', function () {
    return view('attendance.scan');
})->name('attendance.scan.page');

Route::post('/attendance/scan', [AttendanceController::class, 'scan'])
    ->name('attendance.scan');

/*
|--------------------------------------------------------------------------
| GRADE REPORT MODULE
|--------------------------------------------------------------------------
*/
Route::get('/grades', [GradeController::class, 'index'])
    ->name('grades.index');