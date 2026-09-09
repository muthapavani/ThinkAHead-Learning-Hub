import React, { useState } from 'react';
import { useApp } from './context/AppContext';

// Common & Modals
import { CertificateModal } from './components/certificate/CertificateModal';
import { CheckoutModal } from './components/subscription/CheckoutModal';

// Landing & Auth
import { LandingPage } from './components/landing/LandingPage';
import { AuthPages } from './components/auth/AuthPages';

// Student Portal
import { StudentSidebar } from './components/student/StudentSidebar';
import { StudentHeader } from './components/student/StudentHeader';
import { StudentDashboardView } from './components/student/StudentDashboardView';
import { AllCoursesView } from './components/student/AllCoursesView';
import { CoursePlayerView } from './components/student/CoursePlayerView';
import {
  MyLearningView,
  CertificatesView,
  SubscriptionView,
  ResourcesView,
  ProfileView,
  ProgressView,
  SettingsView,
  NotificationsView,
} from './components/student/StudentAdditionalViews';

// Admin Portal
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import {
  AdminDashboardView,
  AdminStudentsView,
  AdminCoursesView,
  AdminSubscriptionsView,
  AdminCertificatesView,
  AdminNotificationsView,
  AdminAnalyticsView,
  AdminSettingsView
} from './components/admin/AdminViews';

