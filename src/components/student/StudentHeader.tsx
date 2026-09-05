import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Sparkles,
  User,
  LogOut,
  ShieldCheck,
  CreditCard,
  Award,
  Menu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from '../common/ThemeToggle';

import { StudentAvatar } from '../common/StudentAvatar';

export const StudentHeader: React.FC<{ title?: string; onMenuClick?: () => void; sidebarOpen?: boolean }> = ({ title = 'Student Dashboard', onMenuClick, sidebarOpen }) => {
  const { logout,
    theme,
    currentUser,
    switchToRole,
    notifications,
    markNotificationAsRead,
    setCurrentView,
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
      id="student-header"
      className={`min-h-20 py-3 px-6 border-b flex items-center justify-between sticky top-0 z-30 transition-colors ${
        theme === 'dark'
          ? 'bg-[#0a0f1d]/90 backdrop-blur-md border-slate-800 text-white'
          : 'bg-white/90 backdrop-blur-md border-slate-200 text-slate-800'
      }`}
    >
      {/* Dashboard title */}
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button onClick={onMenuClick} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Open sidebar" title="Open sidebar">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm sm:text-base font-extrabold tracking-tight hidden md:block truncate">ThinkAHead Learning</h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => switchToRole('admin')}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-[10px] sm:text-xs font-bold hover:bg-indigo-500/20 transition-colors"
            title="Return to Admin Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>
        )}
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
            aria-label="View Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
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
                  Notifications
                </span>
                <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold">
                  {unreadCount} unread
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
                        ? 'bg-slate-800/80 border border-indigo-500/20'
                        : 'bg-indigo-50/70 border border-indigo-100'
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

        {/* User Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center justify-center rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500/40" 
          >
            <StudentAvatar name={currentUser?.name} avatar={currentUser?.avatar} className="w-10 h-10 rounded-full object-cover" />
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
                    setCurrentView('student-profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('student-certificates');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>My Certificates</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('student-subscription');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>Manage Subscription</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 mt-1 pt-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
