import React from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Award,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';
import { Logo } from '../common/Logo';

export const AdminSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { logout, currentView, setCurrentView, currentUser, theme, switchToRole } = useApp();

  const navItems: { label: string; view: AppView; icon: React.ReactNode; badge?: string }[] = [
    {
      label: 'Admin Overview',
      view: 'admin-dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      label: 'Learner Directory',
      view: 'admin-students',
      icon: <Users className="w-4 h-4" />,
      badge: '5.4k'
    },
    {
      label: 'Course Catalog',
      view: 'admin-courses',
      icon: <BookOpen className="w-4 h-4" />,
      badge: '22'
    },
    {
      label: 'Revenue & Plans',
      view: 'admin-subscriptions',
      icon: <CreditCard className="w-4 h-4" />
    },
    {
      label: 'Certificates Registry',
      view: 'admin-certificates',
      icon: <Award className="w-4 h-4" />
    },
    {
      label: 'Broadcast Alerts',
      view: 'admin-notifications',
      icon: <Bell className="w-4 h-4" />
    },
    {
      label: 'Capability Analytics',
      view: 'admin-analytics',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      label: 'Portal Settings',
      view: 'admin-settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <>
      <div className={`md:hidden fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} aria-hidden="true" />
      <aside
      id="admin-sidebar"
      className={`shrink-0 flex flex-col justify-between border-r overflow-hidden transition-none
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
        md:relative md:translate-x-0 md:h-screen md:sticky md:top-0
        max-md:fixed max-md:left-0 max-md:top-0 max-md:z-50 max-md:h-screen max-md:w-[min(86vw,320px)]
        ${
        theme === 'dark'
          ? 'bg-[#090d1a] border-slate-800 text-slate-300'
          : 'bg-slate-900 text-slate-200 border-slate-800'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div onClick={() => setCurrentView('admin-dashboard')} className="relative z-20 transition-transform duration-300 ease-out hover:scale-[1.08] hover:-translate-y-0.5 cursor-pointer">
            <Logo size="sm" theme="dark" />
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">ADMIN</span>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 transition-colors" aria-label="Close sidebar">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1">
          Executive Control
        </div>
        {navItems.map(item => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => { setCurrentView(item.view); if (window.innerWidth < 768) onClose(); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md font-bold'
                  : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badge.includes('New')
                      ? 'bg-rose-500 text-white animate-pulse'
                      : isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Switch to Student View */}
      <div className="p-3 mx-3 mb-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-white">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Learner Preview Mode</span>
        </div>
        <p className="text-[11px] text-slate-300 mt-1">
          Experience the portal as student Anjali Sharma.
        </p>
        <button
          onClick={() => switchToRole('student')}
          className="mt-2.5 w-full py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 text-white font-bold text-[11px] shadow-sm transition-all text-center block"
        >
          Switch to Student View
        </button>
      </div>

      {/* Admin User Footer Profile */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-950/80">
          <button
            onClick={() => setCurrentView('admin-profile')}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left hover:opacity-90 transition-opacity"
            title="View Profile"
          >
            <img
              src={currentUser?.avatar || '/assets/images/founder-photo.png'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover border border-rose-500/40"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold truncate text-slate-200">{currentUser?.name}</div>
              <div className="text-[10px] text-cyan-300 font-semibold">View Profile</div>
            </div>
          </button>
          <button
            onClick={() => logout()}
            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
            title="Sign Out / Back to Home"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      </aside>
    </>);
};
