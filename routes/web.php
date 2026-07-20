<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Ang Welcome o Landing page route ng eskwelahan
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// 2. Ang Dashboard route na nagpapadala ng data para sa iyong automation grid ngayon
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'totalStudents' => 1240,
        'sCannerToday' => 342,
        'smsAllertsToday' => 156,
        'smsGatewayStutatus' => 'Connected'
    ]);
})->middleware([])->name('dashboard');

// 3. Ang POST route para sa pangalawang antas (taga-salo ng barcode galing sa frontend)
Route::post('/verify-student', function (\Illuminate\Http\Request $request) {
    $barcode = $request->input('student_barcode');
    \Illuminate\Support\Facades\Log::info("May nag-scan ng Barcode: " . $barcode);
    return back()->with('message', 'Matagumpay na natanggap ang barcode: ' . $barcode);
})->middleware([]);

// 4. Ang profile management area ng system niyo
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 5. In-import ang login at registration mechanics
require __DIR__.'/auth.php';
