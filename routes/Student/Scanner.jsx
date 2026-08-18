import React, { useState, useEffect, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';

// Ang totalStudents, scannedStudent, at scannedValue ay galing sa StudentScannerController mo!
export default function Scanner({ totalStudents, scannedStudent, scannedValue }) {
    // 📨 Kinukuha nito ang mga alert messages (success o error) mula sa controller session
    const { flash } = usePage().props;
    const inputRef = useRef(null);

    // 📦 I-setup ang Inertia Form para sa pagpapadala ng barcode sa route post natin
    const { data, setData, post, processing, reset } = useForm({
        student_barcode: '',
    });

    // ⚡ AUTO-FOCUS FEATURE: Para kahit hindi hawakan ang mouse, laging nakatutok ang scanner sa input box
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [scannedStudent, flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Kung walang tinype o iscan, huwag ituloy ang pagpapadala
        if (!data.student_barcode.trim()) return;

        // Isasakay na ang data sa route post natin papuntang Controller
        post(route('scanner.scan'), {
            onSuccess: () => {
                reset('student_barcode'); // 🧼 LILINISIN ANG TEXT BOX PAGKATAPOS MAG-SCAN!
            },
            onError: () => {
                reset('student_barcode'); // 🧼 Lilinisin pa rin kahit may error para tuloy ang scan
            },
            preserveScroll: true
        });
    };

    return (
        <div className="p-10 max-w-xl mx-auto font-sans">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Student Barcode Scanner Dashboard</h2>
            <p className="text-base bg-gray-100 p-3 rounded-lg mb-6 text-gray-700">
                <strong>Total Students in Database:</strong> {totalStudents}
            </p>

            {/* FORM NG SCANNER */}
            <form onSubmit={handleSubmit} className="mb-6">
                <label htmlFor="barcode-input" className="block mb-2 font-bold text-gray-700">
                    I-scan ang Barcode o I-type ang Student ID:
                </label>
                <input
                    id="barcode-input"
                    ref={inputRef}
                    type="text"
                    value={data.student_barcode}
                    onChange={(e) => setData('student_barcode', e.target.value)}
                    disabled={processing}
                    placeholder="Mag-scan o mag-type dito..."
                    className="p-3 w-full text-base mb-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                />
                <button 
                    type="submit" 
                    disabled={processing} 
                    className="px-5 py-2.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-base disabled:opacity-50"
                >
                    {processing ? 'Processing...' : 'Submit Scan'}
                </button>
            </form>

            {/* NOTIFICATION ALERTS (FLASH MESSAGES) */}
            {flash?.success && <div className="text-emerald-700 p-3 bg-emerald-50 mb-4 rounded border border-emerald-200 font-semibold">✅ {flash.success}</div>}
            {flash?.error && <div className="text-rose-700 p-3 bg-rose-50 mb-4 rounded border border-rose-200 font-semibold">❌ {flash.error}</div>}

            {/* RESULTA NG ESTUDYANTE: Ginamitan na ng malinis na Tailwind CSS Card */}
            {scannedStudent ? (
                <div className="p-6 bg-emerald-600 text-white rounded-2xl shadow-xl text-center border border-emerald-500 transition-all duration-300">
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-75">🎓 Student Profile Found</h3>
                    
                    {/* Malaking Pangalan para sa Tailwind standard */}
                    <h1 className="text-3xl font-black mt-2 uppercase tracking-wide">
                        {scannedStudent.name}
                    </h1>

                    <div className="mt-4 pt-4 border-t border-emerald-500/50 flex justify-center space-x-6 text-sm font-semibold opacity-90">
                        <p><strong>ID:</strong> <span className="font-mono bg-emerald-700 px-2 py-0.5 rounded">{scannedStudent.id}</span></p>
                        <p><strong>Course:</strong> {scannedStudent.course}</p>
                        <p><strong>Year Level:</strong> {scannedStudent.year_level}</p>
                    </div>
                </div>
            ) : (
                <div className="text-gray-400 italic text-center mt-5 p-6 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                    Aantayin ang susunod na maiiscan...
                </div>
            )}
        </div>
    );
}
