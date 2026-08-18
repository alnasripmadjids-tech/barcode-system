import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react'; 

export default function AuthenticatedLayout({ header, children, activeTab, setActiveTab }) {
    const { props, url } = usePage();
    const user = props.auth?.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [logoHasError, setLogoHasError] = useState(false);

    const menuItems = [
        { id: 'scanner_dashboard', name: 'Dashboard', url: '/dashboard', icon: '📊' },
        { id: 'announcement', name: 'Announcement', url: '/announcements', icon: '📢' },
        { id: 'studentlist', name: 'Student List Record', url: '/studentlist', icon: '👥' },
        { id: 'attendance', name: 'Student Attendance Log', url: '/student-attendance', icon: '📝' },
        { id: 'grade', name: 'Student Grade Report', url: '/grade', icon: '🎓' },
        { id: 'user', name: 'User Management', url: '/user', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans antialiased">
            
            {/* MOBILE HEADER BAR */}
            <header className="md:hidden bg-blue-800 text-white p-4 flex items-center justify-between border-b border-blue-900 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <img src="/images/sct-logo.png" alt="SCT Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xs font-black tracking-wider text-yellow-400">SCT SYSTEM</span>
                </div>
                <button 
                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                    className="p-1 text-slate-200 hover:text-white text-xl"f
                >
                    {showingNavigationDropdown ? '❌' : '☰'}s
                </button>
            </header>

            {/* MOBILE DROPDOWN NAVIGATION */}
            {showingNavigationDropdown && (
                <nav className="md:hidden bg-blue-800 border-b border-blue-900 p-4 space-y-1 sticky top-16 z-40 transition-all">
                    {menuItems.map((item, index) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    setShowingNavigationDropdown(false);
                                    if (item.id === 'studentlist' || item.id === 'scanner_dashboard') {
                                        setActiveTab(item.id);
                                    } else {
                                        router.get(item.url);
                                    }
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition text-left ${
                                    isActive ? 'bg-white text-blue-800 font-black' : 'text-blue-100 hover:bg-blue-700'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span> {item.name}
                            </button>
                        );
                    })}
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-300 hover:bg-rose-600/20 rounded-xl text-left"
                    >
                        <span className="text-lg">🚪</span> Log Out
                    </Link>
                </nav>
            )}
            
            {/* SIDEBAR FOR DESKTOP */}
            <aside className="flex w-64 bg-blue-800 text-white flex-col border-r border-blue-900 h-screen sticky top-0 shrink-0">
                
                {/* THESIS PROPOSED TITLE MARQUEE BANNER */}
                <div className="bg-blue-900 py-3 px-2 border-b border-blue-900 overflow-hidden shrink-0">
                    <marquee 
                        behavior="scroll" 
                        direction="left" 
                        scrollamount="4" 
                        className="text-[10px] font-black tracking-wider text-yellow-400 uppercase block select-none"
                    >
                        THE PROPOSED BARCODE AND GLOBE TATTOO BASED AUTOMATION OF THE INTEGRATED STUDENT INFORMATION SYSTEM AT SULU COLLEGE OF TECHNOLOGY INC.
                    </marquee>
                </div>

                {/* Institution Profile & Logo Area */}
                <div className="p-6 border-b border-blue-900 bg-blue-900/30 flex flex-col items-center text-center pt-8 pb-8 shrink-0">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-400 overflow-hidden ring-4 ring-yellow-400/20 transition-all">
                        {!logoHasError ? (
                            <img
                               src="/images/sct-logo.png"
                               alt="sulu college of technology Logo"
                               className="w-full h-full object-contain p-2"
                               onError={() => setLogoHasError(true)}
                           />
                         ) : (
                             <span className="text-slate-800 text-4xl font-black">SCT</span>
                         )}    
                    </div>
                    
                    <span className="text-[10px] font-black tracking-widest text-yellow-400 uppercase border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 rounded shadow-sm mt-4">
                        {user?.name && !user.name.toString().includes('NaN') ? user.name : "SYSTEM ADMINISTRATOR"}
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
    {menuItems.map((item) => {
        const isActive = url === item.url;

        return (
            <Link
                key={item.url}
                href={item.url}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition duration-200 text-left ${
                    isActive
                        ? 'bg-white text-blue-800 shadow-md font-black'
                        : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                }`}
            >
                <span className="text-lg">{item.icon}</span>
                {item.name}
            </Link>
        );
    })}
</nav>
                {/* Log Out Section */}
                <div className="p-4 border-t border-blue-900 bg-blue-900 shrink-0">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-300 hover:bg-rose-600/20 rounded-xl text-left transition duration-200"
                    >
                        <span className="text-lg">🚪</span> (Log Out)
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                {header && (
                    <header className="bg-white shadow shrink-0">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>

        </div>
    );
}  
