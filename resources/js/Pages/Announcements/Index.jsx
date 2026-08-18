import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({
    auth,
    announcements = [],
    students = [],
}) {
    // IMPORTANT:
    // Walang default selection pag unang bukas.
    const [sendMode, setSendMode] = useState(null);
    const [selectedParents, setSelectedParents] = useState([]);
    const [search, setSearch] = useState('');

    const { data, setData, post, processing } = useForm({
        message: '',
        recipients: [],
    });

    const parentContacts = useMemo(() => {
        return students
            .filter((student) => student.parent_contact)
            .map((student) => ({
                id: student.id,
                phone: student.parent_contact,
                studentName: [
                    student.first_name,
                    student.middle_name,
                    student.last_name,
                ]
                    .filter(Boolean)
                    .join(' '),
            }));
    }, [students]);

    const filteredParents = parentContacts.filter((parent) => {
        const value = search.toLowerCase();

        return (
            parent.studentName.toLowerCase().includes(value) ||
            parent.phone.toLowerCase().includes(value)
        );
    });

    /*
    |--------------------------------------------------------------------------
    | ALL PARENTS
    |--------------------------------------------------------------------------
    | First click  = select all
    | Second click = remove all
    */
    const handleAllParents = () => {
        if (sendMode === 'all') {
            setSendMode(null);
            setSelectedParents([]);
            return;
        }

        setSendMode('all');
        setSelectedParents(parentContacts.map((parent) => parent.id));
    };

    /*
    |--------------------------------------------------------------------------
    | SELECTED PARENTS MODE
    |--------------------------------------------------------------------------
    */
    const handleSelectedMode = () => {
        if (sendMode === 'selected') {
            setSendMode(null);
            setSelectedParents([]);
            return;
        }

        setSendMode('selected');
        setSelectedParents([]);
    };

    /*
    |--------------------------------------------------------------------------
    | INDIVIDUAL PARENT TOGGLE
    |--------------------------------------------------------------------------
    */
    const toggleParent = (id) => {
        // Kapag All Parents ang mode at pinindot ang isang contact,
        // lilipat tayo sa Selected Parents mode.
        if (sendMode === 'all') {
            setSendMode('selected');

            setSelectedParents((current) =>
                current.filter((item) => item !== id)
            );

            return;
        }

        setSendMode('selected');

        setSelectedParents((current) => {
            if (current.includes(id)) {
                return current.filter((item) => item !== id);
            }

            return [...current, id];
        });
    };

    /*
    |--------------------------------------------------------------------------
    | SELECT ALL TOGGLE
    |--------------------------------------------------------------------------
    */
    const selectAll = () => {
        const allIds = parentContacts.map((parent) => parent.id);

        const allAlreadySelected =
            allIds.length > 0 &&
            allIds.every((id) => selectedParents.includes(id));

        if (allAlreadySelected) {
            setSelectedParents([]);
            setSendMode('selected');
        } else {
            setSelectedParents(allIds);
            setSendMode('selected');
        }
    };

    /*
    |--------------------------------------------------------------------------
    | CLEAR
    |--------------------------------------------------------------------------
    */
    const clearSelection = () => {
        setSelectedParents([]);
        setSendMode(null);
    };

    /*
    |--------------------------------------------------------------------------
    | SEND
    |--------------------------------------------------------------------------
    */
    const handleSend = (e) => {
        e.preventDefault();

        if (!sendMode) {
            alert('Please select All Parents or Selected Parents.');
            return;
        }

        if (!data.message.trim()) {
            alert('Please enter an announcement message.');
            return;
        }

        if (sendMode === 'selected' && selectedParents.length === 0) {
            alert('Please select at least one parent contact.');
            return;
        }

        const recipients =
            sendMode === 'all'
                ? parentContacts.map((parent) => parent.id)
                : selectedParents;

        setData('recipients', recipients);

        post('/announcements', {
            message: data.message,
            recipients,
        });
    };

    const recipientCount =
        sendMode === 'all'
            ? parentContacts.length
            : selectedParents.length;

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Parent Announcement" />

            <div className="min-h-screen bg-slate-100">
                <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">

                    {/* =====================================================
                        PAGE BANNER
                    ====================================================== */}
                    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 px-6 py-8 shadow-xl sm:px-8">

                        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />

                        <div className="absolute -right-24 bottom-[-80px] h-64 w-64 rounded-full bg-white/5" />

                        <div className="relative">
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                Parent Announcement
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm text-blue-100">
                                Send important announcements directly to registered
                                parent contacts.
                            </p>
                        </div>
                    </section>


                    {/* =====================================================
                        SEND ANNOUNCEMENT
                    ====================================================== */}
                    <form
                        onSubmit={handleSend}
                        className="mx-auto mt-6 max-w-6xl"
                    >

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

                            {/* HEADER */}
                            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-7">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl">
                                        📤
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-black text-slate-800">
                                            Send Announcement
                                        </h2>

                                        <p className="text-xs text-slate-500">
                                            Choose recipients and write your announcement.
                                        </p>
                                    </div>

                                </div>
                            </div>


                            {/* TWO COLUMNS */}
                            <div className="grid grid-cols-1 lg:grid-cols-2">

                                {/* =================================================
                                    LEFT — RECIPIENTS
                                ================================================== */}
                                <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r sm:p-7">

                                    <label className="mb-3 block text-xs font-black uppercase tracking-wider text-slate-700">
                                        Send Announcement To
                                    </label>


                                    {/* SEND MODE */}
                                    <div className="grid grid-cols-2 gap-3">

                                        {/* ALL PARENTS */}
                                        <button
                                            type="button"
                                            onClick={handleAllParents}
                                            className={`rounded-xl border-2 p-4 text-left transition ${
                                                sendMode === 'all'
                                                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                                                    : 'border-slate-200 bg-white hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">

                                                <div
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                                        sendMode === 'all'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    👥
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-slate-800">
                                                        All Parents
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                                        Send to all contacts
                                                    </p>
                                                </div>

                                            </div>
                                        </button>


                                        {/* SELECTED PARENTS */}
                                        <button
                                            type="button"
                                            onClick={handleSelectedMode}
                                            className={`rounded-xl border-2 p-4 text-left transition ${
                                                sendMode === 'selected'
                                                    ? 'border-blue-600 bg-blue-50 shadow-sm'
                                                    : 'border-slate-200 bg-white hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">

                                                <div
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                                        sendMode === 'selected'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    ☑️
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-slate-800">
                                                        Selected Parents
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                                        Choose contacts
                                                    </p>
                                                </div>

                                            </div>
                                        </button>

                                    </div>


                                    {/* =================================================
                                        CONTACT LIST
                                    ================================================== */}
                                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50">

                                        <div className="border-b border-slate-200 px-4 py-4">

                                            <div className="flex items-center justify-between gap-3">

                                                <div>
                                                    <h3 className="text-sm font-black text-slate-800">
                                                        📱 Parent Contacts
                                                    </h3>

                                                    <p className="mt-1 text-[11px] text-slate-500">
                                                        Select contacts by student name.
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 gap-1.5">

                                                    <button
                                                        type="button"
                                                        onClick={selectAll}
                                                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-blue-700"
                                                    >
                                                        {parentContacts.length > 0 &&
                                                        parentContacts.every((parent) =>
                                                            selectedParents.includes(parent.id)
                                                        )
                                                            ? 'Clear All'
                                                            : 'Select All'}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={clearSelection}
                                                        className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100"
                                                    >
                                                        Clear
                                                    </button>

                                                </div>

                                            </div>


                                            {/* SEARCH */}
                                            <div className="relative mt-3">

                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                                                    🔍
                                                </span>

                                                <input
                                                    type="text"
                                                    value={search}
                                                    onChange={(e) =>
                                                        setSearch(e.target.value)
                                                    }
                                                    placeholder="Search student or phone..."
                                                    className="w-full rounded-xl border-slate-300 bg-white py-2.5 pl-9 pr-3 text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />

                                            </div>


                                            <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-500">

                                                <span>
                                                    {selectedParents.length} selected
                                                </span>

                                                <span>
                                                    {parentContacts.length} contacts
                                                </span>

                                            </div>

                                        </div>


                                        {/* CONTACTS */}
                                        <div className="max-h-64 space-y-2 overflow-y-auto p-3">

                                            {filteredParents.length === 0 ? (

                                                <div className="py-8 text-center">

                                                    <div className="text-3xl">
                                                        📱
                                                    </div>

                                                    <p className="mt-2 text-xs font-bold text-slate-500">
                                                        No parent contacts found.
                                                    </p>

                                                </div>

                                            ) : (

                                                filteredParents.map((parent) => {

                                                    const selected =
                                                        selectedParents.includes(parent.id);

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={parent.id}
                                                            onClick={() =>
                                                                toggleParent(parent.id)
                                                            }
                                                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                                                                selected
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-slate-200 bg-white hover:border-blue-300'
                                                            }`}
                                                        >

                                                            {/* CHECKBOX */}
                                                            <div
                                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs ${
                                                                    selected
                                                                        ? 'border-blue-600 bg-blue-600 text-white'
                                                                        : 'border-slate-300 bg-white'
                                                                }`}
                                                            >
                                                                {selected && '✓'}
                                                            </div>


                                                            {/* PHONE ICON */}
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-base">
                                                                📱
                                                            </div>


                                                            {/* CONTACT DATA */}
                                                            <div className="min-w-0 flex-1">

                                                                <p className="truncate text-sm font-black text-slate-800">
                                                                    {parent.phone}
                                                                </p>

                                                                <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500">
                                                                    🎓 {parent.studentName}
                                                                </p>

                                                            </div>

                                                        </button>
                                                    );
                                                })
                                            )}

                                        </div>
                                    </div>

                                </div>


                                {/* =================================================
                                    RIGHT — MESSAGE
                                ================================================== */}
                                <div className="flex flex-col p-6 sm:p-7">

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-xs font-black uppercase tracking-wider text-slate-700"
                                        >
                                            Announcement Message
                                        </label>
                                    </div>


                                    {/* MESSAGE */}
                                    <textarea
                                        id="message"
                                        rows="5"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData('message', e.target.value)
                                        }
                                        placeholder="Type your announcement message here..."
                                        className="mt-3 w-full resize-none rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm text-slate-800 shadow-sm transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />


                                    {/* CHARACTER COUNT */}
                                    <div className="mt-2 flex justify-end text-[11px] text-slate-400">
                                        <span className="font-semibold">
                                            {data.message.length} characters
                                        </span>
                                    </div>


                                    {/* SUMMARY */}
                                    {sendMode && (
                                        <div className="mt-5 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-base">
                                                    📱
                                                </div>

                                                <div className="min-w-0">

                                                    <p className="text-xs font-black text-slate-800">
                                                        {sendMode === 'all'
                                                            ? `Sending to ${recipientCount} registered parent contact(s)`
                                                            : `Sending to ${recipientCount} selected parent(s)`}
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                                        Please review your message before sending.
                                                    </p>

                                                </div>

                                            </div>

                                        </div>
                                    )}


                                    {/* SEND BUTTON */}
                                    <div className="mt-5 flex justify-end">

                                        <button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                !sendMode ||
                                                !data.message.trim() ||
                                                (sendMode === 'selected' &&
                                                    selectedParents.length === 0)
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-xs font-black uppercase tracking-wide text-white shadow-md shadow-blue-200 transition hover:bg-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            <span className="text-base">
                                                📱
                                            </span>

                                            {processing
                                                ? 'Sending...'
                                                : 'Send Announcement'}

                                        </button>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </form>


                    {/* =====================================================
                        ANNOUNCEMENT HISTORY
                    ====================================================== */}
                    <section className="mx-auto mt-6 max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-7">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl">
                                    🕘
                                </div>

                                <div>

                                    <h2 className="text-lg font-black text-slate-800">
                                        Announcement History
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Previous announcements sent by the administrator.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="p-6 sm:p-7">

                            {announcements.length === 0 ? (

                                <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">

                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                                        📢
                                    </div>

                                    <p className="mt-3 text-sm font-black text-slate-600">
                                        No announcements yet.
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Your sent announcements will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {announcements.map((announcement) => (

                                        <div
                                            key={announcement.id}
                                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
                                        >

                                            <div className="flex gap-3">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg">
                                                    📢
                                                </div>

                                                <div className="min-w-0 flex-1">

                                                    <p className="text-sm leading-6 text-slate-700">
                                                        {announcement.message}
                                                    </p>

                                                    <div className="mt-2">

                                                        <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                                                            Status: {announcement.status}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>
                            )}

                        </div>
                    </section>

                </main>
            </div>
        </AuthenticatedLayout>
    );
}

