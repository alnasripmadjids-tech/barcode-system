import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';

import {
    Users,
    ShieldCheck,
    UserRound,
    Search,
    SlidersHorizontal,
    RotateCcw,
    UserPlus,
    MoreHorizontal,
    Mail,
    CalendarDays,
    Pencil,
    Trash2,
    ChevronDown,
    Shield,
    ArrowLeft,
    X,
    Lock,
} from 'lucide-react';

export default function UserManagement({
    users = [],
    filters = {},
    summary = {},
}) {
    /*
    |--------------------------------------------------------------------------
    | PAGE / AUTH DATA
    |--------------------------------------------------------------------------
    */

    const { auth, flash } = usePage().props;

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [search, setSearch] = useState(filters.search ?? '');
    const [role, setRole] = useState(filters.role ?? '');

    const [openMenu, setOpenMenu] = useState(null);

    const [showAddUser, setShowAddUser] = useState(false);

    const [showEditUser, setShowEditUser] = useState(false);

    const [showDeleteUser, setShowDeleteUser] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | ADD USER FORM
    |--------------------------------------------------------------------------
    */

    const {
        data: addData,
        setData: setAddData,
        post: postUser,
        processing: addingUser,
        errors: addErrors,
        reset: resetAddForm,
        clearErrors: clearAddErrors,
    } = useForm({
        name: '',
        email: '',
        role: 'user',
        password: '',
        password_confirmation: '',
    });

    /*
    |--------------------------------------------------------------------------
    | EDIT USER FORM
    |--------------------------------------------------------------------------
    */

    const {
        data: editData,
        setData: setEditData,
        put: updateUser,
        processing: updatingUser,
        errors: editErrors,
        reset: resetEditForm,
        clearErrors: clearEditErrors,
    } = useForm({
        name: '',
        email: '',
        role: 'user',
    });

    /*
    |--------------------------------------------------------------------------
    | FILTER
    |--------------------------------------------------------------------------
    */

    const handleFilter = (field, value) => {
        const params = {
            ...filters,
            [field]: value,
        };

        if (!value) {
            delete params[field];
        }

        router.get('/user', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    /*
    |--------------------------------------------------------------------------
    | CLEAR FILTERS
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {
        setSearch('');
        setRole('');
        setOpenMenu(null);

        router.get(
            '/user',
            {},
            {
                preserveState: false,
                preserveScroll: false,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | OPEN ADD USER
    |--------------------------------------------------------------------------
    */

    const openAddUser = () => {
        resetAddForm();
        clearAddErrors();

        setSelectedUser(null);
        setOpenMenu(null);
        setShowEditUser(false);
        setShowDeleteUser(false);

        setShowAddUser(true);
    };

    /*
    |--------------------------------------------------------------------------
    | CLOSE ADD USER
    |--------------------------------------------------------------------------
    */

    const closeAddUser = () => {
        resetAddForm();
        clearAddErrors();

        setShowAddUser(false);
    };

    /*
    |--------------------------------------------------------------------------
    | SUBMIT ADD USER
    |--------------------------------------------------------------------------
    */

    const submitUser = (e) => {
        e.preventDefault();

        postUser('/user', {
            preserveScroll: true,

            onSuccess: () => {
                resetAddForm();
                setShowAddUser(false);
            },
        });
    };

    /*
    |--------------------------------------------------------------------------
    | OPEN EDIT USER
    |--------------------------------------------------------------------------
    */

    const openEditUser = (user) => {
        setSelectedUser(user);

        setEditData({
            name: user.name ?? '',
            email: user.email ?? '',
            role: user.role ?? 'user',
        });

        clearEditErrors();

        setOpenMenu(null);
        setShowAddUser(false);
        setShowDeleteUser(false);

        setShowEditUser(true);
    };

    /*
    |--------------------------------------------------------------------------
    | CLOSE EDIT USER
    |--------------------------------------------------------------------------
    */

    const closeEditUser = () => {
        resetEditForm();
        clearEditErrors();

        setSelectedUser(null);
        setShowEditUser(false);
    };

    /*
    |--------------------------------------------------------------------------
    | SUBMIT EDIT USER
    |--------------------------------------------------------------------------
    */

    const submitEditUser = (e) => {
        e.preventDefault();

        if (!selectedUser) {
            return;
        }

        updateUser(`/user/${selectedUser.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                resetEditForm();
                setSelectedUser(null);
                setShowEditUser(false);
            },
        });
    };

    /*
    |--------------------------------------------------------------------------
    | OPEN DELETE
    |--------------------------------------------------------------------------
    */

    const openDeleteUser = (user) => {
        setSelectedUser(user);
        setOpenMenu(null);
        setShowDeleteUser(true);
    };

    /*
    |--------------------------------------------------------------------------
    | CLOSE DELETE
    |--------------------------------------------------------------------------
    */

    const closeDeleteUser = () => {
        setSelectedUser(null);
        setShowDeleteUser(false);
    };

    /*
    |--------------------------------------------------------------------------
    | DELETE USER
    |--------------------------------------------------------------------------
    */

    const deleteUser = () => {
        if (!selectedUser) {
            return;
        }

        router.delete(`/user/${selectedUser.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                setSelectedUser(null);
                setShowDeleteUser(false);
            },
        });
    };

    /*
    |--------------------------------------------------------------------------
    | ROLE DESIGN
    |--------------------------------------------------------------------------
    */

    const getRole = (userRole) => {
        if (userRole === 'admin') {
            return {
                label: 'Administrator',
                icon: ShieldCheck,
                badge:
                    'border-violet-200 bg-violet-50 text-violet-700',
            };
        }

        return {
            label: 'Regular User',
            icon: UserRound,
            badge:
                'border-sky-200 bg-sky-50 text-sky-700',
        };
    };

    /*
    |--------------------------------------------------------------------------
    | FORMAT DATE
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {
        if (!date) {
            return 'N/A';
        }

        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    /*
    |--------------------------------------------------------------------------
    | RETURN
    |--------------------------------------------------------------------------
    */

    return (
        <AuthenticatedLayout>

            <Head title="User Management" />

            <div className="min-h-screen bg-slate-100 pb-10">

                {/* ==========================================================
                    HERO
                ========================================================== */}

                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-violet-950">

                    <div className="px-5 py-8 lg:px-8">

                        {/* BACK */}

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
                        >
                            <ArrowLeft size={18} />

                            Back
                        </button>

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                            <div>

                                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400">

                                    <span>
                                        System
                                    </span>

                                    <span>
                                        /
                                    </span>

                                    <span className="text-violet-300">
                                        User Management
                                    </span>

                                </div>

                                <div className="flex items-start gap-4">

                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300 shadow-lg">

                                        <Shield size={27} />

                                    </div>

                                    <div>

                                        <h1 className="text-3xl font-bold tracking-tight text-white">
                                            User Management
                                        </h1>

                                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                            Manage system accounts,
                                            assign user roles,
                                            and maintain secure access
                                            to the SCT Barcode-Based
                                            Attendance System.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* ==================================================
                                ADD USER BUTTON
                            ================================================== */}

                            <button
                                type="button"
                                onClick={openAddUser}
                                className="inline-flex w-fit items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-400/30 active:scale-[0.98]"
                            >
                                <UserPlus size={18} />

                                Add New User
                            </button>

                        </div>

                    </div>

                </div>


                {/* ==========================================================
                    CONTENT
                ========================================================== */}

                <div className="mx-auto w-full max-w-[1600px] px-5 py-7 lg:px-8">


                    {/* ======================================================
                        FLASH SUCCESS
                    ====================================================== */}

                    {flash?.success && (

                        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                            {flash.success}
                        </div>

                    )}


                    {/* ======================================================
                        FLASH ERROR
                    ====================================================== */}

                    {flash?.error && (

                        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                            {flash.error}
                        </div>

                    )}


                    {/* ======================================================
                        SUMMARY
                    ====================================================== */}

                    <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-3">


                        {/* TOTAL */}

                        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                            <div className="relative flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-semibold text-slate-500">
                                        Total Users
                                    </p>

                                    <p className="mt-2 text-4xl font-bold text-slate-900">
                                        {summary.total ?? 0}
                                    </p>

                                    <p className="mt-2 text-xs text-slate-400">
                                        Registered system accounts
                                    </p>

                                </div>

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                                    <Users size={25} />
                                </div>

                            </div>

                            <div className="mt-5 h-1 w-full rounded-full bg-slate-100">

                                <div className="h-full w-2/3 rounded-full bg-violet-500" />

                            </div>

                        </div>


                        {/* ADMIN */}

                        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                            <div className="relative flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-semibold text-slate-500">
                                        Administrators
                                    </p>

                                    <p className="mt-2 text-4xl font-bold text-slate-900">
                                        {summary.admins ?? 0}
                                    </p>

                                    <p className="mt-2 text-xs text-slate-400">
                                        Administrative accounts
                                    </p>

                                </div>

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                    <ShieldCheck size={25} />
                                </div>

                            </div>

                            <div className="mt-5 h-1 w-full rounded-full bg-slate-100">

                                <div className="h-full w-1/2 rounded-full bg-emerald-500" />

                            </div>

                        </div>


                        {/* USERS */}

                        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                            <div className="relative flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-semibold text-slate-500">
                                        Regular Users
                                    </p>

                                    <p className="mt-2 text-4xl font-bold text-slate-900">
                                        {summary.users ?? 0}
                                    </p>

                                    <p className="mt-2 text-xs text-slate-400">
                                        Standard system accounts
                                    </p>

                                </div>

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                                    <UserRound size={25} />
                                </div>

                            </div>

                            <div className="mt-5 h-1 w-full rounded-full bg-slate-100">

                                <div className="h-full w-1/2 rounded-full bg-sky-500" />

                            </div>

                        </div>

                    </div>


                    {/* ======================================================
                        USER TABLE
                    ====================================================== */}

                    <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">


                        {/* HEADER */}

                        <div className="flex flex-col gap-5 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                                    <Users size={19} />
                                </div>

                                <div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        System Users
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        View and manage registered system accounts.
                                    </p>

                                </div>

                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600">

                                <div className="h-2 w-2 rounded-full bg-emerald-500" />

                                {users.length} account
                                {users.length !== 1 ? 's' : ''}

                            </div>

                        </div>


                        {/* ==================================================
                            FILTER
                        ================================================== */}

                        <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-4">

                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                                <div className="flex flex-col gap-3 sm:flex-row">

                                    {/* SEARCH */}

                                    <div className="relative w-full sm:w-72">

                                        <Search
                                            size={17}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setSearch(value);

                                                handleFilter(
                                                    'search',
                                                    value
                                                );

                                            }}
                                            placeholder="Search users..."
                                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                        />

                                    </div>


                                    {/* ROLE */}

                                    <div className="relative w-full sm:w-48">

                                        <SlidersHorizontal
                                            size={16}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <select
                                            value={role}
                                            onChange={(e) => {

                                                const value = e.target.value;

                                                setRole(value);

                                                handleFilter(
                                                    'role',
                                                    value
                                                );

                                            }}
                                            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                        >

                                            <option value="">
                                                All Roles
                                            </option>

                                            <option value="admin">
                                                Administrator
                                            </option>

                                            <option value="user">
                                                Regular User
                                            </option>

                                        </select>

                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                    </div>


                                    {/* RESET */}

                                    {(search || role) && (

                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                        >

                                            <RotateCcw size={15} />

                                            Reset

                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>


                        {/* ==================================================
                            TABLE
                        ================================================== */}

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[820px]">

                                <thead>

                                    <tr className="border-b border-slate-200 bg-slate-50">

                                        <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            User
                                        </th>

                                        <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Role
                                        </th>

                                        <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Created
                                        </th>

                                        <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {users.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="4"
                                                className="px-6 py-20 text-center"
                                            >

                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                                    <Users size={28} />
                                                </div>

                                                <h3 className="mt-4 text-sm font-bold text-slate-800">
                                                    No users found
                                                </h3>

                                                <p className="mt-2 text-xs text-slate-500">
                                                    No system accounts match your current search or filter.
                                                </p>

                                            </td>

                                        </tr>

                                    ) : (

                                        users.map((user) => {

                                            const roleInfo =
                                                getRole(user.role);

                                            const RoleIcon =
                                                roleInfo.icon;

                                            const isCurrentUser =
                                                auth?.user?.id === user.id;

                                            return (

                                                <tr
                                                    key={user.id}
                                                    className="group transition hover:bg-violet-50/40"
                                                >

                                                    {/* USER */}

                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-3.5">

                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-sm font-bold text-white">
                                                                {user.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase() || 'U'}
                                                            </div>

                                                            <div className="min-w-0">

                                                                <div className="flex items-center gap-2">

                                                                    <p className="truncate text-sm font-bold text-slate-900">
                                                                        {user.name}
                                                                    </p>

                                                                    {isCurrentUser && (

                                                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                                                                            YOU
                                                                        </span>

                                                                    )}

                                                                </div>

                                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">

                                                                    <Mail size={13} />

                                                                    <span>
                                                                        {user.email}
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* ROLE */}

                                                    <td className="px-6 py-4">

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${roleInfo.badge}`}
                                                        >

                                                            <RoleIcon size={13} />

                                                            {roleInfo.label}

                                                        </span>

                                                    </td>


                                                    {/* CREATED */}

                                                    <td className="px-6 py-4">

                                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">

                                                            <CalendarDays
                                                                size={15}
                                                                className="text-slate-400"
                                                            />

                                                            {formatDate(
                                                                user.created_at
                                                            )}

                                                        </div>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td className="px-6 py-4">

                                                        <div className="relative flex justify-end">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setOpenMenu(
                                                                        openMenu === user.id
                                                                            ? null
                                                                            : user.id
                                                                    )
                                                                }
                                                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                                                            >

                                                                <MoreHorizontal size={18} />

                                                            </button>


                                                            {openMenu === user.id && (

                                                                <div className="absolute right-0 top-11 z-[60] w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl">

                                                                    {/* EDIT */}

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            openEditUser(user)
                                                                        }
                                                                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                                                                    >

                                                                        <Pencil size={14} />

                                                                        Edit User

                                                                    </button>


                                                                    {/* DELETE */}

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            openDeleteUser(user)
                                                                        }
                                                                        disabled={isCurrentUser}
                                                                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition ${
                                                                            isCurrentUser
                                                                                ? 'cursor-not-allowed text-slate-300'
                                                                                : 'text-rose-600 hover:bg-rose-50'
                                                                        }`}
                                                                    >

                                                                        <Trash2 size={14} />

                                                                        Delete User

                                                                    </button>

                                                                </div>

                                                            )}

                                                        </div>

                                                    </td>

                                                </tr>

                                            );

                                        })

                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* FOOTER */}

                        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">

                            <span className="text-slate-500">

                                Showing{' '}

                                <strong className="font-bold text-slate-700">
                                    {users.length}
                                </strong>{' '}

                                user
                                {users.length !== 1 ? 's' : ''}

                            </span>

                            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">

                                <ShieldCheck
                                    size={14}
                                    className="text-violet-500"
                                />

                                SCT User Management

                            </div>

                        </div>

                    </div>

                </div>

