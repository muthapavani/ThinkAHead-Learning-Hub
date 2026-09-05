import React, { useState } from 'react';
import {
  BookOpen,
  Repeat,
  ShieldCheck,
  Clock,
  ChevronRight,
  Lock,
  Download,
  Eye,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

import { StudentAvatar } from '../common/StudentAvatar';

export const StudentDashboardView: React.FC = () => {
  const {
    currentUser,
    courses,
    progressMap,
    enrolledCoursesCount,
    overallProgressPercent,
    completedCoursesCount,
    setSelectedCourseId,
    setCurrentView,
    enrollInCourse,
    theme,
    setActiveCertificate,
    certificates,
    setViewCertificateModal,
    setCheckoutModalOpen,
    isCourseUnlocked
  } = useApp();

  const [activeCertIndex, setActiveCertIndex] = useState(0);

  const enrolledIds = new Set(currentUser?.enrolledCourseIds || []);
  const freeIds = new Set(courses.filter(course => course.isFree).map(course => course.id));
  // Keep the dashboard course buckets in sync with the same unlock rules used
  // by the course player: two free courses first, then every other unlocked
  // course, while locked courses stay in the Locked Courses section.
  const enrolledCourses = courses.filter(course => enrolledIds.has(course.id));
  const unlockedCourses = courses.filter(course => isCourseUnlocked(course));
  const freeCourses = courses.filter(course => freeIds.has(course.id));
  const currentCourses = unlockedCourses
   .filter((course, index, list) => list.findIndex(item => item.id === course.id) === index)
   .sort((a, b) => {
      const aDone = progressMap[a.id]?.isCompleted ? 1 : 0;
      const bDone = progressMap[b.id]?.isCompleted ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      const aFree = freeIds.has(a.id) ? 0 : 1;
      const bFree = freeIds.has(b.id) ? 0 : 1;
      if (aFree !== bFree) return aFree - bFree;
      return (progressMap[b.id]?.percent || 0) - (progressMap[a.id]?.percent || 0);
    });
  const lockedCourses = courses.filter(course => !isCourseUnlocked(course));
  const certificatesEarned = certificates.filter(c => c.courseId === 'all-22-capabilities-master').length;
  const completedEnrolledCount = enrolledCourses.filter(c => progressMap[c.id]?.isCompleted && progressMap[c.id]?.percent === 100).length;
  const inProgressCount = enrolledCourses.filter(c => (progressMap[c.id]?.percent || 0) > 0 && !progressMap[c.id]?.isCompleted).length;
  const notStartedCount = Math.max(0, enrolledCoursesCount - completedEnrolledCount - inProgressCount);
  const masterCertificate = certificates.find(c => c.courseId === 'all-22-capabilities-master');
  const certificateEligible = courses.length > 0 && completedCoursesCount === courses.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. TOP WELCOME BANNER WITH 5 STAT TILES & ILLUSTRATION (IMAGE 3) */}
      {/* ========================================================================= */}
      <div
        className={`relative rounded-3xl p-6 sm:p-8 border overflow-hidden transition-all shadow-xl ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#111a3a] via-[#25256b] to-[#083b52] border-cyan-400/20 text-white shadow-2xl shadow-indigo-950/40'
            : 'bg-gradient-to-br from-[#e9edff] via-[#f3ecff] to-[#e6fbff] border-indigo-100 text-slate-900 shadow-xl shadow-indigo-100/70'
        }`}
      >
        {/* Background glow effects */}
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div>
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-white/80">Welcome back,</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-0.5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-600 dark:from-cyan-200 dark:via-white dark:to-cyan-200">
                  {currentUser?.name || 'Learner'} 👋
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-white/85 mt-1 font-medium">
                Ready to grow today? Let's continue your learning journey.
              </p>
            </div>

            {/* 5 Stat Cards in horizontal row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2.5 pt-2">
              {/* Stat 1: 12 Enrolled Courses */}
              <div
                onClick={() => setCurrentView('student-all-courses')}
                className={`p-3 rounded-2xl backdrop-blur-md border transition-all cursor-pointer ${'bg-white/55 dark:bg-white/12 hover:bg-white/70 dark:hover:bg-white/18 border-white/70 dark:border-white/20 shadow-lg shadow-slate-900/10'}`}
              >
                <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-300">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-white">Enrolled</span>
                </div>
                <div className="text-lg sm:text-xl font-black mt-1">{enrolledCoursesCount}</div>
                <div className="text-[10px] text-slate-600 dark:text-white/75">Courses</div>
              </div>

              {/* Stat 2: 67% Overall Progress */}
              <div
                onClick={() => setCurrentView('student-progress')}
                className={`p-3 rounded-2xl backdrop-blur-md border transition-all cursor-pointer ${'bg-white/55 dark:bg-white/12 hover:bg-white/70 dark:hover:bg-white/18 border-white/70 dark:border-white/20 shadow-lg shadow-slate-900/10'}`}
              >
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Repeat className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-white">Progress</span>
                </div>
                <div className="text-lg sm:text-xl font-black mt-1">{overallProgressPercent}%</div>
                <div className="text-[10px] text-slate-600 dark:text-white/75">Overall</div>
              </div>

              {/* Stat 3: 8 Certificates Earned */}
              <div
                onClick={() => setCurrentView('student-certificates')}
                className={`p-3 rounded-2xl backdrop-blur-md border transition-all cursor-pointer ${'bg-white/55 dark:bg-white/12 hover:bg-white/70 dark:hover:bg-white/18 border-white/70 dark:border-white/20 shadow-lg shadow-slate-900/10'}`}
              >
                <div className="flex items-center gap-1.5 text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-white">Earned</span>
                </div>
                <div className="text-lg sm:text-xl font-black mt-1">{certificatesEarned}</div>
                <div className="text-[10px] text-slate-600 dark:text-white/75">Certificates</div>
              </div>

              {/* Stat 4: 120 Hours Learned */}
              <div
                onClick={() => setCurrentView('student-progress')}
                className="p-3 rounded-2xl bg-white/55 dark:bg-white/12 hover:bg-white/70 dark:hover:bg-white/18 backdrop-blur-md border border-white/70 dark:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-blue-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-white">Learned</span>
                  </div>
                  <div className="text-lg sm:text-xl font-black mt-1">{currentUser?.totalHours || 0} hrs</div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-white/75 pt-0.5">
                  <span>Total</span>
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                </div>
              </div>

            </div>
          </div>

          {/* Right Visual: Student illustration with floating orbital capability badges */}
          <div className="relative hidden lg:flex items-center justify-center shrink-0 w-64 h-48">
            <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-indigo-500/30 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.2)]">
              {/* Floating capability icons */}
              <div className="absolute -top-1 left-6 p-2 rounded-xl bg-white/95 border border-cyan-400/60 shadow-lg animate-bounce">
                <BookOpen className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="absolute top-8 -right-2 p-2 rounded-xl bg-white/95 border border-indigo-400/60 shadow-lg">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="absolute bottom-6 -left-2 p-2 rounded-xl bg-white/95 border border-emerald-400/60 shadow-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>

              {/* Student avatar: uploaded photo or first-name initial fallback */}
              <StudentAvatar
                name={currentUser?.name}
                avatar={currentUser?.avatar}
                className="w-28 h-28 rounded-full object-cover border-2 border-cyan-300 shadow-2xl"
                textClassName="text-4xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN SECTION: (LEFT: COURSES / RIGHT: PROGRESS & CERTS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================================= */}
        {/* LEFT 8 COLUMNS: CURRENT COURSES + LOCKED COURSES */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Courses */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              theme === 'dark' ? 'bg-[#080d1a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">Free Courses</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Start with these foundation programs at no cost.</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">{freeCourses.length} Free</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {freeCourses.map(course => (
                <div
                  key={course.id}
                  onClick={() => {
                    if (!enrolledIds.has(course.id)) {
                      void enrollInCourse(course.id);
                      return;
                    }
                    setSelectedCourseId(course.id);
                    setCurrentView('student-player');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group ${
                    theme === 'dark'
                      ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-400 hover:bg-white shadow-sm'
                  }`}
                >
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-emerald-950/25 group-hover:bg-transparent transition-all" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold truncate group-hover:text-emerald-500 transition-colors">{course.title}</h4>
                      <span className="shrink-0 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">Free</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">{course.shortDescription}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Current Courses */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              theme === 'dark' ? 'bg-[#080d1a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">Current Courses</h2>
              <button
                onClick={() => setCurrentView('student-my-learning')}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 hover:underline"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {currentCourses.map(course => (
                <div
                  key={course.id}
                  onClick={() => {
                    if (!enrolledIds.has(course.id)) {
                      void enrollInCourse(course.id);
                      return;
                    }
                    setSelectedCourseId(course.id);
                    setCurrentView('student-player');
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                    theme === 'dark'
                      ? 'bg-slate-900/60 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-14 sm:w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700/50">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold truncate group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h4>
                      <div className={`text-[11px] mt-0.5 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>{progressMap[course.id]?.isCompleted ? 'Completed • Learn Again' : 'Continue Learning'}</span>
                        <span>•</span>
                        <span className={`font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{progressMap[course.id]?.percent || 0}%</span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className={`w-32 sm:w-48 h-1.5 rounded-full overflow-hidden mt-1.5 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 rounded-full"
                          style={{ width: `${progressMap[course.id]?.percent || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 p-2 rounded-xl bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locked Courses */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              theme === 'dark' ? 'bg-[#080d1a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">Locked Courses</h2>
              <button
                onClick={() => setCurrentView('student-all-courses')}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 hover:underline"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {lockedCourses.map(course => (
                <div
                  key={course.id}
                  onClick={() => setCheckoutModalOpen(true)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group opacity-90 hover:opacity-100 ${
                    theme === 'dark'
                      ? 'bg-slate-900/40 border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/80'
                      : 'bg-slate-50/70 border-slate-200 hover:border-amber-400 hover:bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-14 sm:w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700/50 grayscale">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <h4 className="text-xs sm:text-sm font-bold truncate group-hover:text-amber-400 transition-colors">
                          {course.title}
                        </h4>
                      </div>
                      <p className={`text-[11px] mt-0.5 truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {course.shortDescription}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setCheckoutModalOpen(true);
                    }}
                    className="shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all"
                  >
                    Unlock
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT 4 COLUMNS: MY PROGRESS DONUT + CERTIFICATES + PROFILE OVERVIEW */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: My Progress Donut Chart */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              theme === 'dark' ? 'bg-[#080d1a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold tracking-tight">My Progress</h3>
              <span className={`text-xs font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{overallProgressPercent}% Done</span>
            </div>

            {/* SVG Donut Chart */}
            <div className="flex items-center justify-center my-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'}
                    strokeWidth="10"
                    fill="none"
                  />
                  {/* Progress Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#06b6d4"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgressPercent / 100)}`}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black">{overallProgressPercent}%</span>
                  <span className={`text-[10px] uppercase font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Completed</span>
                </div>
              </div>
            </div>

            {/* Legend Breakdown matching Image 3 */}
            <div className={`space-y-2.5 pt-2 text-xs border-t ${theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Courses Completed:</span>
                </div>
                <span className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{completedEnrolledCount}/{enrolledCoursesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>In Progress:</span>
                </div>
                <span className={`font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>{inProgressCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Not Started:</span>
                </div>
                <span className={`font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{notStartedCount}</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('student-progress')}
              className="mt-5 w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 shadow-md shadow-blue-600/25 transition-all text-center block"
            >
              View Learning Analytics
            </button>
          </div>

          {/* Card 2: Certificates Card with Download & Slider */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              theme === 'dark' ? 'bg-[#080d1a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold tracking-tight">Certificates</h3>
              <button
                onClick={() => setCurrentView('student-certificates')}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 hover:underline"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Realistic Certificate Preview Card matching Image 3 & 6 */}
            <div
              className={`relative rounded-2xl overflow-hidden border p-4 text-center shadow-lg ${
                theme === 'dark'
                  ? 'border-amber-500/40 bg-gradient-to-b from-[#131b2e] to-[#0a1020]'
                  : 'border-amber-300 bg-gradient-to-b from-amber-50 to-white'
              }`}
            >
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold ${certificateEligible ? 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-500' : 'bg-slate-500/15 border border-slate-400/30 text-slate-400'}`}>
                {certificateEligible ? 'Unlocked' : 'Locked'}
              </div>

              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-2">
                <Award className="w-5 h-5 text-amber-500" />
              </div>

              <div className="text-[10px] uppercase tracking-wider font-bold text-amber-500">
                ThinkAHead Master Credential
              </div>
              <h4 className={`text-xs sm:text-sm font-extrabold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {certificateEligible ? masterCertificate?.courseName || 'Master Diploma' : 'Certificate Locked'}
              </h4>
              <p className={`text-[10px] mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {certificateEligible ? `Issued on ${masterCertificate?.issueDate || 'completion date'}` : `Complete all ${courses.length} courses at 100% to unlock`}
              </p>

              <div className={`flex items-center justify-center gap-2 mt-3 pt-3 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  onClick={() => {
                    if (!certificateEligible || !masterCertificate) return;
                    setActiveCertificate(masterCertificate);
                    setViewCertificateModal(true);
                  }}
                  disabled={!certificateEligible || !masterCertificate}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition-all flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => {
                    if (!certificateEligible || !masterCertificate) return;
                    setActiveCertificate(masterCertificate);
                    setViewCertificateModal(true);
                  }}
                  disabled={!certificateEligible || !masterCertificate}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 border ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>

              {/* Slider Dots indicator */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <span className="w-4 h-1.5 rounded-full bg-cyan-400" />
                <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`} />
                <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`} />
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
