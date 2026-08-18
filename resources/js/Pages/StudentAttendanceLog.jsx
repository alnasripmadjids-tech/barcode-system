import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    ClipboardList,
    CircleCheck,
    Clock3,
    CircleX,
    Search,
    CalendarDays,
    Filter,
    RotateCcw,
    Users,
    FileSearch,
    UserRound,
    ArrowLeft,
} from 'lucide-react';

export default function StudentAttendanceLog({
    attendances = [],
    filters = {},
    summary = {},
}) {
    const formatTime = (time) => {
        if (!time) return 'N/A';

        const [hours, minutes, seconds] = time.split(':');

        const date = new Date();
        date.setHours(hours, minutes, seconds);

        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    const handleFilter = (field, value) => {
        const params = {
            ...filters,
            [field]: value,
        };

        if (!value) {
            delete params[field];
        }

        router.get('/student-attendance', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get('/student-attendance', {}, {
            preserveState: false,
            preserveScroll: false,
        });
    };

    const getStudentName = (student) => {
        if (!student) return 'Unknown';

        return (
            [
                student.first_name,
                student.middle_name,
                student.last_name,
            ]
                .filter(Boolean)
                .join(' ')
                .trim() || 'Unknown'
        );
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Late':
                return {
                    className:
                        'bg-amber-50 text-amber-700 border border-amber-200',
                    icon: <Clock3 size={15} />,
                };

            case 'Absent':
                return {
                    className:
                        'bg-rose-50 text-rose-700 border border-rose-200',
                    icon: <CircleX size={15} />,
                };

            case 'Present':
            default:
                return {
                    className:
                        'bg-emerald-50 text-emerald-700 border border-emerald-200',
                    icon: <CircleCheck size={15} />,
                };
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Attendance Log" />

            <div className="min-h-screen space-y-6 pb-8">

                {/* HEADER */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 px-5 py-5 shadow-lg sm:px-6">

                    {/* Background Decorations */}
                    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/5" />

                    <div className="absolute -bottom-16 right-1/4 h-36 w-36 rounded-full bg-blue-300/10" />

                    <div className="relative">

                        {/* BACK BUTTON */}
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        {/* HEADER CONTENT */}
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                            {/* PAGE TITLE */}
                            <div className="flex items-center gap-3">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-md backdrop-blur-md">
                                    <ClipboardList size={23} />
                                </div>

                                <div>

                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                                        Attendance Management
                                    </p>

                                    <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                                        Student Attendance Log
                                    </h1>

                                    <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                                        Monitor and manage student attendance records.
                                    </p>

                                </div>

                            </div>

                            {/* TOTAL RECORDS */}
                            <div className="flex w-fit items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3 shadow-md backdrop-blur-md">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/20 text-blue-100">
                                    <Users size={19} />
                                </div>

                                <div>

                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-100">
                                        Total Records
                                    </p>

                                    <p className="mt-0.5 text-2xl font-black text-white">
                                        {summary.total ?? 0}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {/* TOTAL */}
                    <div className="group cursor-default rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Total Records
                                </p>

                                <p className="mt-2 text-3xl font-black text-slate-900">
                                    {summary.total ?? 0}
                                </p>

                                <p className="mt-2 text-xs font-medium text-slate-400">
                                    All attendance entries
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition duration-300 group-hover:scale-110 group-hover:bg-blue-100">
                                <ClipboardList size={23} />
                            </div>

                        </div>

                    </div>


                    {/* PRESENT */}
                    <div className="group cursor-default rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Present
                                </p>

                                <p className="mt-2 text-3xl font-black text-emerald-600">
                                    {summary.present ?? 0}
                                </p>

                                <p className="mt-2 text-xs font-medium text-slate-400">
                                    Successfully recorded
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition duration-300 group-hover:scale-110 group-hover:bg-emerald-100">
                                <CircleCheck size={24} />
                            </div>

                        </div>

                    </div>


                    {/* LATE */}
                    <div className="group cursor-default rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Late
                                </p>

                                <p className="mt-2 text-3xl font-black text-amber-500">
                                    {summary.late ?? 0}
                                </p>

                                <p className="mt-2 text-xs font-medium text-slate-400">
                                    Late attendance records
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition duration-300 group-hover:scale-110 group-hover:bg-amber-100">
                                <Clock3 size={23} />
                            </div>

                        </div>

                    </div>


                    {/* ABSENT */}
                    <div className="group cursor-default rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl">

                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Absent
                                </p>

                                <p className="mt-2 text-3xl font-black text-rose-600">
                                    {summary.absent ?? 0}
                                </p>

                                <p className="mt-2 text-xs font-medium text-slate-400">
                                    No attendance record
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition duration-300 group-hover:scale-110 group-hover:bg-rose-100">
                                <CircleX size={23} />
                            </div>

                        </div>

                    </div>

                </div>


                {/* SEARCH & FILTER */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <Filter size={21} />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Search & Filter
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Find attendance records by student or date.
                                </p>
                            </div>

                        </div>

                        {(filters.search || filters.date) && (
                            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
                                <Filter size={14} />
                                Filter Active
                            </span>
                        )}

                    </div>


                    <div className="p-6">

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* SEARCH */}
                            <div>

                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Search Student
                                </label>

                                <div className="relative">

                                    <Search
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={filters.search ?? ''}
                                        onChange={(e) =>
                                            handleFilter(
                                                'search',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter student ID or name..."
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />

                                </div>

                            </div>


                            {/* DATE */}
                            <div>

                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Attendance Date
                                </label>

                                <div className="relative">

                                    <CalendarDays
                                        size={19}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="date"
                                        value={filters.date ?? ''}
                                        onChange={(e) =>
                                            handleFilter(
                                                'date',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                        </div>


                        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
                            >
                                <RotateCcw size={17} />
                                Clear Filters
                            </button>

                        </div>

                    </div>

                </div>


                {/* ATTENDANCE TABLE */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* TABLE HEADER */}
                    <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <FileSearch size={21} />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Attendance Records
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Showing {attendances.length} attendance records
                                </p>
                            </div>

                        </div>


                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">

                            <ClipboardList size={16} />

                            {attendances.length} Records

                        </div>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="border-b border-slate-200 bg-slate-50">

                                <tr>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Student
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Student ID
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Time In
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {attendances.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="px-6 py-20 text-center"
                                        >

                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                                <ClipboardList size={30} />
                                            </div>

                                            <h3 className="mt-5 font-bold text-slate-800">
                                                No attendance records found
                                            </h3>

                                            <p className="mt-2 text-sm text-slate-500">
                                                Try changing your search or filter options.
                                            </p>

                                        </td>

                                    </tr>

                                ) : (

                                    attendances.map((attendance) => {

                                        const student = attendance.student;

                                        const studentName =
                                            getStudentName(student);

                                        const status =
                                            getStatusStyle(
                                                attendance.status ?? 'Present'
                                            );

                                        return (

                                            <tr
                                                key={attendance.id}
                                                className="transition-colors duration-200 hover:bg-blue-50/50"
                                            >

                                                {/* STUDENT */}
                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 text-white shadow-sm">
                                                            <UserRound size={20} />
                                                        </div>

                                                        <div>

                                                            <p className="font-bold text-slate-800">
                                                                {studentName}
                                                            </p>

                                                            <p className="mt-0.5 text-xs text-slate-500">
                                                                Registered Student
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* STUDENT ID */}
                                                <td className="px-6 py-4">

                                                    <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                                        {student?.student_id ??
                                                            'Unknown'}
                                                    </span>

                                                </td>


                                                {/* DATE */}
                                                <td className="px-6 py-4">

                                                    <span className="font-medium text-slate-700">
                                                        {attendance.attendance_date ??
                                                            'N/A'}
                                                    </span>

                                                </td>


                                                {/* TIME */}
                                                <td className="px-6 py-4">

                                                    <span className="font-semibold text-slate-700">
                                                        {formatTime(
                                                            attendance.time_in
                                                        )}
                                                    </span>

                                                </td>


                                                {/* STATUS */}
                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${status.className}`}
                                                    >
                                                        {status.icon}

                                                        {attendance.status ??
                                                            'Present'}
                                                    </span>

                                                </td>

                                            </tr>

                                        );

                                    })

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}