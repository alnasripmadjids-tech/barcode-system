import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link, useForm } from '@inertiajs/react';

export default function StudentList({ students = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [courseOpen, setCourseOpen] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        student_id: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        course: '',
        year_level: '',
        address: '',
        date_of_birth: '',
        contact_number: '',
        id_validity: '',
    });

    const courses = {
        BSIT: 'BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY',
        BSSW: 'BACHELOR OF SCIENCE IN SOCIAL WORK',
        BSCE: 'BACHELOR OF SCIENCE IN CIVIL ENGINEERING',
        BSHM: 'BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT',
        BEED: 'BACHELOR OF SCIENCE IN EDUCATION',
        BSCRIM: 'BACHELOR OF SCIENCE IN CRIMINOLOGY',
        BSN: 'BACHELOR OF SCIENCE IN NURSING',
    };

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        router.get(
            '/studentlist',
            { search: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    const getFullName = (student) => {
        return [
            student.first_name,
            student.middle_name,
            student.last_name,
        ]
            .filter(Boolean)
            .join(' ');
    };

    const formatDate = (date) => {
        if (!date) {
            return 'N/A';
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleAddStudent = (e) => {
        e.preventDefault();

        post('/studentlist', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowAddStudent(false);
                setCourseOpen(false);
            },
        });
    };

    const closeAddStudent = () => {
        if (processing) {
            return;
        }

        reset();
        setCourseOpen(false);
        setShowAddStudent(false);
    };

    const handleDeleteStudent = (student) => {
        if (!student?.id) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to archive ${getFullName(student)}?\n\nThis student record will be removed from the active student list but can be restored later.`
        );

        if (!confirmed) {
            return;
        }

        router.delete(`/studentlist/${student.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                setSelectedStudent(null);
            },

            onError: () => {
                alert(
                    'Unable to archive this student. Please check the student route and try again.'
                );
            },
        });
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Student List Record" />

            <div className="min-h-screen bg-slate-100">

                {/* BACK BUTTON */}
                <div className="mx-auto w-full max-w-[1500px] px-4 pt-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-md transition hover:bg-blue-800"
                    >
                        ← Back
                    </Link>
                </div>

                {/* HEADER */}
                <div className="mx-auto w-full max-w-[1500px] px-4 pt-4">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 shadow-xl">

                        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
                        <div className="absolute -right-24 bottom-[-80px] h-64 w-64 rounded-full bg-white/5" />

                        <div className="relative p-6 md:p-8">

                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                                <div>
                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">
                                            👥
                                        </div>

                                        <div>
                                            <h1 className="text-3xl font-black text-white">
                                                Student List Record
                                            </h1>

                                            <p className="text-yellow-300">
                                                Sulu College of Technology Inc.
                                            </p>
                                        </div>

                                    </div>

                                    <p className="mt-4 text-blue-100">
                                        Integrated Database View of Enrolled Students
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/10 p-6">

                                    <p className="text-sm text-blue-100">
                                        Total Students
                                    </p>

                                    <h2 className="text-4xl font-black text-white">
                                        {students.length}
                                    </h2>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="mx-auto w-full max-w-[1500px] px-4 pb-10 pt-6">

                    {/* MASTERLIST */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

                        {/* TOOLBAR */}
                        <div className="border-b border-slate-200 p-5">

                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Masterlist of Enrolled Students
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Click a student record to view complete student information.
                                    </p>
                                </div>

                                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                                    {/* SEARCH */}
                                    <div className="w-full sm:w-80 lg:w-96">
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={handleSearch}
                                            placeholder="Search student ID, name, course..."
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    {/* ARCHIVED STUDENTS */}
                                 <Link
                                 href="/studentlist/archived"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-slate-800"
>
                            📦 Archived Students
                             </Link>

                           {/* ADD STUDENT */}
                            <button
                             type="button"
                           onClick={() => setShowAddStudent(true)}
                         className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-blue-800"
>
                       <span className="text-lg">+</span>
                                Add New Student
                         </button>

                                </div>

                            </div>

                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead className="bg-slate-100">

                                    <tr>

                                        <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            #
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Student ID
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Full Name
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Course
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Year Level
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-600">
                                            Barcode
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {students.length === 0 ? (

                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="py-12 text-center text-slate-500"
                                            >
                                                No student records found.
                                            </td>
                                        </tr>

                                    ) : (

                                        students.map((student, index) => (

                                            <tr
                                                key={student.id}
                                                onClick={() => handleStudentClick(student)}
                                                className={`cursor-pointer border-b border-slate-200 transition ${
                                                    selectedStudent?.id === student.id
                                                        ? 'bg-blue-100'
                                                        : 'hover:bg-blue-50'
                                                }`}
                                            >

                                                <td className="px-5 py-4 text-slate-600">
                                                    {index + 1}
                                                </td>

                                                <td className="px-5 py-4 font-bold text-blue-700">
                                                    {student.student_id}
                                                </td>

                                                <td className="px-5 py-4 font-bold text-slate-900">
                                                    {getFullName(student)}
                                                </td>

                                                <td className="px-5 py-4 text-slate-700">
                                                    {student.course || 'N/A'}
                                                </td>

                                                <td className="px-5 py-4 text-slate-700">
                                                    {student.year_level || 'N/A'}
                                                </td>

                                                <td className="px-5 py-4 font-mono font-semibold text-slate-700">
                                                    ▦ {student.barcode || 'N/A'}
                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {/* STUDENT INFORMATION */}
                    {selectedStudent && (

                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">

                            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 px-6 py-6">

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div>

                                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-yellow-300">
                                            Complete Student Record
                                        </p>

                                        <h2 className="mt-1 text-2xl font-black text-white">
                                            Student Information
                                        </h2>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedStudent(null)}
                                        className="w-fit rounded-xl bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
                                    >
                                        ✕ Close
                                    </button>

                                </div>

                            </div>

                            <div className="p-6">

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Student ID
                                        </p>
                                        <p className="mt-2 text-xl font-black text-slate-900">
                                            {selectedStudent.student_id || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Full Name
                                        </p>
                                        <p className="mt-2 text-xl font-black uppercase text-slate-900">
                                            {getFullName(selectedStudent) || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Course
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-slate-900">
                                            {courses[selectedStudent.course] ||
                                                selectedStudent.course ||
                                                'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Year Level
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-slate-900">
                                            {selectedStudent.year_level || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Address
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-slate-900">
                                            {selectedStudent.address || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Date of Birth
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-slate-900">
                                            {formatDate(selectedStudent.date_of_birth)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Parent/Guardian Contact Number
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-slate-900">
                                            {selectedStudent.contact_number || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            ID Validity
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-slate-900">
                                            {formatDate(selectedStudent.id_validity)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 md:col-span-2">

                                        <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                                            Student Barcode
                                        </p>

                                        <div className="mt-3 flex items-center gap-4">

                                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-3xl shadow-sm">
                                                ▦
                                            </div>

                                            <div>
                                                <p className="font-mono text-2xl font-black tracking-wider text-blue-900">
                                                    {selectedStudent.barcode || 'N/A'}
                                                </p>

                                                <p className="mt-1 text-sm text-blue-600">
                                                    Unique barcode associated with this student record
                                                </p>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* VERIFIED */}
                                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg">
                                            ✓
                                        </div>

                                        <div>
                                            <p className="font-bold text-green-800">
                                                Student Record Verified
                                            </p>

                                            <p className="text-sm text-green-700">
                                                The displayed information is retrieved directly from the student database.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* ARCHIVE BUTTON */}
                                <div className="mt-6 flex justify-end border-t border-slate-200 pt-6">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteStudent(selectedStudent)
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-md transition hover:bg-red-700"
                                    >
                                        🗑 Archive Student
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>

            {/* ADD NEW STUDENT MODAL */}
            {showAddStudent && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">

                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 px-6 py-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-widest text-yellow-300">
                                        Enrollment Record
                                    </p>

                                    <h2 className="mt-1 text-2xl font-black text-white">
                                        Add New Student
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeAddStudent}
                                    className="rounded-xl bg-white/10 px-4 py-2 text-xl font-bold text-white transition hover:bg-white/20"
                                >
                                    ✕
                                </button>

                            </div>

                        </div>

                        {/* FORM */}
                        <form onSubmit={handleAddStudent}>

                            <div className="p-6">

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    {/* STUDENT ID */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Student ID *
                                        </label>

                                        <input
                                            type="text"
                                            value={data.student_id}
                                            onChange={(e) =>
                                                setData('student_id', e.target.value)
                                            }
                                            placeholder="Enter student ID"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                        {errors.student_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.student_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* FIRST NAME */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            First Name *
                                        </label>

                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData('first_name', e.target.value)
                                            }
                                            placeholder="Enter first name"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                        {errors.first_name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.first_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* MIDDLE NAME */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Middle Name
                                        </label>

                                        <input
                                            type="text"
                                            value={data.middle_name}
                                            onChange={(e) =>
                                                setData('middle_name', e.target.value)
                                            }
                                            placeholder="Enter middle name"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    {/* LAST NAME */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Last Name *
                                        </label>

                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData('last_name', e.target.value)
                                            }
                                            placeholder="Enter last name"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                        {errors.last_name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.last_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* COURSE */}
                                    <div className="relative">
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Course *
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCourseOpen(!courseOpen)
                                            }
                                            className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-left outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >
                                            <span
                                                className={
                                                    data.course
                                                        ? 'text-slate-900'
                                                        : 'text-slate-400'
                                                }
                                            >
                                                {data.course
                                                    ? courses[data.course]
                                                    : 'Select Course'}
                                            </span>

                                            <span
                                                className={`ml-3 text-slate-500 transition-transform ${
                                                    courseOpen
                                                        ? 'rotate-180'
                                                        : ''
                                                }`}
                                            >
                                                ▼
                                            </span>
                                        </button>

                                        {courseOpen && (
                                            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl">

                                                {Object.entries(courses).map(
                                                    ([code, name]) => (
                                                        <button
                                                            key={code}
                                                            type="button"
                                                            onClick={() => {
                                                                setData(
                                                                    'course',
                                                                    code
                                                                );
                                                                setCourseOpen(
                                                                    false
                                                                );
                                                            }}
                                                            className={`w-full px-4 py-3 text-left text-sm font-medium transition hover:bg-blue-50 ${
                                                                data.course ===
                                                                code
                                                                    ? 'bg-blue-50 text-blue-700'
                                                                    : 'text-slate-700'
                                                            }`}
                                                        >
                                                            {name}
                                                        </button>
                                                    )
                                                )}

                                            </div>
                                        )}

                                        {errors.course && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.course}
                                            </p>
                                        )}
                                    </div>

                                    {/* YEAR LEVEL */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Year Level *
                                        </label>

                                        <select
                                            value={data.year_level}
                                            onChange={(e) =>
                                                setData(
                                                    'year_level',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="">
                                                Select Year Level
                                            </option>
                                            <option value="1ST YEAR">
                                                1ST YEAR
                                            </option>
                                            <option value="2ND YEAR">
                                                2ND YEAR
                                            </option>
                                            <option value="3RD YEAR">
                                                3RD YEAR
                                            </option>
                                            <option value="4TH YEAR">
                                                4TH YEAR
                                            </option>
                                        </select>

                                        {errors.year_level && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.year_level}
                                            </p>
                                        )}
                                    </div>

                                    {/* ADDRESS */}
                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Address
                                        </label>

                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    'address',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter complete address"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    {/* DATE OF BIRTH */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Date of Birth
                                        </label>

                                        <input
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) =>
                                                setData(
                                                    'date_of_birth',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    {/* CONTACT NUMBER */}
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            Parent/Guardian Contact Number
                                        </label>

                                        <input
                                            type="text"
                                            value={data.contact_number}
                                            onChange={(e) =>
                                                setData(
                                                    'contact_number',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="09XXXXXXXXX"
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    {/* ID VALIDITY */}
                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-bold text-slate-700">
                                            ID Validity
                                        </label>

                                        <input
                                            type="date"
                                            value={data.id_validity}
                                            onChange={(e) =>
                                                setData(
                                                    'id_validity',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                </div>

                            </div>

                            {/* MODAL FOOTER */}
                            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={closeAddStudent}
                                    disabled={processing}
                                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-blue-700 px-6 py-3 font-black text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Saving...'
                                        : 'Save Student'}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </AuthenticatedLayout>
    );
}