export default function App() {
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(() => typeof window === 'undefined' ? true : window.innerWidth >= 768);
  const [studentSidebarOpen, setStudentSidebarOpen] = useState(() => typeof window === 'undefined' ? true : window.innerWidth >= 768);

  // Keep the full sidebar on laptop/desktop when open. Closing it hides it
  // completely; there is no icon-only collapsed desktop mode.
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setStudentSidebarOpen(prev => prev);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    // Only react when crossing the mobile/desktop breakpoint. A resize inside
    // desktop must never reopen a sidebar the user intentionally closed.
    let wasMobile = window.innerWidth < 768;
    const handleResponsiveSidebars = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile !== wasMobile) {
        setAdminSidebarOpen(!isMobile);
        setStudentSidebarOpen(!isMobile);
        wasMobile = isMobile;
      }
    };
    window.addEventListener('resize', handleResponsiveSidebars);
    return () => window.removeEventListener('resize', handleResponsiveSidebars);
  }, []);

  const {
    currentView,
    setCurrentView,
    currentUser,
    theme,
    activeCertificate,
    viewCertificateModal,
    setViewCertificateModal,
    checkoutModalOpen,
    setCheckoutModalOpen,
    toastMessage,
    logoutConfirmOpen,
    confirmLogout,
    cancelLogout,
    switchToRole
  } = useApp();

  // ----------------------------------------------------
  // Route 1: Public Landing Page
  // ----------------------------------------------------
  if (currentView === 'landing' || (!currentUser && !currentView.startsWith('auth-'))) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0f1d] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <LandingPage />
        <CertificateModal
          certificate={activeCertificate}
          isOpen={viewCertificateModal}
          onClose={() => setViewCertificateModal(false)}
        />
        <CheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
        />
        {logoutConfirmOpen && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) cancelLogout(); }}>
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mx-auto mb-4">↪</div>
              <h3 className="text-lg font-black text-white text-center">Do you want to log out?</h3>
              <p className="text-xs text-slate-400 text-center mt-2">Choose Log Out to end your session, or Stay to continue learning.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={cancelLogout} className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Stay</button>
                <button onClick={confirmLogout} className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold">Log Out</button>
              </div>
            </div>
          </div>
        )}
        {toastMessage && <Toast message={toastMessage} />}
      </div>
    );
  }

  // ----------------------------------------------------
  // Route 2: Dedicated Auth Pages (Register / Login / Reset)
  // Strictly isolated: NO dashboards shown in the background!
  // ----------------------------------------------------
  if (currentView.startsWith('auth-') || currentView === 'login' || currentView === 'register') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0f1d] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <AuthPages />
        {logoutConfirmOpen && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) cancelLogout(); }}>
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mx-auto mb-4">↪</div>
              <h3 className="text-lg font-black text-white text-center">Do you want to log out?</h3>
              <p className="text-xs text-slate-400 text-center mt-2">Choose Log Out to end your session, or Stay to continue learning.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={cancelLogout} className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Stay</button>
                <button onClick={confirmLogout} className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold">Log Out</button>
              </div>
            </div>
          </div>
        )}
        {toastMessage && <Toast message={toastMessage} />}
      </div>
    );
  }

  // ----------------------------------------------------
  // Route 3: Admin Portal (Only for role === 'admin')
  // ----------------------------------------------------
  if (currentUser?.role === 'admin' && currentView.startsWith('admin-')) {
    return (
      <div className={`dashboard-shell admin-portal min-h-screen flex ${theme === 'dark' ? 'bg-[#060a13] text-white' : 'bg-slate-100 text-slate-900'}`}>
        <AdminSidebar isOpen={adminSidebarOpen} onClose={() => setAdminSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          <AdminHeader onMenuClick={() => setAdminSidebarOpen(prev => !prev)} sidebarOpen={adminSidebarOpen} />
          <main className="flex-1">
            {currentView !== 'admin-dashboard' && (
              <div className="hidden sm:flex max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 md:pt-5">
                <button type="button" onClick={() => setCurrentView('admin-dashboard')} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-indigo-400 transition-colors" aria-label="Back to Admin Dashboard">
                  <span aria-hidden="true">←</span> Back to Overview
                </button>
              </div>
            )}
            {currentView === 'admin-dashboard' && <AdminDashboardView />}
            {currentView === 'admin-students' && <AdminStudentsView />}
            {currentView === 'admin-courses' && <AdminCoursesView />}
            {currentView === 'admin-subscriptions' && <AdminSubscriptionsView />}
            {currentView === 'admin-certificates' && <AdminCertificatesView />}
            {currentView === 'admin-notifications' && <AdminNotificationsView />}
            {currentView === 'admin-analytics' && <AdminAnalyticsView />}
            {currentView === 'admin-profile' && <ProfileView />}
            {(currentView === 'admin-settings' || currentView === 'admin-final-assessment' || currentView === 'admin-videos' || currentView === 'admin-resources') && <AdminSettingsView />}
          </main>
        </div>

        <CertificateModal
          certificate={activeCertificate}
          isOpen={viewCertificateModal}
          onClose={() => setViewCertificateModal(false)}
        />
        {logoutConfirmOpen && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) cancelLogout(); }}>
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mx-auto mb-4">↪</div>
              <h3 className="text-lg font-black text-white text-center">Do you want to log out?</h3>
              <p className="text-xs text-slate-400 text-center mt-2">Choose Log Out to end your session, or Stay to continue learning.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={cancelLogout} className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Stay</button>
                <button onClick={confirmLogout} className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold">Log Out</button>
              </div>
            </div>
          </div>
        )}
        {toastMessage && <Toast message={toastMessage} />}
      </div>
    );
  }

  // ----------------------------------------------------
  // Route 4: Fullscreen Course Player (Student)
  // ----------------------------------------------------
  if (currentView === 'student-player') {
    return (
      <div className={`dashboard-shell min-h-screen ${theme === 'dark' ? 'bg-[#060a13] text-white' : 'bg-gradient-to-br from-slate-50 via-white to-cyan-50 text-slate-900'}`}>
        <CoursePlayerView />
        <CertificateModal
          certificate={activeCertificate}
          isOpen={viewCertificateModal}
          onClose={() => setViewCertificateModal(false)}
        />
        <CheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
        />
        {logoutConfirmOpen && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) cancelLogout(); }}>
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mx-auto mb-4">↪</div>
              <h3 className="text-lg font-black text-white text-center">Do you want to log out?</h3>
              <p className="text-xs text-slate-400 text-center mt-2">Choose Log Out to end your session, or Stay to continue learning.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={cancelLogout} className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Stay</button>
                <button onClick={confirmLogout} className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold">Log Out</button>
              </div>
            </div>
          </div>
        )}
        {toastMessage && <Toast message={toastMessage} />}
      </div>
    );
  }

  // ----------------------------------------------------
  // Route 5: Student Portal Layout (Authenticated Student)
  // ----------------------------------------------------
  return (
    <div className={`dashboard-shell min-h-screen flex ${theme === 'dark' ? 'bg-[#070b16] text-white' : 'bg-gradient-to-br from-slate-50 via-white to-cyan-50 text-slate-900'}`}>
      <StudentSidebar isOpen={studentSidebarOpen} onClose={() => setStudentSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <StudentHeader onMenuClick={() => setStudentSidebarOpen(prev => !prev)} sidebarOpen={studentSidebarOpen} />
        <main className="flex-1">
          {/* Each student view renders its own Back to Learning button. */}
          {currentView === 'student-dashboard' && <StudentDashboardView />}
          {currentView === 'student-my-learning' && <MyLearningView />}
          {currentView === 'student-all-courses' && <AllCoursesView />}
          {currentView === 'student-certificates' && <CertificatesView />}
          {currentView === 'student-subscription' && <SubscriptionView />}
          {(currentView === 'student-resources' || currentView === 'student-help') && <ResourcesView />}
          {currentView === 'student-profile' && <ProfileView />}
          {currentView === 'student-settings' && <SettingsView />}
          {currentView === 'student-notifications' && <NotificationsView />}
          {currentView === 'student-progress' && <ProgressView />}
        </main>
      </div>

      <CertificateModal
        certificate={activeCertificate}
        isOpen={viewCertificateModal}
        onClose={() => setViewCertificateModal(false)}
      />
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
      {logoutConfirmOpen && (
          <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) cancelLogout(); }}>
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mx-auto mb-4">↪</div>
              <h3 className="text-lg font-black text-white text-center">Do you want to log out?</h3>
              <p className="text-xs text-slate-400 text-center mt-2">Choose Log Out to end your session, or Stay to continue learning.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={cancelLogout} className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold">Stay</button>
                <button onClick={confirmLogout} className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold">Log Out</button>
              </div>
            </div>
          </div>
        )}
        {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

// Toast floating pill component
const Toast: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
      <div className="bg-slate-950/95 border border-indigo-500/50 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-2 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{message}</span>
      </div>
    </div>
  );
};
