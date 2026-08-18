import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Dashboard({
    auth,
    totalStudents = 0,
    sCannerToday = 0,
    smsGatewayStutatus = 'Disconnected',
    smsAllertsToday = 0,
    scannedStudent = null,
    scanSuccess = null,
    scanError = null,
    attendanceRecorded = false,
    smsSent = false,
    smsStatus = null,
    alreadyScanned = false,
}) {
    const [barcode, setBarcode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);
    const submittingRef = useRef(false);

    /*
    |--------------------------------------------------------------------------
    | FOCUS INPUT
    |--------------------------------------------------------------------------
    */

    const focusScanner = () => {
        setTimeout(() => {
            if (!submittingRef.current) {
                inputRef.current?.focus();
            }
        }, 100);
    };

    /*
    |--------------------------------------------------------------------------
    | VERIFY STUDENT
    |--------------------------------------------------------------------------
    |
    | Works for:
    | 1. Manually typed Student ID
    | 2. Barcode scanner
    |
    */

    const verifyStudent = (value) => {
        const scannedValue = String(value ?? '').trim();

        if (!scannedValue) {
            focusScanner();
            return;
        }

        if (submittingRef.current) {
            return;
        }

        submittingRef.current = true;
        setIsLoading(true);

        router.post(
            '/verify-student',
            {
                student_barcode: scannedValue,
            },
            {
                preserveScroll: true,
                preserveState: false,

                onStart: () => {
                    setIsLoading(true);
                },

                onSuccess: () => {
                    /*
                    | Clear the input ONLY after successful request.
                    */
                    setBarcode('');
                },

                onError: () => {
                    /*
                    | Keep the typed value if verification fails.
                    | This makes it easier to correct the ID.
                    */
                    setBarcode(scannedValue);
                },

                onFinish: () => {
                    setIsLoading(false);
                    submittingRef.current = false;

                    /*
                    | Focus the scanner input again after request.
                    */
                    focusScanner();
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | INPUT CHANGE
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | Nothing is submitted while typing.
    |
    */

    const handleChange = (e) => {
        setBarcode(e.target.value);
    };

    /*
    |--------------------------------------------------------------------------
    | ENTER KEY
    |--------------------------------------------------------------------------
    */

    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') {
            return;
        }

        e.preventDefault();

        if (isLoading) {
            return;
        }

        verifyStudent(barcode);
    };

    /*
    |--------------------------------------------------------------------------
    | FORM SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLoading) {
            return;
        }

        verifyStudent(barcode);
    };

    /*
    |--------------------------------------------------------------------------
    | INITIAL FOCUS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        focusScanner();
    }, []);

    return (
        <AuthenticatedLayout header={null}>
            <Head title="SIS Dashboard" />

            <div className="min-h-screen bg-slate-100">
                <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

                    {/* =====================================================
                        HEADER
                    ====================================================== */}

                    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 px-6 py-7 shadow-xl sm:px-8">

                        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
                        <div className="absolute -right-24 bottom-[-80px] h-64 w-64 rounded-full bg-white/5" />

                        <div className="relative">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-yellow-300">
                                        Sulu College of Technology
                                    </p>

                                    <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                                        Student Attendance System
                                    </h1>
                                </div>

                                <div className="flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">

                                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

                                    <span className="text-xs font-bold uppercase tracking-wide text-blue-50">
                                        System Online
                                    </span>

                                </div>

                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        STAT CARDS
                    ====================================================== */}

                    <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {/* TOTAL STUDENTS */}

                        <div className="min-h-[130px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Total Students
                                    </p>

                                    <p className="mt-3 text-3xl font-black text-slate-900">
                                        {totalStudents}
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                        All enrolled students
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                    👥
                                </div>

                            </div>
                        </div>

                        {/* SCANNED TODAY */}

                        <div className="min-h-[130px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Scanned Today
                                    </p>

                                    <p className="mt-3 text-3xl font-black text-slate-900">
                                        {sCannerToday}
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                        Students scanned
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                                    ▣
                                </div>

                            </div>
                        </div>

                        {/* SMS GATEWAY */}

                        <div className="min-h-[130px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        SMS Gateway
                                    </p>

                                    <p
                                        className={`mt-3 text-3xl font-black ${
                                            smsGatewayStutatus === 'Connected'
                                                ? 'text-emerald-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {smsGatewayStutatus}
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                        Gateway status
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                    ✉
                                </div>

                            </div>
                        </div>

                        {/* SMS ALERTS */}

                        <div className="min-h-[130px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        SMS Alerts Today
                                    </p>

                                    <p className="mt-3 text-3xl font-black text-slate-900">
                                        {smsAllertsToday}
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-600">
                                        Notification processed
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
                                    🔔
                                </div>

                            </div>
                        </div>

                    </section>

                    {/* =====================================================
                        SCANNER
                    ====================================================== */}

                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                        <div className="mx-auto max-w-4xl">

                            <div className="text-center">

                                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
                                    Attendance Scanner
                                </p>

                                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                                    Scan Student Barcode
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Enter or scan the student ID to identify the student.
                                </p>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-7 flex flex-col gap-3 sm:flex-row"
                            >

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={barcode}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                    autoFocus
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    inputMode="numeric"
                                    placeholder={
                                        isLoading
                                            ? 'Checking student record...'
                                            : 'Enter or scan Student ID...'
                                    }
                                    className="h-14 min-w-0 flex-1 rounded-xl border-2 border-slate-200 bg-slate-50 px-5 text-center font-mono text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                                />

                                <button
                                    type="submit"
                                    disabled={isLoading || !barcode.trim()}
                                    className="h-14 rounded-xl bg-blue-600 px-8 text-sm font-black uppercase tracking-wide text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 sm:min-w-[190px]"
                                >
                                    {isLoading
                                        ? 'Checking...'
                                        : 'Verify Student'}
                                </button>

                            </form>

                            <p className="mt-3 text-center text-xs font-medium text-slate-400">
                                Type the Student ID manually or use a barcode scanner, then press Enter.
                            </p>

                        </div>
                    </section>

                    {/* =====================================================
                        SUCCESS MESSAGE
                    ====================================================== */}

                    {scanSuccess && (
                        <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm">

                            <div className="flex items-center gap-4 px-6 py-5">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xl font-black text-white">
                                    ✓
                                </div>

                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                                        Verification Successful
                                    </p>

                                    <h2 className="mt-1 text-xl font-black text-emerald-900">
                                        Student Verified
                                    </h2>

                                    <p className="mt-1 text-sm text-emerald-700">
                                        {scanSuccess}
                                    </p>
                                </div>

                            </div>
                        </section>
                    )}

                    {/* =====================================================
                        ERROR MESSAGE
                    ====================================================== */}

                    {scanError && (
                        <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 font-black text-white">
                                    !
                                </div>

                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-wider text-red-600">
                                        Verification Failed
                                    </p>

                                    <p className="mt-1 font-bold text-red-800">
                                        {scanError}
                                    </p>
                                </div>

                            </div>
                        </section>
                    )}

                    {/* =====================================================
                        STUDENT RECORD
                    ====================================================== */}

                    {scannedStudent && (
                        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            <div className="border-b border-slate-200 px-6 py-5">

                                <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-blue-600">
                                    Student Record
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    Student Information
                                </h2>

                            </div>

                            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">

                                {/* STUDENT ID */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Student ID
                                    </p>

                                    <p className="mt-2 text-lg font-black text-slate-900">
                                        {scannedStudent.student_id ??
                                            scannedStudent.id ??
                                            'N/A'}
                                    </p>

                                </div>

                                {/* STUDENT NAME */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Student Name
                                    </p>

                                    <p className="mt-2 text-lg font-black uppercase text-slate-900">
                                        {scannedStudent.name ??
                                            scannedStudent.fullname ??
                                            'N/A'}
                                    </p>

                                </div>

                                {/* COURSE */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Course
                                    </p>

                                    <p className="mt-2 text-lg font-black text-slate-900">
                                        {scannedStudent.course ?? 'N/A'}
                                    </p>

                                </div>

                                {/* YEAR LEVEL */}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Year Level
                                    </p>

                                    <p className="mt-2 text-lg font-black text-slate-900">
                                        {scannedStudent.year_level ??
                                            scannedStudent.year ??
                                            'N/A'}
                                    </p>

                                </div>

                            </div>

                            {/* ATTENDANCE & SMS STATUS */}

                            <div className="border-t border-slate-200 bg-slate-50 px-6 py-6">

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    {/* ATTENDANCE STATUS */}

                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                            Attendance Status
                                        </p>

                                        <div className="mt-4 flex items-center gap-3">

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-black ${
                                                    alreadyScanned
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : attendanceRecorded
                                                          ? 'bg-emerald-100 text-emerald-700'
                                                          : 'bg-blue-100 text-blue-700'
                                                }`}
                                            >
                                                {alreadyScanned
                                                    ? '!'
                                                    : attendanceRecorded
                                                      ? '✓'
                                                      : 'i'}
                                            </div>

                                            <div>

                                                <p className="font-black text-slate-900">
                                                    {alreadyScanned
                                                        ? 'Already Recorded'
                                                        : attendanceRecorded
                                                          ? 'Attendance Recorded'
                                                          : 'Student Verified'}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {alreadyScanned
                                                        ? 'No duplicate attendance was created today.'
                                                        : attendanceRecorded
                                                          ? 'Attendance has been successfully recorded.'
                                                          : 'Student information has been verified.'}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* SMS STATUS */}

                                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                            Parent SMS Notification
                                        </p>

                                        <div className="mt-4 flex items-center gap-3">

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-black ${
                                                    smsStatus === 'SMS SENT'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : smsStatus === 'SMS FAILED'
                                                          ? 'bg-red-100 text-red-700'
                                                          : alreadyScanned
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {smsStatus === 'SMS SENT'
                                                    ? '✓'
                                                    : smsStatus === 'SMS FAILED'
                                                      ? '!'
                                                      : alreadyScanned
                                                        ? '—'
                                                        : '✉'}
                                            </div>

                                            <div>

                                                <p
                                                    className={`font-black ${
                                                        smsStatus === 'SMS SENT'
                                                            ? 'text-emerald-700'
                                                            : smsStatus === 'SMS FAILED'
                                                              ? 'text-red-700'
                                                              : 'text-slate-900'
                                                    }`}
                                                >
                                                    {smsStatus === 'SMS SENT'
                                                        ? 'SMS SENT'
                                                        : smsStatus === 'SMS FAILED'
                                                          ? 'SMS FAILED'
                                                          : alreadyScanned
                                                            ? 'NO NEW SMS'
                                                            : 'SMS STATUS'}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {smsStatus === 'SMS SENT'
                                                        ? 'The SMS request was accepted by the SMS gateway.'
                                                        : smsStatus === 'SMS FAILED'
                                                          ? 'The SMS request could not be sent through the gateway.'
                                                          : alreadyScanned
                                                            ? 'Student was already recorded today.'
                                                            : 'Waiting for attendance verification.'}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </section>
                    )}

                </main>
            </div>
        </AuthenticatedLayout>
    );
}

