import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center h-16 px-4 border-b border-gray-800 bg-gray-900">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-400 hover:text-white p-2"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 text-lg font-bold text-white">BugTracker</span>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
