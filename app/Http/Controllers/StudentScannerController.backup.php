<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\ClassSchedule;
use App\Models\SmsLog;
use App\Models\Student;
use App\Services\HuaweiSmsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentScannerController extends Controller
{
    public function scan(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | GET SCANNER / MANUAL INPUT
        |--------------------------------------------------------------------------
        */

        $rawScannedValue = trim(
            (string) $request->input('student_barcode', '')
        );

        if ($rawScannedValue === '') {
            return $this->dashboardResponse([
                'scanError' => 'Please enter or scan a valid Student ID.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | EXTRACT BARCODE VALUE
        |--------------------------------------------------------------------------
        |
        | Scanner example:
        | SCHOOL: ID 23-0001
        |
        | Extracted value:
        | 23-0001
        |--------------------------------------------------------------------------
        */

        $studentId = $this->extractStudentId($rawScannedValue);

        if ($studentId === '') {
            return $this->dashboardResponse([
                'scanError' => 'Invalid barcode.',
            ]);
        }

        /*
|--------------------------------------------------------------------------
| FIND STUDENT
|--------------------------------------------------------------------------
|
| Supports both:
|
| SCHOOL: ID 23-0001
| 23-0001
|
|--------------------------------------------------------------------------
*/

$fullStudentId = 'SCHOOL: ID ' . $studentId;

$student = Student::query()
    ->where(function ($query) use ($rawScannedValue, $studentId, $fullStudentId) {

        $query
            // Exact value entered or scanned
            ->where('barcode', $rawScannedValue)
            ->orWhere('student_id', $rawScannedValue)

            // Extracted value, example: 23-0001
            ->orWhere('barcode', $studentId)
            ->orWhere('student_id', $studentId)

            // Normalized school format
            ->orWhere('barcode', $fullStudentId)
            ->orWhere('student_id', $fullStudentId);
    })
    ->with('section')
    ->first();
        /*
        |--------------------------------------------------------------------------
        | STUDENT NOT FOUND
        |--------------------------------------------------------------------------
        */

        if (!$student) {
            Log::warning('STUDENT NOT FOUND', [
                'barcode' => $studentId,
                'scanned_value' => $rawScannedValue,
            ]);

            return $this->dashboardResponse([
                'scanError' =>
                    'No student record was found for the scanned barcode.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | GET STUDENT INFORMATION FROM DATABASE
        |--------------------------------------------------------------------------
        */

        $studentName = trim(
            ($student->first_name ?? '') . ' ' .
            ($student->middle_name ?? '') . ' ' .
            ($student->last_name ?? '')
        );

        if ($studentName === '') {
            $studentName = trim(
                (string) ($student->name ?? '')
            );
        }

        $course = $student->course
            ?? $student->program
            ?? '';

        $yearLevel = $student->year_level
            ?? $student->year
            ?? '';

        $sectionName = $student->section?->name ?? '';

        $scannedStudent = [
            'id' => (string) $student->student_id,
            'student_id' => (string) $student->student_id,
            'barcode' => (string) $student->barcode,
            'name' => $studentName,
            'course' => $course,
            'year_level' => $yearLevel,
            'section' => $sectionName,
        ];

        /*
        |--------------------------------------------------------------------------
        | CHECK SECTION
        |--------------------------------------------------------------------------
        */

        if (!$student->section_id) {
            return $this->dashboardResponse([
                'scannedStudent' => $scannedStudent,

                'scanError' =>
                    'Student is registered but has no section assigned yet.',

                'attendanceRecorded' => false,
                'smsSent' => false,
                'alreadyScanned' => false,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | FIND CURRENT CLASS SCHEDULE
        |--------------------------------------------------------------------------
        */

        $now = Carbon::now();

        $currentDay = strtoupper(
            $now->format('D')
        );

        $currentTime = $now->format('H:i:s');

        $classSchedules = ClassSchedule::query()
            ->where('section_id', $student->section_id)
            ->where('is_active', true)
            ->with([
                'academicYear',
                'semester',
                'section',
                'subject',
                'instructor',
            ])
            ->get();

        $classSchedule = $classSchedules->first(
            function ($schedule) use ($currentDay, $currentTime) {

                $scheduleDay = strtoupper(
                    trim((string) $schedule->day)
                );

                $dayParts = preg_split(
                    '/[\/,\-\s]+/',
                    $scheduleDay
                );

                $dayMatches = false;

                foreach ($dayParts as $dayPart) {

                    $dayPart = strtoupper(
                        trim($dayPart)
                    );

                    $validDays = [
                        'MON' => ['M', 'MON', 'MONDAY'],
                        'TUE' => ['T', 'TU', 'TUE', 'TUESDAY'],
                        'WED' => ['W', 'WED', 'WEDNESDAY'],
                        'THU' => ['TH', 'THU', 'THURS', 'THURSDAY'],
                        'FRI' => ['F', 'FRI', 'FRIDAY'],
                        'SAT' => ['SAT', 'SATURDAY'],
                        'SUN' => ['SUN', 'SUNDAY'],
                    ];

                    if (
                        $dayPart === $currentDay ||
                        in_array(
                            $dayPart,
                            $validDays[$currentDay] ?? [],
                            true
                        )
                    ) {
                        $dayMatches = true;
                        break;
                    }
                }

                if (!$dayMatches) {
                    return false;
                }

                return (
                    $currentTime >= $schedule->start_time &&
                    $currentTime <= $schedule->end_time
                );
            }
        );

        /*
        |--------------------------------------------------------------------------
        | NO CURRENT CLASS
        |--------------------------------------------------------------------------
        */

        if (!$classSchedule) {
            return $this->dashboardResponse([
                'scannedStudent' => $scannedStudent,

                'scanError' =>
                    'Student verified, but there is no active class schedule for this student at the current day and time.',

                'attendanceRecorded' => false,
                'smsSent' => false,
                'alreadyScanned' => false,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | CLASS SCHEDULE INFORMATION
        |--------------------------------------------------------------------------
        */

        $scheduleInformation = [
            'id' => $classSchedule->id,

            'subject' =>
                $classSchedule->subject?->subject_name ?? 'Class',

            'subject_code' =>
                $classSchedule->subject?->subject_code ?? '',

            'section' =>
                $classSchedule->section?->name ?? '',

            'instructor' =>
                $classSchedule->instructor?->name ?? '',

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
                $classSchedule->room ?? '',
        ];

        /*
        |--------------------------------------------------------------------------
        | CHECK TODAY'S ATTENDANCE
        |--------------------------------------------------------------------------
        */

        $alreadyScannedToday = Attendance::query()
            ->where(
                'student_id',
                $student->student_id
            )
            ->where(
                'class_schedule_id',
                $classSchedule->id
            )
            ->whereDate(
                'attendance_date',
                today()
            )
            ->exists();

        /*
        |--------------------------------------------------------------------------
        | ALREADY RECORDED
        |--------------------------------------------------------------------------
        */

        if ($alreadyScannedToday) {
            return $this->dashboardResponse([
                'scannedStudent' => $scannedStudent,

                'classSchedule' => $scheduleInformation,

                'scanSuccess' =>
                    'Student verified. Attendance is already recorded today.',

                'attendanceRecorded' => true,

                'alreadyScanned' => true,

                'smsSent' => false,

                'smsStatus' => 'NO NEW SMS',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | RECORD ATTENDANCE
        |--------------------------------------------------------------------------
        */

        Attendance::create([
            'student_id' =>
                $student->student_id,

            'class_schedule_id' =>
                $classSchedule->id,

            'attendance_date' =>
                today(),

            'time_in' =>
                now()->format('H:i:s'),

            'status' =>
                'Present',
        ]);

        /*
        |--------------------------------------------------------------------------
        | GET PARENT CONTACT FROM DATABASE
        |--------------------------------------------------------------------------
        */

        $parentContact = trim(
            (string) ($student->parent_contact ?? '')
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

        $smsStatus = 'NO PARENT NUMBER';

        /*
        |--------------------------------------------------------------------------
        | SEND SMS THROUGH GLOBE TATTOO / HUAWEI E303
        |--------------------------------------------------------------------------
        */

        if ($parentContact !== '') {

            $smsSent = $this->triggerGlobeTattooSms(
                $parentContact,
                $smsMessage,
                (string) $student->student_id
            );

            $smsStatus = $smsSent
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
    | EXTRACT BARCODE FROM SCANNER VALUE
    |--------------------------------------------------------------------------
    |
    | Scanner:
    |
    | SCHOOL: ID 23-0001
    |
    | Database barcode:
    |
    | 23-0001
    |--------------------------------------------------------------------------
    */

    private function extractStudentId(string $value): string
    {
        $value = trim($value);

        if ($value === '') {
            return '';
        }

        /*
        |--------------------------------------------------------------------------
        | FULL SCANNER VALUE
        |--------------------------------------------------------------------------
        |
        | SCHOOL: ID 23-0001
        |
        | becomes:
        |
        | 23-0001
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
        | DIRECT BARCODE VALUE
        |--------------------------------------------------------------------------
        |
        | Also supports:
        |
        | 23-0001
        | 202430186
        |--------------------------------------------------------------------------
        */

        return $value;
    }

    /*
    |--------------------------------------------------------------------------
    | SEND SMS THROUGH GLOBE TATTOO / HUAWEI E303
    |--------------------------------------------------------------------------
    */

    private function triggerGlobeTattooSms(
        string $phoneNumber,
        string $message,
        string $studentId
    ): bool {
        try {

            $smsService = new HuaweiSmsService();

            $smsSent = $smsService->sendSms(
                $phoneNumber,
                $message
            );

            SmsLog::create([
                'student_id' => $studentId,
                'phone_number' => $phoneNumber,
                'message' => $message,
                'status' => $smsSent ? 'Sent' : 'Failed',
            ]);

            Log::info('Globe Tattoo SMS result', [
                'student_id' => $studentId,
                'phone_number' => $phoneNumber,
                'status' => $smsSent ? 'Sent' : 'Failed',
            ]);

            return $smsSent;

        } catch (\Throwable $e) {

            Log::error('Globe Tattoo SMS ERROR', [
                'student_id' => $studentId,
                'phone_number' => $phoneNumber,
                'error' => $e->getMessage(),
            ]);

            try {

                SmsLog::create([
                    'student_id' => $studentId,
                    'phone_number' => $phoneNumber,
                    'message' => $message,
                    'status' => 'Failed',
                ]);

            } catch (\Throwable $logError) {

                Log::error('SMS LOG ERROR', [
                    'error' => $logError->getMessage(),
                ]);
            }

            return false;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD RESPONSE
    |--------------------------------------------------------------------------
    */

    private function dashboardResponse(array $data = [])
    {
        return Inertia::render('Dashboard', [

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
                ->where('status', 'Sent')
                ->count(),

            'smsGatewayStutatus' =>
                'Connected',

            'scannedStudent' =>
                $data['scannedStudent'] ?? null,

            'classSchedule' =>
                $data['classSchedule'] ?? null,

            'scanSuccess' =>
                $data['scanSuccess'] ?? null,

            'scanError' =>
                $data['scanError'] ?? null,

            'attendanceRecorded' =>
                $data['attendanceRecorded'] ?? false,

            'smsSent' =>
                $data['smsSent'] ?? false,

            'smsStatus' =>
                $data['smsStatus'] ?? null,

            'alreadyScanned' =>
                $data['alreadyScanned'] ?? false,
        ]);
    }
}

