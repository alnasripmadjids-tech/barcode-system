<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user(),
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'student' => fn () => $request->session()->get('student'),
                'real_student_id' => fn () => $request->session()->get('real_student_id'),
                'attendanceRecorded' => fn () => $request->session()->get('attendanceRecorded', false),
                'smsSent' => fn () => $request->session()->get('smsSent', false),
                'alreadyScanned' => fn () => $request->session()->get('alreadyScanned', false),
            ],
        ];
    }
}
