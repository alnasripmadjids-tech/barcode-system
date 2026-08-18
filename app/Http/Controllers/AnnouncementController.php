<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Student;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::with('creator')
            ->latest()
            ->get();

        $students = Student::query()
            ->select(
                'id',
                'first_name',
                'middle_name',
                'last_name',
                'parent_contact'
            )
            ->whereNotNull('parent_contact')
            ->where('parent_contact', '!=', '')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'students' => $students,
        ]);
    }
}

