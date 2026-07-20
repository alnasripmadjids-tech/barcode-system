import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react'; // ✔️ Tama ang pag-import ng router para sa Inertia POST request
import { useState, useEffect, useRef } from 'react'; 

// 1. Dito natin tinanggap ang apat na data (props) na ipinadala ng Laravel web.php kanina
export default function Dashboard({ auth, totalStudents, sCannerToday, smsGatewayStutatus, smsAllertsToday }) {
    const [barcode, setBarcode] = useState('');
    const inputRef = useRef(null); 

    // 2. ANG FUNCTION: Taga-baba at taga-padala ng barcode mula Frontend papuntang Backend
    const handleVerifyStudent = (e) => {
        e.preventDefault(); // Pinipigilan ang pag-refresh ng buong page tuwing may mag-i-scan

        if (!barcode.trim()) {
            alert('Mangyaring mag-scan o mag-type muna ng Barcode!');
            return;
        }

        // Ibibiyahe ang barcode gamit ang POST request papunta sa /verify-student URL ng Laravel
        router.post('/verify-student', {
            student_barcode: barcode
        }, {
            onSuccess: () => {
                setBarcode(''); // Nililinis ang input box para handa agad sa susunod na estudyante
            }
        });
    };

    // 3. Logic para sa awtomatikong pag-focus ng cursor sa input box ng barcode scanner hardware
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }

        const handleGlobalClick = () => {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 3000); 
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    // 4. ANG RETURN BLOCK: Dito lang sa loob nito pwedeng isulat ang lahat ng HTML/JSX layouts mo
    return (
        <AuthenticatedLayout header={null}>
            <Head title="SIS Dashboard" />

            <div className="py-12 bg-slate-50 min-h-screen flex flex-col items-center justify-start px-4">
                
                <div className="w-full max-w-4xl space-y-8 flex flex-col items-center">
                    
                    {/* STUDENT BARCODE SCANNER INPUT AREA */}
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 w-full text-center">
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                            👤 Scan Student ID Barcode (Attendance / Query)
                        </h3>
                        
                        {/* ✔️ TAMA: Nakabalot sa <form> at tinatawag ang onSubmit handler. Inayos din ang flex layout at max width class */}
                        <form onSubmit={handleVerifyStudent} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                            <input 
                                ref={inputRef} 
                                type="text" 
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)} // ✔️ TAMA: Isinara gamit ang }) bago ang placeholder
                                placeholder="Scan Student ID Barcode here..." 
                                className="flex-1 bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-4 outline-none transition-all font-mono text-center"
                                autoFocus
                                autoComplete="off" 
                            />
                            {/* ✔️ TAMA: Inayos ang typo mula sa 'botton' papuntang 'button' na may tamang submit type */}
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-xl transition shadow-md text-sm whitespace-nowrap">
                                Verify Student
                            </button>
                        </form>

                    </div>

                    {/* DYNAMIC AUTOMATION STATS CARDS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        
                        {/* Card 1: Total Enrolled */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between items-center text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Students</p>
                            <p className="text-3xl font-black text-slate-800 mt-2">
                                {totalStudents ? totalStudents.toLocaleString() : 0}
                            </p>
                        </div>

                        {/* Card 2: Scanned Attendance */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between items-center text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scanned Attendance Today</p>
                            <p className="text-3xl font-black text-blue-600 mt-2">{sCannerToday || 0}</p>
                        </div>
                    
                        {/* Card 3: Globe Tattoo SMS Gateway Status */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between items-center text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Globe Tattoo SMS Gateway</p>
                            <div className="flex items-center gap-2 mt-3 justify-center">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-sm font-bold text-green-700 uppercase tracking-wide">
                                    {smsGatewayStutatus || 'Disconnected'}
                                </span>
                            </div>
                        </div>

                        {/* Card 4: SMS Alerts Sent Today */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between items-center text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">SMS Alerts Sent Today</p>
                            <p className="text-3xl font-black text-indigo-600 mt-2">{smsAllertsToday || 0}</p>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
