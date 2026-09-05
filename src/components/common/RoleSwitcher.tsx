import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Globe,
  Sparkles,
  PlayCircle,
  Award,
  CreditCard,
  ChevronDown,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from './ThemeToggle';

export const RoleSwitcher: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    switchToRole,
    theme,
    setSelectedCourseId
  } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      {/* Floating Demo Bar */}
      <div
        className={`flex items-center gap-1.5 p-1.5 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-slate-900/90 border-indigo-500/30 text-white shadow-indigo-950/50'
            : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300'
        }`}
      >
        <ThemeToggle />

        <div className="h-5 w-px bg-slate-700/40" />

        {/* Fast Switch Buttons */}
        <button
          onClick={() => {
            setCurrentView('landing');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentView === 'landing'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'
          }`}
          title="Visit Public Landing Page"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Landing</span>
        </button>

        <button
          onClick={() => {
            switchToRole('student');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentView.startsWith('student-') && currentView !== 'student-player'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'
          }`}
          title="Switch to Student Dashboard"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Student</span>
        </button>

        <button
          onClick={() => {
            setSelectedCourseId('course-1');
            setCurrentView('student-player');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentView === 'student-player'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'
          }`}
          title="Open Course Player (Videos, Notes, Quizzes)"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Course Player</span>
        </button>

        <button
          onClick={() => {
            switchToRole('admin');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            currentView.startsWith('admin-')
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'hover:bg-slate-800/40 text-slate-400 hover:text-white'
          }`}
          title="Switch to Admin Panel"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">Admin Panel</span>
        </button>

        {/* View Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1.5 rounded-xl text-xs font-medium flex items-center gap-1 ${
              theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {isOpen && (
            <div
              className={`absolute bottom-full right-0 mb-2 w-64 rounded-2xl p-2 shadow-2xl border backdrop-blur-xl ${
                theme === 'dark'
                  ? 'bg-slate-900/95 border-slate-700 text-slate-200'
                  : 'bg-white/98 border-slate-200 text-slate-800'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 text-slate-400">
                Jump to specific UI view
              </div>
              <div className="space-y-1 max-h-72 overflow-y-auto">
                <div className="text-[10px] font-semibold text-blue-400 px-2 pt-1">Authentication Pages</div>
                <button
                  onClick={() => { setCurrentView('auth-login'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-blue-600/20 hover:text-blue-400 flex items-center justify-between"
                >
                  <span>1. Login Screen</span>
                </button>
                <button
                  onClick={() => { setCurrentView('auth-register'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-blue-600/20 hover:text-blue-400 flex items-center justify-between"
                >
                  <span>2. Register Screen</span>
                </button>
                <button
                  onClick={() => { setCurrentView('auth-forgot'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-blue-600/20 hover:text-blue-400 flex items-center justify-between"
                >
                  <span>3. Forgot Password</span>
                </button>
                <button
                  onClick={() => { setCurrentView('auth-verify'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-blue-600/20 hover:text-blue-400 flex items-center justify-between"
                >
                  <span>4. Email Verification</span>
                </button>
                <button
                  onClick={() => { setCurrentView('auth-reset'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-blue-600/20 hover:text-blue-400 flex items-center justify-between"
                >
                  <span>5. Reset Password</span>
                </button>

                <div className="text-[10px] font-semibold text-indigo-400 px-2 pt-2 border-t border-slate-700/50">Student Portal Pages</div>
                <button
                  onClick={() => { setCurrentView('student-dashboard'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-indigo-600/20 hover:text-indigo-400"
                >
                  Student Dashboard
                </button>
                <button
                  onClick={() => { setCurrentView('student-my-learning'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-indigo-600/20 hover:text-indigo-400"
                >
                  My Learning
                </button>
                <button
                  onClick={() => { setCurrentView('student-all-courses'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-indigo-600/20 hover:text-indigo-400"
                >
                  All 22 Courses
                </button>
                <button
                  onClick={() => { setCurrentView('student-certificates'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-indigo-600/20 hover:text-indigo-400 flex items-center gap-1"
                >
                  <Award className="w-3 h-3 text-amber-400" />
                  Certificates (Earned & Locked)
                </button>
                <button
                  onClick={() => { setCurrentView('student-subscription'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-indigo-600/20 hover:text-indigo-400 flex items-center gap-1"
                >
                  <CreditCard className="w-3 h-3 text-emerald-400" />
                  Annual Subscription & Monthly Unlock
                </button>

                <div className="text-[10px] font-semibold text-amber-400 px-2 pt-2 border-t border-slate-700/50">Admin Panel</div>
                <button
                  onClick={() => { setCurrentView('admin-dashboard'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-amber-600/20 hover:text-amber-400"
                >
                  Admin Analytics & Revenue
                </button>
                <button
                  onClick={() => { setCurrentView('admin-students'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-amber-600/20 hover:text-amber-400"
                >
                  Manage Students
                </button>
                <button
                  onClick={() => { setCurrentView('admin-courses'); setIsOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded-lg text-xs hover:bg-amber-600/20 hover:text-amber-400"
                >
                  Course & Content Editor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