{/* ==========================================================
    ADD USER MODAL
========================================================== */}

{showAddUser && (

    <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
        onClick={closeAddUser}
    >

        <div
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >

            {/* ======================================================
                MODAL HEADER
            ====================================================== */}

            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 px-7 py-6">

                {/* Decorative background */}

                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />

                <div className="absolute -bottom-12 left-1/3 h-28 w-28 rounded-full bg-violet-400/10 blur-2xl" />

                <div className="relative flex items-start justify-between">

                    <div className="flex items-center gap-4">

                        {/* ICON */}

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/15 text-violet-300 shadow-lg shadow-violet-950/30">

                            <UserPlus size={24} />

                        </div>

                        {/* TITLE */}

                        <div>

                            <div className="flex items-center gap-2">

                                <h2 className="text-xl font-bold tracking-tight text-white">
                                    Add New User
                                </h2>

                            </div>

                            <p className="mt-1 text-sm text-slate-400">
                                Create a new account for the SCT system.
                            </p>

                        </div>

                    </div>

                    {/* CLOSE */}

                    <button
                        type="button"
                        onClick={closeAddUser}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-4 focus:ring-violet-400/20"
                    >

                        <X size={19} />

                    </button>

                </div>

                {/* SECURITY INDICATOR */}

                <div className="relative mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-3.5 py-2.5">

                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">

                        <ShieldCheck size={14} />

                    </div>

                    <span className="text-[11px] font-medium text-slate-300">
                        Secure account creation
                    </span>

                    <div className="ml-auto flex items-center gap-1.5">

                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                            Protected
                        </span>

                    </div>

                </div>

            </div>


            {/* ======================================================
                FORM
            ====================================================== */}

            <form
                onSubmit={submitUser}
                className="max-h-[72vh] overflow-y-auto"
            >

                <div className="space-y-6 p-7">

                    {/* ==================================================
                        ACCOUNT INFORMATION
                    ================================================== */}

                    <div>

                        <div className="mb-4 flex items-center gap-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">

                                <UserRound size={16} />

                            </div>

                            <div>

                                <h3 className="text-sm font-bold text-slate-900">
                                    Account Information
                                </h3>

                                <p className="text-[11px] text-slate-400">
                                    Basic information for the new user.
                                </p>

                            </div>

                        </div>


                        {/* FULL NAME */}

                        <div>

                            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                Full Name
                            </label>

                            <div className="relative">

                                <UserRound
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={addData.name}
                                    onChange={(e) =>
                                        setAddData(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter user's full name"
                                    autoFocus
                                    className={`h-12 w-full rounded-xl border bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                        addErrors.name
                                            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                                            : 'border-slate-200 focus:border-violet-500 focus:ring-violet-100'
                                    }`}
                                />

                            </div>

                            {addErrors.name && (

                                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">

                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />

                                    {addErrors.name}

                                </div>

                            )}

                        </div>


                        {/* EMAIL */}

                        <div className="mt-4">

                            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                Email Address
                            </label>

                            <div className="relative">

                                <Mail
                                    size={17}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="email"
                                    value={addData.email}
                                    onChange={(e) =>
                                        setAddData(
                                            'email',
                                            e.target.value
                                        )
                                    }
                                    placeholder="user@example.com"
                                    className={`h-12 w-full rounded-xl border bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                        addErrors.email
                                            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                                            : 'border-slate-200 focus:border-violet-500 focus:ring-violet-100'
                                    }`}
                                />

                            </div>

                            {addErrors.email && (

                                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">

                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />

                                    {addErrors.email}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        ROLE & SECURITY
                    ================================================== */}

                    <div className="border-t border-slate-100 pt-6">

                        <div className="mb-4 flex items-center gap-3">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">

                                <ShieldCheck size={16} />

                            </div>

                            <div>

                                <h3 className="text-sm font-bold text-slate-900">
                                    Role & Security
                                </h3>

                                <p className="text-[11px] text-slate-400">
                                    Configure access and login credentials.
                                </p>

                            </div>

                        </div>


                        {/* ROLE */}

                        <div>

                            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                User Role
                            </label>

                            <div className="relative">

                                <Shield
                                    size={17}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <select
                                    value={addData.role}
                                    onChange={(e) =>
                                        setAddData(
                                            'role',
                                            e.target.value
                                        )
                                    }
                                    className={`h-12 w-full appearance-none rounded-xl border bg-slate-50 pl-11 pr-10 text-sm font-semibold text-slate-700 outline-none transition-all duration-200 focus:bg-white focus:ring-4 ${
                                        addErrors.role
                                            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                                            : 'border-slate-200 focus:border-violet-500 focus:ring-violet-100'
                                    }`}
                                >

                                    <option value="user">
                                        Regular User
                                    </option>

                                    <option value="admin">
                                        Administrator
                                    </option>

                                </select>

                                <ChevronDown
                                    size={17}
                                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                            </div>

                            {addErrors.role && (

                                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">

                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />

                                    {addErrors.role}

                                </div>

                            )}

                        </div>


                        {/* PASSWORD GRID */}

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {/* PASSWORD */}

                            <div>

                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Password
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="password"
                                        value={addData.password}
                                        onChange={(e) =>
                                            setAddData(
                                                'password',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Minimum 8 characters"
                                        className={`h-12 w-full rounded-xl border bg-slate-50 pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                            addErrors.password
                                                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                                                : 'border-slate-200 focus:border-violet-500 focus:ring-violet-100'
                                        }`}
                                    />

                                </div>

                                {addErrors.password && (

                                    <p className="mt-2 text-xs font-medium text-rose-600">
                                        {addErrors.password}
                                    </p>

                                )}

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div>

                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Confirm Password
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="password"
                                        value={addData.password_confirmation}
                                        onChange={(e) =>
                                            setAddData(
                                                'password_confirmation',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Repeat password"
                                        className={`h-12 w-full rounded-xl border bg-slate-50 pl-10 pr-3 text-sm font-medium text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                                            addErrors.password_confirmation
                                                ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                                                : 'border-slate-200 focus:border-violet-500 focus:ring-violet-100'
                                        }`}
                                    />

                                </div>

                                {addErrors.password_confirmation && (

                                    <p className="mt-2 text-xs font-medium text-rose-600">
                                        {addErrors.password_confirmation}
                                    </p>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* ======================================================
                    FOOTER
                ====================================================== */}

                <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-7 py-5 backdrop-blur">

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

                        {/* SECURITY NOTE */}

                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">

                            <Lock size={13} />

                            <span>
                                Password will be securely encrypted.
                            </span>

                        </div>


                        {/* ACTIONS */}

                        <div className="flex items-center justify-end gap-3">

                            <button
                                type="button"
                                onClick={closeAddUser}
                                disabled={addingUser}
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={addingUser}
                                className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:bg-violet-500 hover:shadow-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {addingUser ? (

                                    <>
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />

                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />

                                        </svg>

                                        Creating...

                                    </>

                                ) : (

                                    <>
                                        <UserPlus size={17} />

                                        Create User
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            </form>

        </div>

    </div>

)}

            
                {/* ==========================================================
                    EDIT USER MODAL
                ========================================================== */}

                {showEditUser && selectedUser && (

                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">

                        <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                            {/* HEADER */}

                            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                                        <Pencil size={20} />
                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-slate-900">
                                            Edit User
                                        </h2>

                                        <p className="text-xs text-slate-500">
                                            Update system account information.
                                        </p>

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={closeEditUser}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
                                >
                                    <X size={19} />
                                </button>

                            </div>


                            {/* FORM */}

                            <form
                                onSubmit={submitEditUser}
                                className="space-y-5 p-6"
                            >

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) =>
                                            setEditData(
                                                'name',
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                    />

                                    {editErrors.name && (

                                        <p className="mt-1 text-xs text-rose-600">
                                            {editErrors.name}
                                        </p>

                                    )}

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) =>
                                            setEditData(
                                                'email',
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                    />

                                    {editErrors.email && (

                                        <p className="mt-1 text-xs text-rose-600">
                                            {editErrors.email}
                                        </p>

                                    )}

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        User Role
                                    </label>

                                    <select
                                        value={editData.role}
                                        onChange={(e) =>
                                            setEditData(
                                                'role',
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                    >

                                        <option value="user">
                                            Regular User
                                        </option>

                                        <option value="admin">
                                            Administrator
                                        </option>

                                    </select>

                                    {editErrors.role && (

                                        <p className="mt-1 text-xs text-rose-600">
                                            {editErrors.role}
                                        </p>

                                    )}

                                </div>


                                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                                    <button
                                        type="button"
                                        onClick={closeEditUser}
                                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={updatingUser}
                                        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
                                    >
                                        {updatingUser
                                            ? 'Saving...'
                                            : 'Save Changes'}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* ==========================================================
                    DELETE CONFIRMATION
                ========================================================== */}

                {showDeleteUser && selectedUser && (

                    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">

                        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

                            <div className="p-6">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                                    <Trash2 size={22} />
                                </div>

                                <h2 className="mt-4 text-lg font-bold text-slate-900">
                                    Delete User?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Are you sure you want to delete
                                    <strong className="mx-1 text-slate-800">
                                        {selectedUser.name}
                                    </strong>
                                    ? This action cannot be undone.
                                </p>

                                <div className="mt-6 flex justify-end gap-3">

                                    <button
                                        type="button"
                                        onClick={closeDeleteUser}
                                        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={deleteUser}
                                        className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-500"
                                    >
                                        Delete User
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </AuthenticatedLayout>
    );
}