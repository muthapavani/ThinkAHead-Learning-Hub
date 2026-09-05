import React, { useState } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  LogOut,
  GraduationCap,
  ShieldCheck,
  Award,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { StudentAvatar } from './StudentAvatar';

export const Navbar: React.FC = () => {
  const { theme, setCurrentView, currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  // Mobile accordion states
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setProgramsDropdownOpen(false);
    setResourcesDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl transition-colors duration-300 border-b ${
        theme === 'dark'
          ? 'bg-[#070b16]/95 border-slate-800 text-white'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] sm:h-[80px] flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          aria-label="ThinkAHead"
          className="cursor-pointer flex items-center bg-transparent border-0 p-0 transition-transform duration-200 hover:scale-[1.08]"
        >
          <Logo size="md" theme={theme} />
        </button>

        {/* Desktop Navigation Links (>= lg: 1024px) */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold">
          <button
            onClick={() => scrollToSection('hero-section')}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection('about-section')}
            className={`transition-colors hover:text-blue-500 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            About Us
          </button>

          {/* Programs Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProgramsDropdownOpen(true)}
            onMouseLeave={() => setProgramsDropdownOpen(false)}
          >
            <button
              onClick={() => scrollToSection('programs-section')}
              className={`flex items-center gap-1 transition-colors hover:text-blue-500 py-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              <span>Programs</span>
              <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${programsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {programsDropdownOpen && (
              <div
                className={`absolute top-full left-0 mt-1 w-64 rounded-2xl p-2 border shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  theme === 'dark' ? 'bg-slate-900/98 border-slate-800 text-slate-200' : 'bg-white/98 border-slate-200 text-slate-800'
                }`}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-500 border-b border-slate-700/40 mb-1 flex items-center justify-between">
                  <span>20+ Capability Programs</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <button
                  onClick={() => scrollToSection('programs-section')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
                >
                  Leadership Development
                </button>
                <button
                  onClick={() => scrollToSection('programs-section')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
                >
                  Communication Skills
                </button>
                <button
                  onClick={() => scrollToSection('programs-section')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-600/10 hover:text-blue-500 transition-colors flex items-center justify-between"
                >
                  <span>DISC Profiling</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Free</span>
                </button>
                <button
                  onClick={() => scrollToSection('programs-section')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-600/10 hover:text-blue-500 transition-colors flex items-center justify-between"
                >
                  <span>Team Building</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Free</span>
                </button>
                <button
                  onClick={() => scrollToSection('programs-section')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
                >
                  Emotional Intelligence
                </button>
                <button
                  onClick={() => scrollToSection('programs-section')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
                >
                  Financial Literacy
                </button>
                <button
                  onClick={() => scrollToSection('programs-section')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-500 hover:text-blue-400 pt-1 border-t border-slate-700/30 mt-1 flex items-center justify-between"
                >
                  <span>View All 20+ Programs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => scrollToSection('journey-section')}
            className={`transition-colors hover:text-blue-500 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Learning Journey
          </button>

          <button
            onClick={() => scrollToSection('pricing-section')}
            className={`transition-colors hover:text-blue-500 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Membership
          </button>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setResourcesDropdownOpen(true)}
            onMouseLeave={() => setResourcesDropdownOpen(false)}
          >
            <button
              onClick={() => scrollToSection('certificate-section')}
              className={`flex items-center gap-1 transition-colors hover:text-blue-500 py-2 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              <span>Resources</span>
              <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {resourcesDropdownOpen && (
              <div
                className={`absolute top-full left-0 mt-1 w-56 rounded-2xl p-2 border shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  theme === 'dark' ? 'bg-slate-900/98 border-slate-800 text-slate-200' : 'bg-white/98 border-slate-200 text-slate-800'
                }`}
              >
                <button
                  onClick={() => scrollToSection('certificate-section')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-600/10 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sample Certificate</span>
                </button>
                <button
                  onClick={() => scrollToSection('faq-section')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-600/10 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                  <span>FAQs & Help</span>
                </button>
                <button
                  onClick={() => scrollToSection('testimonials-section')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-600/10 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Learner Stories</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => scrollToSection('contact-section')}
            className={`transition-colors hover:text-blue-500 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Desktop Right Actions (>= lg: 1024px) */}
        <div className="hidden lg:flex items-center space-x-3">
          <ThemeToggle />

          {currentUser ? (
            <div className="flex items-center gap-2.5">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => setCurrentView('admin-dashboard')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-all shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('student-dashboard')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 text-white shadow-md shadow-blue-600/25 transition-all"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>My Dashboard</span>
                </button>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-slate-700/60">
                <StudentAvatar
                  name={currentUser.name}
                  avatar={currentUser.avatar}
                  className="w-8 h-8 rounded-full ring-2 ring-blue-500/40 object-cover"
                />
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Login Button */}
              <button
                id="nav-login-btn"
                onClick={() => setCurrentView('auth-login')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Login
              </button>

              {/* Register Button */}
              <button
                id="nav-register-btn"
                onClick={() => setCurrentView('auth-register')}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Controls (< lg: 1024px) - Strictly ONE ThemeToggle and Mobile Menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2.5 rounded-xl border transition-colors ${
              theme === 'dark'
                ? 'border-slate-800 text-slate-200 bg-slate-900/80 hover:bg-slate-800'
                : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-blue-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (< lg: 1024px) */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-b px-4 sm:px-6 py-5 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-200 ${
            theme === 'dark'
              ? 'bg-[#070b16] border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800 shadow-2xl'
          }`}
        >
          <div className="flex flex-col space-y-1 font-semibold text-sm">
            <button
              onClick={() => scrollToSection('hero-section')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
            >
              Home
            </button>

            <button
              onClick={() => scrollToSection('about-section')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
            >
              About Us
            </button>

            {/* Expandable Programs in Mobile */}
            <div>
              <button
                onClick={() => setMobileProgramsOpen(!mobileProgramsOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-600/10 hover:text-blue-500 transition-colors text-left"
              >
                <span>Programs (20+ Capabilities)</span>
                {mobileProgramsOpen ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {mobileProgramsOpen && (
                <div className={`ml-3 pl-3 my-1 space-y-1 border-l text-xs ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                  <button
                    onClick={() => scrollToSection('programs-section')}
                    className="w-full text-left py-2 px-2 rounded-lg hover:text-blue-500 flex items-center justify-between"
                  >
                    <span>Leadership Development</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('programs-section')}
                    className="w-full text-left py-2 px-2 rounded-lg hover:text-blue-500 flex items-center justify-between"
                  >
                    <span>Communication Skills</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('programs-section')}
                    className="w-full text-left py-2 px-2 rounded-lg hover:text-blue-500 flex items-center justify-between"
                  >
                    <span>DISC Profiling</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Free</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('programs-section')}
                    className="w-full text-left py-2 px-2 rounded-lg hover:text-blue-500 flex items-center justify-between"
                  >
                    <span>Team Building</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Free</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('programs-section')}
                    className="w-full text-left py-2 px-2 rounded-lg hover:text-blue-500"
                  >
                    Emotional Intelligence
                  </button>
                  <button
                    onClick={() => scrollToSection('programs-section')}
                    className="w-full text-left py-2 px-2 rounded-lg hover:text-blue-500"
                  >
                    Financial Literacy
                  </button>
                  <button
                    onClick={() => scrollToSection('programs-section')}
                    className="w-full text-left py-2 px-2 rounded-lg font-bold text-blue-500"
                  >
                    Explore All 22 Programs →
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection('journey-section')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
            >
              Learning Journey
            </button>

            <button
              onClick={() => scrollToSection('pricing-section')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
            >
              Membership
            </button>

            {/* Expandable Resources in Mobile */}
            <div>
              <button
                onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-600/10 hover:text-blue-500 transition-colors text-left"
              >
                <span>Resources</span>
                {mobileResourcesOpen ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {mobileResourcesOpen && (
                <div className={`ml-3 pl-3 my-1 space-y-1 border-l text-xs ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                  <button
                    onClick={() => scrollToSection('certificate-section')}
                    className="w-full text-left py-2 px-2 rounded-lg hover:text-blue-500 flex items-center gap-2"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sample Certificate</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('faq-section')}
                    className="w-full text-left py-2 px-2 rounded-lg hover:text-blue-500 flex items-center gap-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                    <span>FAQs & Help</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('testimonials-section')}
                    className="w-full text-left py-2 px-2 rounded-lg hover:text-blue-500 flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Learner Stories</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection('contact-section')}
              className="text-left px-3 py-2.5 rounded-xl hover:bg-blue-600/10 hover:text-blue-500 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Auth / Account Actions */}
          <div className="pt-4 border-t border-slate-700/40 flex flex-col gap-2.5">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                  <StudentAvatar
                    name={currentUser.name}
                    avatar={currentUser.avatar}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/40"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView(currentUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 text-center shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  {currentUser.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                  <span>Go to {currentUser.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView('auth-login');
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 text-center shadow-md transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentView('auth-register');
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 text-center shadow-md transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
};

