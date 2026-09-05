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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500/15 to-indigo-500/15 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-black uppercase tracking-[0.16em]">
              <Layers className="w-3.5 h-3.5" /> Capability Curriculum
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">Build your Human Capability portfolio</h2>
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

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => {
          const prog = progressMap[course.id];
          const isEnrolled = !!prog;
          const isCompleted = prog?.isCompleted;
          const unlocked = isCourseUnlocked(course);

          return (
            <div
              key={course.id}
              className={`rounded-3xl border overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl ${
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
                    className={`w-full h-full object-cover ${!unlocked ? 'grayscale-[30%]' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {course.isFree || course.id === 'course-1' || course.id === 'course-2' ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
                        100% FREE
                      </span>
                    ) : unlocked ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-emerald-600/90 backdrop-blur-md text-white border border-emerald-400/30 flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                        Month {course.monthUnlock} Unlocked
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-md">
                        <Lock className="w-3 h-3 text-amber-400" />
                        Soon
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono">
                      {course.category}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-black/60 px-2 py-0.5 rounded">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {course.rating} ({course.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-baseline justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="font-mono">Course #{course.courseNumber || (courses.findIndex(c => c.id === course.id) + 1)} of 22</span>
                    <span className="font-semibold text-slate-500 dark:text-slate-300">
                      {typeof course.instructor === 'object' ? course.instructor?.name : course.instructor}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{course.title}</h3>
                  {isEnrolled ? (
                    <>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {course.shortDescription}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                          {course.totalDuration}
                        </span>
                        <span className="flex items-center gap-1">
                          <PlayCircle className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                          {course.lessonsCount} Lessons
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{course.shortDescription}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />{course.totalDuration}</span>
                        <span className="flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />{course.lessonsCount} Lessons</span>
                      </div>
                    </>
                  )}

                  {/* If enrolled progress */}
                  {isEnrolled && (
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span>Progress</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{prog.percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
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
                    <span>Annual Membership • Unlock Course</span>
                  </button>
                ) : !isEnrolled ? (
                  <button
                    onClick={() => void enrollInCourse(course.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 shadow-md shadow-blue-600/30"
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
                        ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 shadow-md shadow-emerald-600/30'
                        : 'bg-gradient-to-r from-rose-600 via-indigo-600 to-blue-600 hover:from-rose-500 hover:via-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-600/30'
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
