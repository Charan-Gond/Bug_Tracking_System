import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Bug,
  LogOut,
  User,
  Menu
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FolderKanban, label: 'Projects', path: '/projects' },
    { icon: Bug, label: 'Bugs', path: '/bugs' },
    // { icon: User, label: 'Users', path: '/users' }, // Admin only?
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <Bug className="w-8 h-8 text-blue-500 mr-3" />
            <span className="text-xl font-bold text-white tracking-tight">BugTracker</span>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => clsx(
                  "flex items-center px-4 py-3 rounded-lg transition-colors group",
                  isActive
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
                onClick={() => window.innerWidth < 768 && toggleSidebar()}
              >
                <item.icon size={20} className="mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold mr-3">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role || 'Developer'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
