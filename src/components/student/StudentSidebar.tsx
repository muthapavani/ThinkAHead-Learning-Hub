import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  Award,
  Settings,
  HelpCircle,
  Bell,
  Crown,
  LogOut,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { AppView } from '../../types';

import { StudentAvatar } from '../common/StudentAvatar';

export const StudentSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { logout, currentView, setCurrentView, currentUser, theme, setCheckoutModalOpen } = useApp();

  const navItems: { label: string; view: AppView; icon: React.ReactNode; badge?: string }[] = [
    {
      label: 'Dashboard',
      view: 'student-dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      label: 'My Learning',
      view: 'student-my-learning',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      label: 'All Courses',
      view: 'student-all-courses',
      icon: <Compass className="w-4 h-4" />
    },
    {
      label: 'Certificates',
      view: 'student-certificates',
      icon: <Award className="w-4 h-4" />
    },
    {
      label: 'Notifications',
      view: 'student-notifications',
      icon: <Bell className="w-4 h-4" />
    },
    {
      label: 'Settings',
      view: 'student-settings',
      icon: <Settings className="w-4 h-4" />
    },
    {
      label: 'Help & Support',
      view: 'student-help',
      icon: <HelpCircle className="w-4 h-4" />
    }
  ];

  return (
    <>
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />
      <aside
        id="student-sidebar"
        className={`shrink-0 flex flex-col justify-between border-r overflow-hidden transition-none
          ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
          md:relative md:translate-x-0 md:h-screen md:sticky md:top-0
          max-md:fixed max-md:left-0 max-md:top-0 max-md:z-50 max-md:h-screen max-md:w-[min(86vw,320px)]
          ${theme === 'dark' ? 'bg-[#090d1a] border-slate-800 text-slate-300 shadow-2xl' : 'bg-white border-slate-200 text-slate-700 shadow-2xl'}`}
      >
      {/* Brand Header */}
      <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${theme === 'dark' ? 'border-slate-800/60' : 'border-slate-200'}`}>
        <div onClick={() => setCurrentView('student-dashboard')} className="cursor-pointer relative z-20 transition-transform duration-300 ease-out hover:scale-[1.08] hover:-translate-y-0.5">
          <Logo size="sm" theme={theme} />
        </div>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Close sidebar" title="Close sidebar">
          <X className="w-5 h-5" />
        </button>

      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => { setCurrentView(item.view); if (window.innerWidth < 768) onClose(); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 text-white shadow-md shadow-cyan-600/30 font-bold'
                  : theme === 'dark' ? 'hover:bg-slate-800/70 hover:text-white text-slate-400' : 'hover:bg-slate-100 hover:text-slate-900 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className={`transition-opacity whitespace-nowrap`}>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badge === '3'
                      ? 'bg-blue-500 text-white'
                      : isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-500/20 text-indigo-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Annual Membership Card — only shown to students who don't already have an active membership */}
      {!currentUser?.subscription?.active && (
        <div className="p-3">
          <div
            className={`p-4 rounded-2xl border relative overflow-hidden transition-all ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-[#111827] via-[#172554] to-[#0f172a] border-indigo-400/30 text-white shadow-lg shadow-indigo-950/30'
                : 'bg-white border-slate-200 text-slate-900 shadow-md shadow-slate-200/70'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Annual Membership</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Unlock the complete capability curriculum with one annual membership, plus certificates and premium benefits.
            </p>
            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="mt-3 w-full py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:via-orange-400 hover:to-rose-400 shadow-lg shadow-orange-900/30 transition-all text-center block"
            >
              View Annual Plan
            </button>
          </div>
        </div>
      )}

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/60">
        <div
          className={`flex items-center justify-between p-2 rounded-xl ${
            theme === 'dark' ? 'bg-slate-900/80 border border-slate-800/80' : 'bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <StudentAvatar name={currentUser?.name} avatar={currentUser?.avatar} className="w-8 h-8 rounded-full object-cover border border-indigo-500/40" />
            <div className="min-w-0">
              <div className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{currentUser?.name || 'Learner'}</div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 capitalize font-medium">
                Student
              </div>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
            title="Log Out / Back to Home"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};

