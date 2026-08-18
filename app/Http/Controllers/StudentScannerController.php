<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\ClassSchedule;
use App\Models\SmsLog;
use App\Models\Student;
use App\Services\HuaweiSmsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentScannerController extends Controller
{
    public function scan(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | VALIDATE SCANNER INPUT
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'student_barcode' => [
                'required',
                'string',
                'max:255',
            ],
        ]);

        $rawScannedValue = trim(
            (string) $validated['student_barcode']
        );

        if ($rawScannedValue === '') {
            return $this->dashboardResponse([
                'scanError' =>
                    'Please enter or scan a valid Student ID.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | EXTRACT STUDENT ID
        |--------------------------------------------------------------------------
        */

        $studentId = $this->extractStudentId(
            $rawScannedValue
        );

        if ($studentId === '') {
            return $this->dashboardResponse([
                'scanError' =>
                    'Invalid barcode.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | FIND STUDENT
        |--------------------------------------------------------------------------
        */

        $fullStudentId =
            'SCHOOL: ID ' . $studentId;

        $student = Student::query()
            ->where(function ($query) use (
                $rawScannedValue,
                $studentId,
                $fullStudentId
            ) {
                $query
                    ->where(
                        'barcode',
                        $rawScannedValue
                    )
                    ->orWhere(
                        'student_id',
                        $rawScannedValue
                    )
                    ->orWhere(
                        'barcode',
                        $studentId
                    )
                    ->orWhere(
                        'student_id',
                        $studentId
                    )
                    ->orWhere(
                        'barcode',
                        $fullStudentId
                    )
                    ->orWhere(
                        'student_id',
                        $fullStudentId
                    );
            })
            ->with('section')
            ->first();

        /*
        |--------------------------------------------------------------------------
        | STUDENT NOT FOUND
        |--------------------------------------------------------------------------
        */

        if (!$student) {

            Log::warning(
                'Student barcode lookup failed.',
                [
                    'scanned_value' =>
                        $rawScannedValue,
                ]
            );

            return $this->dashboardResponse([
                'scanError' =>
                    'No student record was found for the scanned barcode.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | STUDENT INFORMATION
        |--------------------------------------------------------------------------
        */

        $studentName = trim(
            ($student->first_name ?? '') . ' ' .
            ($student->middle_name ?? '') . ' ' .
            ($student->last_name ?? '')
        );

        if ($studentName === '') {
            $studentName = trim(
                (string) (
                    $student->name ?? ''
                )
            );
        }

        $course = (string) (
            $student->course
            ?? $student->program
            ?? ''
        );

        $yearLevel = (string) (
            $student->year_level
            ?? $student->year
            ?? ''
        );

        $sectionName = (string) (
            $student->section?->name
            ?? ''
        );

        $scannedStudent = [
            'id' =>
                (string) $student->student_id,

            'student_id' =>
                (string) $student->student_id,

            'barcode' =>
                (string) (
                    $student->barcode ?? ''
                ),

            'name' =>
                $studentName,

            'course' =>
                $course,

            'year_level' =>
                $yearLevel,

            'section' =>
                $sectionName,
        ];

        /*
        |--------------------------------------------------------------------------
        | CHECK SECTION
        |--------------------------------------------------------------------------
        |
        | A section is useful for finding the student's schedule.
        | It is NOT required for recording attendance.
        |--------------------------------------------------------------------------
        */

        /*
        |--------------------------------------------------------------------------
        | FIND CURRENT CLASS SCHEDULE - OPTIONAL
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        |
        | Attendance does NOT require an active class schedule.
        |
        | If a matching schedule exists, it is attached to the attendance.
        |
        | If no matching schedule exists, attendance is still recorded
        | with class_schedule_id = NULL.
        |--------------------------------------------------------------------------
        */

        $now = Carbon::now();

        $currentDay =
            strtoupper(
                $now->format('D')
            );

        $currentTime =
            $now->format('H:i:s');

        $classSchedule = null;

        if ($student->section_id) {

            $classSchedules = ClassSchedule::query()
                ->where(
                    'section_id',
                    $student->section_id
                )
                ->where(
                    'is_active',
                    true
                )
                ->with([
                    'academicYear',
                    'semester',
                    'section',
                    'subject',
                    'instructor',
                ])
                ->get();

            $classSchedule = $classSchedules->first(
                function ($schedule) use (
                    $currentDay,
                    $currentTime
                ) {

                    if (
                        !$this->scheduleDayMatches(
                            $schedule->day,
                            $currentDay
                        )
                    ) {
                        return false;
                    }

                    if (
                        empty($schedule->start_time) ||
                        empty($schedule->end_time)
                    ) {
                        return false;
                    }

                    return (
                        $currentTime >=
                        $schedule->start_time
                        &&
                        $currentTime <=
                        $schedule->end_time
                    );
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | OPTIONAL CLASS SCHEDULE INFORMATION
        |--------------------------------------------------------------------------
        */

        $scheduleInformation = null;

        if ($classSchedule) {

            $scheduleInformation = [
                'id' =>
                    $classSchedule->id,

                'subject' =>
                    $classSchedule
                        ->subject
                        ?->subject_name
                    ?? 'Class',

                'subject_code' =>
                    $classSchedule
                        ->subject
                        ?->subject_code
                    ?? '',

                'section' =>
                    $classSchedule
                        ->section
                        ?->name
                    ?? '',

                'instructor' =>
                    $classSchedule
                        ->instructor
                        ?->name
                    ?? '',

                'day' =>
                    $classSchedule->day,

                'start_time' =>
                    Carbon::parse(
                        $classSchedule->start_time
                    )->format('h:i A'),

                'end_time' =>
                    Carbon::parse(
                        $classSchedule->end_time
                    )->format('h:i A'),

                'room' =>
                    $classSchedule->room
                    ?? '',
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | RECORD ATTENDANCE SAFELY
        |--------------------------------------------------------------------------
        |
        | We lock the student row during the attendance check.
        |
        | This helps prevent two nearly simultaneous scans from creating
        | duplicate attendance records.
        |--------------------------------------------------------------------------
        */

        try {

            $attendance = DB::transaction(
                function () use (
                    $student,
                    $classSchedule
                ) {

                    $lockedStudent = Student::query()
                        ->whereKey(
                            $student->getKey()
                        )
                        ->lockForUpdate()
                        ->first();

                    if (!$lockedStudent) {
                        throw new \RuntimeException(
                            'Student record is no longer available.'
                        );
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | ONE ATTENDANCE PER STUDENT PER DAY
                    |--------------------------------------------------------------------------
                    */

                    $alreadyRecorded =
                        Attendance::query()
                            ->where(
                                'student_id',
                                $lockedStudent->student_id
                            )
                            ->whereDate(
                                'attendance_date',
                                today()
                            )
                            ->lockForUpdate()
                            ->exists();

                    if ($alreadyRecorded) {
                        return null;
                    }

                    /*
                    |--------------------------------------------------------------------------
                    | CREATE ATTENDANCE
                    |--------------------------------------------------------------------------
                    */

                    return Attendance::create([
                        'student_id' =>
                            $lockedStudent->student_id,

                        'class_schedule_id' =>
                            $classSchedule?->id,

                        'attendance_date' =>
                            today(),

                        'time_in' =>
                            now()->format('H:i:s'),

                        'status' =>
                            'Present',
                    ]);
                }
            );

        } catch (\Throwable $e) {

            Log::error(
                'ATTENDANCE RECORDING ERROR',
                [
                    'student_id' =>
                        (string) $student->student_id,

                    'error' =>
                        $e->getMessage(),
                ]
            );

            return $this->dashboardResponse([

                'scannedStudent' =>
                    $scannedStudent,

                'classSchedule' =>
                    $scheduleInformation,

                'scanError' =>
                    'Attendance could not be recorded. Please try again.',

                'attendanceRecorded' =>
                    false,

                'alreadyScanned' =>
                    false,

                'smsSent' =>
                    false,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | ALREADY RECORDED
        |--------------------------------------------------------------------------
        */

        if (!$attendance) {

            return $this->dashboardResponse([

                'scannedStudent' =>
                    $scannedStudent,

                'classSchedule' =>
                    $scheduleInformation,

                'scanSuccess' =>
                    'Student verified. Attendance is already recorded today.',

                'attendanceRecorded' =>
                    true,

                'alreadyScanned' =>
                    true,

                'smsSent' =>
                    false,

                'smsStatus' =>
                    'NO NEW SMS',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | GET PARENT CONTACT
        |--------------------------------------------------------------------------
        */

        $parentContact = trim(
            (string) (
                $student->parent_contact
                ?? ''
            )
        );

        /*
        |--------------------------------------------------------------------------
        | PREPARE SMS
        |--------------------------------------------------------------------------
        */

        $smsMessage =
            'Sulu College of Technology: Dear Parent/Guardian, your child, ' .
            $studentName .
            ', has been recorded PRESENT today at ' .
            now()->format('h:i A') .
            '. Thank you.';

        $smsSent = false;

        $smsStatus =
            'NO PARENT NUMBER';

        /*
        |--------------------------------------------------------------------------
        | SEND SMS
        |--------------------------------------------------------------------------
        */

        if ($parentContact !== '') {

            $smsSent =
                $this->triggerGlobeTattooSms(
                    $parentContact,
                    $smsMessage,
                    (string) $student->student_id
                );

            $smsStatus =
                $smsSent
                    ? 'SMS SENT'
                    : 'SMS FAILED';
        }

        /*
        |--------------------------------------------------------------------------
        | SUCCESS MESSAGE
        |--------------------------------------------------------------------------
        */

        if ($smsSent) {

            $successMessage =
                'Student verified, attendance recorded, and SMS sent to parent.';

        } elseif ($parentContact === '') {

            $successMessage =
                'Student verified and attendance recorded, but no parent contact is registered.';

        } else {

            $successMessage =
                'Student verified and attendance recorded, but the SMS could not be sent.';
        }

        /*
        |--------------------------------------------------------------------------
        | FINAL RESPONSE
        |--------------------------------------------------------------------------
        */

        return $this->dashboardResponse([

            'scannedStudent' =>
                $scannedStudent,

            'classSchedule' =>
                $scheduleInformation,

            'scanSuccess' =>
                $successMessage,

            'attendanceRecorded' =>
                true,

            'smsSent' =>
                $smsSent,

            'smsStatus' =>
                $smsStatus,

            'alreadyScanned' =>
                false,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK SCHEDULE DAY
    |--------------------------------------------------------------------------
    */

    private function scheduleDayMatches(
        mixed $scheduleDay,
        string $currentDay
    ): bool {

        $scheduleDay =
            strtoupper(
                trim(
                    (string) $scheduleDay
                )
            );

        if ($scheduleDay === '') {
            return false;
        }

        $dayAliases = [

            'MON' => [
                'M',
                'MON',
                'MONDAY',
            ],

            'TUE' => [
                'T',
                'TU',
                'TUE',
                'TUES',
                'TUESDAY',
            ],

            'WED' => [
                'W',
                'WED',
                'WEDNESDAY',
            ],

            'THU' => [
                'TH',
                'THU',
                'THUR',
                'THURS',
                'THURSDAY',
            ],

            'FRI' => [
                'F',
                'FRI',
                'FRIDAY',
            ],

            'SAT' => [
                'S',
                'SA',
                'SAT',
                'SATURDAY',
            ],

            'SUN' => [
                'SU',
                'SUN',
                'SUNDAY',
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | DIRECT MATCH
        |--------------------------------------------------------------------------
        */

        if (
            $scheduleDay === $currentDay ||
            in_array(
                $scheduleDay,
                $dayAliases[$currentDay] ?? [],
                true
            )
        ) {
            return true;
        }

        /*
        |--------------------------------------------------------------------------
        | MULTIPLE DAY FORMAT
        |--------------------------------------------------------------------------
        |
        | MON/WED/FRI
        | MON, WED, FRI
        |--------------------------------------------------------------------------
        */

        $dayParts = preg_split(
            '/[\/,\-\s]+/',
            $scheduleDay
        );

        foreach ($dayParts as $dayPart) {

            $dayPart =
                strtoupper(
                    trim($dayPart)
                );

            if (
                $dayPart === $currentDay ||
                in_array(
                    $dayPart,
                    $dayAliases[$currentDay] ?? [],
                    true
                )
            ) {
                return true;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | COMPACT FORMAT
        |--------------------------------------------------------------------------
        |
        | MWF
        | TTH
        |--------------------------------------------------------------------------
        */

        $compactDay =
            preg_replace(
                '/[^A-Z]/',
                '',
                $scheduleDay
            );

        if ($compactDay !== '') {

            $compactAliases = [
                'MON' => 'M',
                'TUE' => 'T',
                'WED' => 'W',
                'THU' => 'H',
                'FRI' => 'F',
                'SAT' => 'S',
                'SUN' => 'U',
            ];

            $currentSymbol =
                $compactAliases[$currentDay]
                ?? null;

            if (
                $currentSymbol !== null &&
                str_contains(
                    $compactDay,
                    $currentSymbol
                )
            ) {
                return true;
            }
        }

        return false;
    }

    /*
    |--------------------------------------------------------------------------
    | EXTRACT STUDENT ID
    |--------------------------------------------------------------------------
    */

    private function extractStudentId(
        string $value
    ): string {

        $value = trim($value);

        if ($value === '') {
            return '';
        }

        /*
        |--------------------------------------------------------------------------
        | SCHOOL BARCODE FORMAT
        |--------------------------------------------------------------------------
        |
        | SCHOOL: ID 23-0001
        |--------------------------------------------------------------------------
        */

        if (
            preg_match(
                '/^SCHOOL\s*:\s*ID\s*(.+)$/i',
                $value,
                $matches
            )
        ) {
            return trim($matches[1]);
        }

        /*
        |--------------------------------------------------------------------------
        | DIRECT BARCODE
        |--------------------------------------------------------------------------
        */

        return $value;
    }

    /*
    |--------------------------------------------------------------------------
    | SEND SMS
    |--------------------------------------------------------------------------
    */

    private function triggerGlobeTattooSms(
        string $phoneNumber,
        string $message,
        string $studentId
    ): bool {

        try {

            $smsService =
                new HuaweiSmsService();

            $smsSent =
                $smsService->sendSms(
                    $phoneNumber,
                    $message
                );

            SmsLog::create([
                'student_id' =>
                    $studentId,

                'phone_number' =>
                    $phoneNumber,

                'message' =>
                    $message,

                'status' =>
                    $smsSent
                        ? 'Sent'
                        : 'Failed',
            ]);

            /*
            |--------------------------------------------------------------------------
            | DO NOT WRITE FULL PHONE NUMBER TO LOG
            |--------------------------------------------------------------------------
            */

            Log::info(
                'SMS sending result',
                [
                    'student_id' =>
                        $studentId,

                    'phone' =>
                        $this->maskPhoneNumber(
                            $phoneNumber
                        ),

                    'status' =>
                        $smsSent
                            ? 'Sent'
                            : 'Failed',
                ]
            );

            return $smsSent;

        } catch (\Throwable $e) {

            Log::error(
                'SMS sending error',
                [
                    'student_id' =>
                        $studentId,

                    'phone' =>
                        $this->maskPhoneNumber(
                            $phoneNumber
                        ),

                    'error' =>
                        $e->getMessage(),
                ]
            );

            try {

                SmsLog::create([
                    'student_id' =>
                        $studentId,

                    'phone_number' =>
                        $phoneNumber,

                    'message' =>
                        $message,

                    'status' =>
                        'Failed',
                ]);

            } catch (\Throwable $logError) {

                Log::error(
                    'SMS log error',
                    [
                        'error' =>
                            $logError->getMessage(),
                    ]
                );
            }

            return false;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | MASK PHONE NUMBER
    |--------------------------------------------------------------------------
    */

    private function maskPhoneNumber(
        string $phoneNumber
    ): string {

        $phoneNumber =
            trim($phoneNumber);

        $length =
            strlen($phoneNumber);

        if ($length <= 4) {
            return '****';
        }

        return str_repeat(
            '*',
            max(
                0,
                $length - 4
            )
        ) .
        substr(
            $phoneNumber,
            -4
        );
    }

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD RESPONSE
    |--------------------------------------------------------------------------
    */

    private function dashboardResponse(
        array $data = []
    ) {

        return Inertia::render(
            'Dashboard',
            [

                'totalStudents' =>
                    Student::count(),

                'students' =>
                    Student::all(),

                'sCannerToday' =>
                    Attendance::whereDate(
                        'attendance_date',
                        today()
                    )->count(),

                'smsAllertsToday' =>
                    SmsLog::whereDate(
                        'created_at',
                        today()
                    )
                    ->where(
                        'status',
                        'Sent'
                    )
                    ->count(),

                'smsGatewayStutatus' =>
                    'Connected',

                'scannedStudent' =>
                    $data['scannedStudent']
                    ?? null,

                'classSchedule' =>
                    $data['classSchedule']
                    ?? null,

                'scanSuccess' =>
                    $data['scanSuccess']
                    ?? null,

                'scanError' =>
                    $data['scanError']
                    ?? null,

                'attendanceRecorded' =>
                    $data['attendanceRecorded']
                    ?? false,

                'smsSent' =>
                    $data['smsSent']
                    ?? false,

                'smsStatus' =>
                    $data['smsStatus']
                    ?? null,

                'alreadyScanned' =>
                    $data['alreadyScanned']
                    ?? false,
            ]
        );
    }
}