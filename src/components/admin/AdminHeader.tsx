import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  LogOut,
  Globe,
  Menu,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { StudentAvatar } from '../common/StudentAvatar';

export const AdminHeader: React.FC<{ title?: string; onMenuClick?: () => void; sidebarOpen?: boolean }> = ({ title = 'ThinkAHead Admin', onMenuClick, sidebarOpen }) => {
  const { logout,
    theme,
    currentUser,
    notifications,
    markNotificationAsRead,
    switchToRole,
    setCurrentView
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationRef.current && !notificationRef.current.contains(target)) setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setProfileDropdownOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      id="admin-header"
      className={`min-h-20 py-3 px-6 border-b flex items-center justify-between sticky top-0 z-30 transition-colors ${
        theme === 'dark'
          ? 'bg-[#090d1a]/95 backdrop-blur-md border-slate-800 text-white'
          : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800'
      }`}
    >
      {/* Title & Quick Status */}
      <div className="flex items-center gap-3 min-w-0">
        {!sidebarOpen && (
          <button onClick={onMenuClick} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0" aria-label="Open admin sidebar">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center min-w-0">
          <h2 className="text-sm sm:text-base font-extrabold tracking-tight truncate">{title}</h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Public Website Button */}
        <button
          onClick={() => setCurrentView('landing')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span>View Public Site</span>
        </button>

        <ThemeToggle />

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileDropdownOpen(false);
            }}
            className={`relative p-2 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              className={`absolute right-0 mt-2 w-80 rounded-2xl p-3 shadow-2xl border backdrop-blur-xl z-50 ${
                theme === 'dark'
                  ? 'bg-slate-900/98 border-slate-700 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  System Alerts
                </span>
                <span className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold">
                  {unreadCount} pending
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                      n.read
                        ? 'opacity-60 bg-transparent'
                        : theme === 'dark'
                        ? 'bg-slate-800/80 border border-rose-500/20'
                        : 'bg-rose-50/70 border border-rose-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{n.title}</span>
                      <span className="text-[9px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center justify-center rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            aria-label="Open profile menu"
            title="Open profile menu"
          >
            <span className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-1 ring-slate-300/40 dark:ring-slate-700 hover:ring-cyan-400/70 transition-all">
              <StudentAvatar name={currentUser?.name} avatar={currentUser?.avatar} className="w-full h-full rounded-full object-cover" />
            </span>
          </button>

          {profileDropdownOpen && (
            <div
              className={`absolute right-0 mt-3 w-56 rounded-2xl p-2 shadow-2xl border backdrop-blur-xl z-50 ${
                theme === 'dark'
                  ? 'bg-slate-900/98 border-slate-700 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="p-2 border-b border-slate-200 dark:border-slate-700/60 mb-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser?.email}</div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setCurrentView('admin-profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => {
                    switchToRole('student');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Switch to Student View</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 mt-1 pt-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

  );
};