import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  PlayCircle,
  Star,
  Clock,
  BookOpen,
  Sparkles,
  ArrowRight,
  Filter,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AllCoursesView: React.FC = () => {
  const {
    courses,
    progressMap,
    setSelectedCourseId,
    setCurrentView,
    enrollInCourse,
    currentUser,
    isCourseUnlocked,
    setCheckoutModalOpen,
    openMasterCertificate,
    completedCoursesCount,
    totalCoursesCount,
    theme,
    searchQuery
  } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');


  const filtered = courses.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Professional curriculum banner */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-xl ${theme === 'dark' ? 'bg-gradient-to-br from-[#0b1020] via-[#11182c] to-[#0d1222] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <h2 className="text-[26px] sm:text-[34px] font-bold tracking-tight leading-[1.15]">Build your human capability portfolio</h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">Explore all {totalCoursesCount} programs. Your two foundation courses are available free and appear directly in My Learning. Annual members unlock two additional courses each month.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[250px]">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/70 p-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Completed</div>
              <div className="mt-1 text-2xl font-black">{completedCoursesCount}<span className="text-sm text-slate-400">/{totalCoursesCount}</span></div>
            </div>
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/30 p-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-indigo-500 dark:text-indigo-300">Accessible</div>
              <div className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-300">{courses.filter(c => isCourseUnlocked(c)).length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Filter Search */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            ALL CAPABILITY MODULES
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
            Explore 24 Capability Programs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Carefully curated for leadership, strategic reasoning, personal mastery, and ethical impact.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center pt-2">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 md:ml-auto">{filtered.length} courses shown</div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Personal Growth', 'Professional Skills', 'Leadership', 'Future Skills'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 text-white shadow-md shadow-blue-600/30'
                    : theme === 'dark'
                    ? 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!filtered.length && (
        <div className={`p-12 rounded-3xl border border-dashed text-center ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
          <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <div className="font-bold text-sm">No courses match your filters</div>
          <p className="text-xs mt-1">Try a different category, or clear the search box.</p>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {filtered.map(course => {
          const prog = progressMap[course.id];
          const isEnrolled = !!prog;
          const isCompleted = prog?.isCompleted;
          const unlocked = isCourseUnlocked(course);

          return (
            <div
              key={course.id}
              className={`group rounded-3xl border overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-lg ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/60'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300'
              }`}
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    loading="lazy"
                    className={`w-full h-full object-cover ${!unlocked ? 'grayscale opacity-70' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {course.isFree || course.id === 'course-1' || course.id === 'course-2' ? (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500 text-slate-950 shadow-sm">
                        Free
                      </span>
                    ) : unlocked ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-emerald-600/90 backdrop-blur-md text-white border border-emerald-400/30 flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                        Available now
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-md">
                        <Lock className="w-3 h-3 text-amber-400" />
                        Month {course.monthUnlock}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-medium">
                      {course.category}
                    </span>
                    {/* A rating is only shown once real reviews exist. */}
                    {Number(course.reviewsCount) > 0 && (
                      <span className="flex items-center gap-1 text-amber-300 font-semibold text-[11px] bg-black/60 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-300" />
                        {course.rating}
                        <span className="text-white/60 font-normal">({course.reviewsCount})</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-slate-900 dark:text-slate-100 line-clamp-2 min-h-[2.7rem]">{course.title}</h3>

                  <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {typeof course.instructor === 'object' ? course.instructor?.name : course.instructor}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[2.2rem]">
                    {course.shortDescription}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />{course.totalDuration || '—'}</span>
                    <span className="flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />{course.lessonsCount || 0} lessons</span>
                    {(course as any).level && <span className="ml-auto px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">{(course as any).level}</span>}
                  </div>

                  {/* If enrolled progress */}
                  {isEnrolled && (
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-slate-500 dark:text-slate-400">{isCompleted ? 'Completed' : 'Progress'}</span>
                        <span className={`font-bold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>{prog.percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-500'}`}
                          style={{ width: `${prog.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                {!unlocked ? (
                  <button
                    disabled
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border cursor-not-allowed ${
                      theme === 'dark'
                        ? 'bg-slate-800/70 text-amber-300 border-slate-700'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlocks in month {course.monthUnlock}</span>
                  </button>
                ) : !isEnrolled ? (
                  <button
                    onClick={() => void enrollInCourse(course.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 shadow-sm"
                  >
                    <span>Open Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setCurrentView('student-player');
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 ${
                      isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-sm'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-sm'
                    }`}
                  >
                    <span>{isCompleted ? 'Learn Again' : 'Resume Learning'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
