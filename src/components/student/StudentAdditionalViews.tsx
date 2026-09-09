import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  CreditCard,
  Video,
  MessageSquare,
  FileText,
  Trophy,
  User,
  Settings,
  Sparkles,
  PlayCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Download,
  Camera,
  Share2,
  Search,
  Filter,
  Plus,
  Send,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  Flame,
  Star,
  Lock,
  ChevronRight,
  ArrowLeft,
  Bell,
  RefreshCw,
  Eye,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Course, StudentCourseProgress } from '../../types';

// ==========================================
// 1. MY LEARNING VIEW
// ==========================================
import { StudentAvatar } from '../common/StudentAvatar';

export const MyLearningView: React.FC = () => {
  const {
    courses,
    progressMap,
    setSelectedCourseId,
    setCurrentView,
    theme,
    setActiveCertificate,
    certificates,
    setViewCertificateModal,
    currentUser,
    isCourseUnlocked
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'in-progress' | 'completed'>('all');

  const completedCourseIds = new Set([...(currentUser?.completedCourseIds || []), ...Object.values<StudentCourseProgress>(progressMap).filter(p => p.isCompleted).map(p => p.courseId)]);
  const unlockedCourses = courses.filter(c => isCourseUnlocked(c));
  const inProgressCourses = unlockedCourses.filter(
    c => progressMap[c.id] && !completedCourseIds.has(c.id)
  );
  const completedCourses = unlockedCourses.filter(c => completedCourseIds.has(c.id));

  const enrolledCourses = unlockedCourses.filter(c => !!progressMap[c.id] || (currentUser?.enrolledCourseIds || []).includes(c.id));
  // My Learning must never show locked courses. It is intentionally based on the
  // same access calculation as the dashboard, not only on enrollment records.
  const displayedCourses =
    filterTab === 'in-progress'
      ? inProgressCourses
      : filterTab === 'completed'
      ? completedCourses
      : unlockedCourses;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Learning
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">My Learning Hub</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your ongoing courses, quiz results, and completed milestones.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 w-fit">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Enrolled ({displayedCourses.length})
          </button>
          <button
            onClick={() => setFilterTab('in-progress')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'in-progress'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            In Progress ({inProgressCourses.length})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'completed'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Completed ({completedCourses.length})
          </button>
        </div>
      </div>

      {displayedCourses.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
          <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-600 dark:text-slate-300">No courses found in this tab</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Browse all 24 capability courses to enroll.</p>
          <button
            onClick={() => setCurrentView('student-all-courses')}
            className="mt-4 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayedCourses.map(course => {
            const prog = progressMap[course.id] || { percent: 0, completedLessonIds: [], isCompleted: false };
            const isCompleted = prog.isCompleted;
            const started = prog.percent > 0;
            const lessonsDone = prog.completedLessonIds.length;

            return (
              <article
                key={course.id}
                className={`group relative flex flex-col rounded-2xl border overflow-hidden transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-900/70 border-slate-800 hover:border-slate-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* A finished course is marked by a coloured edge rather than a
                    badge pasted over the artwork. */}
                {isCompleted && <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 z-10" />}

                <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={course.thumbnail} alt="" loading="lazy" className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className={`px-2 py-0.5 rounded-md font-semibold ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{course.category}</span>
                    {isCompleted
                      ? <span className="font-semibold text-emerald-600 dark:text-emerald-400">Completed</span>
                      : started
                      ? <span className="font-semibold text-indigo-600 dark:text-indigo-400">In progress</span>
                      : <span className="text-slate-400">Not started</span>}
                  </div>

                  <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.01em] text-slate-900 dark:text-slate-50 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {course.shortDescription}
                  </p>

                  <div className="mt-auto pt-3 space-y-2.5">
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span className="text-slate-500 dark:text-slate-400">{lessonsDone} of {course.lessonsCount} lessons</span>
                      <span className="tabular-nums font-semibold text-slate-900 dark:text-slate-100">{prog.percent}%</span>
                    </div>
                    <div className="h-[3px] rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                        style={{ width: `${Math.max(prog.percent, started ? 3 : 0)}%` }}
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => { setSelectedCourseId(course.id); setCurrentView('student-player'); }}
                        className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-600/20'
                            : 'bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 text-white hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        {isCompleted ? 'Review course' : started ? 'Continue' : 'Start course'}
                      </button>

                      {isCompleted && (
                        <button
                          onClick={() => {
                            const cert = certificates.find(c => c.courseId === course.id) || certificates[0];
                            setActiveCertificate(cert);
                            setViewCertificateModal(true);
                          }}
                          className="px-3 rounded-xl border border-amber-400/50 text-amber-600 dark:text-amber-400 hover:bg-amber-400/10 transition-colors"
                          title="View certificate"
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. CERTIFICATES GALLERY VIEW (ONE PROGRAM CERTIFICATE)
// ==========================================
export const CertificatesView: React.FC = () => {
  const { courses, progressMap, certificates, currentUser, theme, setActiveCertificate, setViewCertificateModal, setCurrentView, showToast, refreshStudentData } = useApp() as any;

  // The programme-wide assessment that stands between finishing every course
  // and receiving the certificate.
  const [assessment, setAssessment] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [taking, setTaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadAssessment = async () => {
    try { const r = await api<any>('/student/final-assessment'); setAssessment(r.assessment); }
    catch (e: any) { showToast?.(e.message || 'Unable to load the final assessment.'); }
  };
  useEffect(() => { void loadAssessment(); }, []);

  const submitAssessment = async () => {
    const unanswered = (assessment?.questions || []).filter((q: any) => answers[q.id] === undefined);
    if (unanswered.length) { showToast?.(`Please answer all questions. ${unanswered.length} left.`); return; }
    setSubmitting(true);
    try {
      const r = await api<any>('/student/final-assessment', { method: 'POST', body: JSON.stringify({ answers }) });
      showToast?.(r.attemptsLeft > 0
        ? `Scored ${r.result.percentage}%. You may retake it ${r.attemptsLeft} more time(s) to improve.`
        : `Scored ${r.result.percentage}%. That was your final attempt.`);
      setTaking(false);
      setAnswers({});
      await loadAssessment();
      await refreshStudentData?.();
    } catch (e: any) {
      showToast?.(e.message || 'Could not submit the assessment.');
      await loadAssessment();
    } finally { setSubmitting(false); }
  };
  const completed = courses.filter(course => {
    const p = progressMap[course.id];
    return !!p?.isCompleted || (currentUser?.completedCourseIds || []).includes(course.id);
  }).length;
  const total = courses.length;
  const certificate = certificates.find(c => c.courseId === 'all-22-capabilities-master') || certificates[0];
  const unlocked = !!certificate && completed === total && total > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-5xl mx-auto">
      <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Learning
      </button>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-black uppercase tracking-[0.16em]"><Award className="w-3.5 h-3.5" /> Program Certificate</div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">My Certificate</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Complete every course, then take the final assessment to unlock your certificate for the complete ThinkAHead learning program.</p>
        </div>
      </div>

      {/* Final assessment: the last step before the certificate is issued. */}
      {assessment && (
        <div className={`rounded-3xl border p-5 sm:p-6 space-y-4 ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-500">Final Step</div>
              <h3 className="mt-1 text-base font-black">{assessment.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {assessment.description || `${assessment.questionCount} questions · ${assessment.maxAttempts} attempts · no pass mark, your best score is printed on the certificate.`}
              </p>
            </div>
            {assessment.completed ? (
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">Completed · best {assessment.bestPercentage}%</span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">{assessment.attemptsLeft} of {assessment.maxAttempts} attempts left</span>
            )}
          </div>

          {!assessment.available && (
            <div className={`p-4 rounded-2xl border border-dashed text-center ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
              <Lock className="w-5 h-5 mx-auto mb-2 opacity-60" />
              <div className="text-xs font-bold">Not open yet</div>
              <p className="text-[11px] mt-1">Your final assessment will appear here once it is published.</p>
            </div>
          )}

          {assessment.available && !assessment.unlocked && (
            <div className={`p-4 rounded-2xl border border-dashed text-center ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
              <Lock className="w-5 h-5 mx-auto mb-2 opacity-60" />
              <div className="text-xs font-bold">Locked</div>
              <p className="text-[11px] mt-1">You have completed {assessment.completedCourses} of {assessment.totalCourses} courses. Finish the remaining {assessment.coursesRemaining} to unlock this assessment.</p>
            </div>
          )}

          {assessment.available && assessment.unlocked && assessment.attemptsLeft <= 0 && (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
              All {assessment.maxAttempts} attempts used. Your recorded score is {assessment.bestPercentage}%, and it appears on your certificate.
            </div>
          )}

          {assessment.available && assessment.unlocked && assessment.attemptsLeft > 0 && !taking && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {assessment.attemptsUsed > 0
                  ? `Last attempt: ${assessment.lastPercentage}%. Best so far: ${assessment.bestPercentage}%. Your best score is the one recorded.`
                  : 'Submitting counts as one of your attempts.'}
              </p>
              <button onClick={() => setTaking(true)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg shrink-0">
                {assessment.attemptsUsed > 0 ? 'Retake to Improve' : 'Start Final Assessment'}
              </button>
            </div>
          )}

          {taking && (
            <div className="space-y-5 pt-2 border-t border-slate-200 dark:border-slate-800">
              {(assessment.questions || []).map((q: any, qi: number) => (
                <div key={q.id} className="space-y-2.5">
                  <div className="text-xs sm:text-sm font-bold">{qi + 1}. {q.question}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(q.options || []).map((opt: string, oi: number) => (
                      <button key={oi} type="button" onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                        className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-all ${
                          answers[q.id] === oi
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : theme === 'dark' ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}>{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <button onClick={() => { setTaking(false); setAnswers({}); }} className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">Cancel</button>
                <button disabled={submitting} onClick={() => void submitAssessment()} className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-60">{submitting ? 'Submitting…' : 'Submit Assessment'}</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="h-44 sm:h-56 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-700">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.2),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,.15),transparent_35%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
            <Award className="w-12 h-12 mb-3 opacity-90" />
            <div className="text-xl sm:text-2xl font-black">ThinkAHead Complete Learning Certificate</div>
            <div className="text-xs text-white/75 mt-1">All courses • Final assessments • One verified credential</div>
          </div>
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-indigo-500">Program Completion</div>
              <h3 className="mt-1 text-lg font-black">{completed} of {total} courses completed</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{unlocked ? 'Your single program certificate is unlocked and ready to view.' : `Complete all ${total} courses and pass their final quizzes to unlock the certificate.`}</p>
            </div>
            {unlocked ? (
              <button onClick={() => { setActiveCertificate(certificate!); setViewCertificateModal(true); }} className="sm:w-56 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-black flex items-center justify-center gap-2"><Award className="w-4 h-4" /> View Certificate</button>
            ) : (
              <div className="sm:w-56 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold text-center">Certificate Locked</div>
            )}
          </div>
          <div className="mt-5 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all" style={{width:`${total ? Math.round(completed/total*100) : 0}%`}} /></div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. ANNUAL MEMBERSHIP & SUBSCRIPTION VIEW
// ==========================================
export const SubscriptionView: React.FC = () => {
  const { currentUser, setCheckoutModalOpen, theme, courses, isCourseUnlocked, subscriptionUnlockedMonths, setCurrentView } = useApp();
  const active = subscriptionUnlockedMonths > 0;
  const accessibleCount = courses.filter(c => isCourseUnlocked(c)).length;
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Learning
      </button>
      <div><div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.16em]"><CreditCard className="w-3.5 h-3.5" /> Annual Membership</div><h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">Complete Annual Learning Membership</h1><p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">One annual plan. Full access to the capability curriculum, learning resources, quizzes and verified credentials.</p></div>
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${theme === 'dark' ? 'bg-gradient-to-br from-[#0b1020] via-[#121a30] to-[#0d1222] border-indigo-500/30 text-white' : 'bg-gradient-to-br from-indigo-50 via-white to-slate-50 border-indigo-200 text-slate-900 shadow-sm'}`}>
        <div className="grid lg:grid-cols-12 gap-7 items-center relative">
          <div className="lg:col-span-7"><span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'}`}>{active ? 'Annual Membership Active' : 'Annual Plan'}</span><h2 className={`mt-4 text-3xl sm:text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>₹1,000 / Year</h2><p className={`mt-3 text-sm max-w-xl ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Four foundation courses are free. After membership activation, two additional courses unlock each month for a structured 12-month learning journey.</p><div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold"><span className={`px-3 py-2 rounded-xl ${theme === 'dark' ? 'bg-white/10 text-slate-200 border border-white/10' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>2 courses / month</span><span className={`px-3 py-2 rounded-xl ${theme === 'dark' ? 'bg-white/10 text-slate-200 border border-white/10' : 'bg-cyan-50 text-cyan-700 border border-cyan-100'}`}>Quizzes & progress</span><span className={`px-3 py-2 rounded-xl ${theme === 'dark' ? 'bg-white/10 text-slate-200 border border-white/10' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>Verified certificate</span></div></div>
          <div className={`lg:col-span-5 rounded-[28px] p-5 border shadow-xl ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-950 border-indigo-400/20 text-white' : 'bg-white border-indigo-100 shadow-indigo-100/70 text-slate-950'}`}>
            <div className="flex items-center justify-between">
              <div className={`text-[10px] uppercase tracking-[0.16em] font-black ${theme === 'dark' ? 'text-cyan-300' : 'text-indigo-600'}`}>Your access</div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${theme === 'dark' ? 'bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20' : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100'}`}>{active ? `Month ${subscriptionUnlockedMonths}` : 'Free Access'}</span>
            </div>
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-white/5 dark:via-white/5 dark:to-cyan-500/5 border border-indigo-100 dark:border-white/10 p-4">
              <div className="flex items-end gap-2"><div className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-indigo-700'}`}>{accessibleCount}</div><div className={`pb-1 text-sm font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>accessible courses</div></div>
              <div className="mt-4 h-2.5 rounded-full overflow-hidden bg-indigo-100 dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500" style={{width:`${Math.min(100,Math.round(accessibleCount/Math.max(1,courses.length)*100))}%`}} /></div>
            </div>
            <p className={`mt-3 text-[11px] leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{active ? 'Two additional paid courses become available at the start of each membership month.' : 'Four foundation courses are free. Subscribe to unlock two more paid courses each month.'}</p>
            {!active && <button onClick={() => setCheckoutModalOpen(true)} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400 text-white text-xs font-black shadow-lg shadow-indigo-500/20 transition-all">Get Annual Membership</button>}
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[['22','Capability programs'],['12 mo','Annual validity']].map(([v,l]) => <div key={l} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}><div className="text-2xl font-black text-indigo-500">{v}</div><div className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{l}</div></div>)}
      </div>
    </div>
  );
};

// ==========================================
// 4. LIVE MASTERCLASSES VIEW
// ==========================================
export const LiveSessionsView: React.FC = () => {
  const { liveSessions, registerLiveSession, theme, setCurrentView } = useApp();

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Learning
      </button>
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-2">
          <Video className="w-3.5 h-3.5" />
          <span>Interactive Masterclasses</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Live Faculty Workshops & Replays</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Join interactive live workshops with senior industrial mentors or watch full high-definition recordings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {liveSessions.length === 0 ? (
          <div className={`md:col-span-2 p-10 rounded-3xl border text-center ${theme === 'dark' ? 'bg-[#080d1a] border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-base font-black">Live Sessions Coming Soon</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">Upcoming faculty workshops will appear here with the schedule and registration option as soon as they are announced.</p>
            <span className="inline-flex mt-4 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 text-[10px] font-black uppercase tracking-wider">Coming Soon</span>
          </div>
        ) : liveSessions.map(session => (
          <div
            key={session.id}
            className={`p-6 rounded-3xl border flex flex-col justify-between ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  session.status === 'upcoming'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}>
                  {session.status === 'upcoming' ? '✦ Coming Soon' : 'Recorded Replay'}
                </span>
                <span className="text-xs text-slate-400 font-mono">{session.duration}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{session.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{session.description}</p>

              {/* Speaker Card */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 mt-4">
                <img
                  src={session.speaker.avatar}
                  alt={session.speaker.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{session.speaker.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{session.speaker.title}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  {session.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                  {session.time}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {session.registeredCount} Enrolled
              </span>

              {session.status === 'upcoming' ? (
                <button
                  disabled
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-800/80 border border-slate-700 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              ) : (
                <a
                  href={session.replayUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Watch Replay</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. COMMUNITY & DISCUSSION FORUM VIEW
// ==========================================
export const CommunityView: React.FC = () => {
  const { communityPosts, addCommunityPost, addCommunityReply, togglePostLike, theme, setCurrentView } = useApp();

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Leadership & EQ');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;
    addCommunityPost(newPostTitle, newPostCategory, newPostContent);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  const handleReply = (postId: string) => {
    const text = replyTextMap[postId];
    if (!text) return;
    addCommunityReply(postId, text);
    setReplyTextMap(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Learning
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Peer Learning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">ThinkAHead Community Forum</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Collaborate on capability assignments, discuss real workplace dilemmas, and get mentor feedback.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Ask Question / Start Thread</span>
        </button>
      </div>

      {/* New Post Form Modal */}
      {showNewPostModal && (
        <div className={`p-6 rounded-3xl border shadow-2xl space-y-4 animate-in fade-in ${
          theme === 'dark' ? 'bg-slate-900 border-indigo-500/40' : 'bg-white border-indigo-200'
        }`}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Discussion Topic</h3>
          <form onSubmit={handleCreatePost} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Title / Question</label>
              <input
                type="text"
                required
                value={newPostTitle}
                onChange={e => setNewPostTitle(e.target.value)}
                placeholder="e.g. How do you apply active listening in fast-paced standup meetings?"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Category</label>
              <select
                value={newPostCategory}
                onChange={e => setNewPostCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Leadership & EQ">Leadership & EQ</option>
                <option value="Communication Mastery">Communication Mastery</option>
                <option value="Study Groups">Study Groups</option>
                <option value="Career & Employability">Career & Employability</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Detailed Context</label>
              <textarea
                rows={3}
                required
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="Describe your question or share your insights from the modules..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewPostModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md"
              >
                Publish Topic
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discussion Posts Stream */}
      <div className="space-y-6">
        {communityPosts.map(post => (
          <div
            key={post.id}
            className={`p-6 rounded-3xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Author Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                    <span>{post.author.name}</span>
                    <span className="text-[10px] font-normal text-slate-400">({post.author.role})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                {post.category}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{post.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <button
                onClick={() => togglePostLike(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                  post.likedByMe
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{post.likes} Helpful</span>
              </button>

              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{post.replies.length} Replies</span>
              </span>
            </div>

            {/* Replies Thread */}
            {post.replies.length > 0 && (
              <div className="pl-6 space-y-3 border-l-2 border-slate-100 dark:border-slate-800 mt-3">
                {post.replies.map(rep => (
                  <div key={rep.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{rep.author.name}</span>
                      <span className="text-[10px] text-slate-400">{rep.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rep.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={replyTextMap[post.id] || ''}
                onChange={e => setReplyTextMap({ ...replyTextMap, [post.id]: e.target.value })}
                placeholder="Write an insightful reply or answer..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleReply(post.id)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 6. RESOURCES & HANDBOOKS VIEW
// ==========================================
export const ResourcesView: React.FC = () => {
  const { courses, theme, showToast, setCurrentView } = useApp();

  const allResources = courses.flatMap(c =>
    (c.resources || []).filter(r => r.published === true).map(r => ({ ...r, courseTitle: c.title, courseCategory: c.category }))
  );

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Learning
      </button>
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Offline Study Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Handbooks, Worksheets & Templates</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Download printable executive summaries, self-audit questionnaires, and implementation checklists.
        </p>
      </div>

      {allResources.length === 0 ? (
        <div className={`p-8 rounded-3xl text-center ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white shadow-sm'}`}>
          <FileText className="w-10 h-10 mx-auto text-slate-500 mb-3" />
          <h3 className="font-bold text-base">Handbooks are not available yet</h3>
          <p className="text-xs text-slate-500 mt-1">This section will appear automatically after an administrator publishes handbook content from the backend.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allResources.map((res, i) => (
          <div
            key={i}
            className={`p-5 rounded-3xl border flex flex-col justify-between ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold uppercase">
                  {res.type} • {res.fileSize}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{res.category}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{res.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{res.contentSummary}</p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-2">
                Course: <strong className="text-slate-700 dark:text-slate-200">{res.courseTitle}</strong>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => showToast(`Downloaded "${res.fileName}"`)}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>Download Handbook (PDF)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

// ==========================================
// 7. ACHIEVEMENTS & GAMIFICATION VIEW
// ==========================================
export const AchievementsView: React.FC = () => {
  const { achievements, currentUser, theme, setCurrentView } = useApp();

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Learning
      </button>
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>Milestones & Badges</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Your Capability Accomplishments</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Earn XP points and unlock milestone badges by completing lessons, passing quizzes, and maintaining study streaks.
        </p>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="text-2xl font-black text-amber-400">{currentUser?.points ?? 0}</div>
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Total XP Points</div>
        </div>
        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="text-2xl font-black text-cyan-400">{currentUser?.totalHours ?? 0}h</div>
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Study Hours Logged</div>
        </div>
        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="text-2xl font-black text-rose-400">{currentUser?.streakDays ?? 0} Days</div>
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Consecutive Streak</div>
        </div>
        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="text-2xl font-black text-emerald-400">{achievements.filter(a => a.unlocked).length} / {achievements.length}</div>
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Badges Unlocked</div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {achievements.map(b => (
          <div
            key={b.id}
            className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between ${
              b.unlocked
                ? theme === 'dark'
                  ? 'bg-slate-900/90 border-amber-500/40 text-white'
                  : 'bg-white border-amber-300 shadow-sm text-slate-900'
                : theme === 'dark'
                ? 'bg-slate-900/20 border-slate-800 opacity-50 grayscale'
                : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl mb-2">
              {b.icon}
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{b.title}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{b.description}</p>
            {b.unlocked && (
              <span className="text-[9px] text-emerald-400 font-mono mt-2 block">
                Unlocked {b.unlockedAt}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// ==========================================
 // 8. NOTIFICATIONS
 // ==========================================
export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, theme, setCurrentView } = useApp();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Learning
        </button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-bold mb-2">
          <Bell className="w-3.5 h-3.5" /><span>Account Updates</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Notifications</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Stay updated on courses, payments, certificates and account activity.</p>
          </div>
          <button onClick={() => void markAllNotificationsAsRead()} disabled={unread === 0} className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed">Mark all as read</button>
        </div>
      </div>
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className={`p-10 rounded-3xl border text-center ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <Bell className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="text-sm font-bold">No notifications yet</p>
            <p className="text-xs text-slate-500 mt-1">New account and learning updates will appear here.</p>
          </div>
        ) : notifications.map(n => (
          <button key={n.id} onClick={() => { if (!n.read) void markNotificationAsRead(n.id); }} className={`w-full text-left p-4 rounded-2xl border transition-all ${theme === 'dark' ? (n.read ? 'bg-slate-900/50 border-slate-800' : 'bg-indigo-950/30 border-indigo-500/30') : (n.read ? 'bg-white border-slate-200' : 'bg-indigo-50 border-indigo-200 shadow-sm')}`}>
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-500/10 text-slate-400' : 'bg-indigo-500/10 text-indigo-500'}`}><Bell className="w-4 h-4" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold">{n.title}</h3>{!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">{n.time || ''}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// 8. PROFILE & ACCOUNT SETTINGS
// ==========================================

// ==========================================
// STUDENT PROGRESS VIEW
// ==========================================
export const ProgressView: React.FC = () => {
  const { courses, progressMap, currentUser, overallProgressPercent, theme, setSelectedCourseId, setCurrentView } = useApp();
  const enrolledIds = new Set(currentUser?.enrolledCourseIds || []);
  const enrolled = courses.filter(c => enrolledIds.has(c.id));
  const completed = enrolled.filter(c => progressMap[c.id]?.isCompleted);
  const inProgress = enrolled.filter(c => (progressMap[c.id]?.percent || 0) > 0 && !progressMap[c.id]?.isCompleted);
  const notStarted = enrolled.filter(c => !progressMap[c.id] || (progressMap[c.id]?.percent || 0) === 0);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Learning
        </button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Learning Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">My Progress</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">See your course-by-course progress, completion status and next learning action.</p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4`}>
        {[
          ['Overall Progress', `${overallProgressPercent}%`, 'cyan'],
          ['Enrolled', `${enrolled.length}`, 'blue'],
          ['In Progress', `${inProgress.length}`, 'amber'],
          ['Completed', `${completed.length}`, 'emerald']
        ].map(([label,value,tone]) => (
          <div key={label} className={`p-5 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label}</div>
            <div className={`text-2xl font-black mt-2 ${tone === 'cyan' ? 'text-cyan-500' : tone === 'blue' ? 'text-blue-500' : tone === 'amber' ? 'text-amber-500' : 'text-emerald-500'}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#080d1a] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-extrabold">Course Progress</h2>
            <p className="text-[11px] text-slate-500 mt-1">Progress increases automatically when you complete lessons.</p>
          </div>
          <span className="text-sm font-black text-cyan-500">{overallProgressPercent}%</span>
        </div>
        <div className="space-y-4">
          {enrolled.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No courses enrolled yet.</div>
          ) : enrolled.map(course => {
            const p = progressMap[course.id];
            const percent = p?.percent || 0;
            const done = !!p?.isCompleted;
            return (
              <div key={course.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center gap-4 ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <img src={course.thumbnail} alt={course.title} className="w-20 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold truncate">{course.title}</h3>
                    <span className={`text-xs font-black ${done ? 'text-emerald-500' : 'text-cyan-500'}`}>{percent}%</span>
                  </div>
                  <div className="h-2 mt-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500'}`} style={{width:`${percent}%`}} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{done ? 'Completed' : percent > 0 ? 'In Progress' : 'Not Started'} • {p?.completedLessonIds?.length || 0}/{course.lessonsCount} lessons completed</div>
                </div>
                <button onClick={() => { setSelectedCourseId(course.id); setCurrentView('student-player'); }} className={`px-4 py-2 rounded-xl text-white text-xs font-bold shrink-0 shadow-md ${done ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-600/20' : 'bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 shadow-indigo-600/20'}`}>
                  {done ? 'Review' : 'Continue'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-gradient-to-r from-blue-950/50 via-cyan-950/30 to-slate-900 border-blue-500/20' : 'bg-gradient-to-r from-blue-50 via-cyan-50 to-white border-blue-100 shadow-sm'}`}>
        <h3 className="font-extrabold text-sm">Learning rule</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Every completed lesson updates the progress bar. Finish all lessons (or pass the course quiz) to reach 100% and unlock the next achievement/certificate milestone.</p>
      </div>
    </div>
  );
};

export const ProfileView: React.FC = () => {
  const { currentUser, theme, updateProfile, uploadProfilePhoto, showToast, setCurrentView } = useApp();
  const isAdmin = currentUser?.role === 'admin';
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [photoPreview, setPhotoPreview] = useState(currentUser?.avatar || '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setName(currentUser?.name || '');
    setPhone(currentUser?.phone || '');
    setBio(currentUser?.bio || '');
    setPhotoPreview(currentUser?.avatar || '');
  }, [currentUser?.id, currentUser?.name, currentUser?.phone, currentUser?.bio, currentUser?.avatar]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your name.');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim(), bio: bio.trim() });
    } finally {
      setSaving(false);
    }
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('Profile photo must be 2MB or smaller.');
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
    await uploadProfilePhoto(file);
  };

  const initials = (name.trim() || 'L').charAt(0).toUpperCase();
  const roleLabel = isAdmin ? 'Founder Director' : 'Learner';

  return (
    <div className="min-h-full px-4 py-6 sm:px-8 sm:py-8">
      {/* Admins land here too, so send them back where they came from. */}
      <button onClick={() => setCurrentView(isAdmin ? 'admin-dashboard' : 'student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
        <ArrowLeft className="w-4 h-4" /> {isAdmin ? 'Back to Overview' : 'Back to Learning'}
      </button>
      <div className="max-w-5xl mx-auto">
        {/* Profile hero — centered like a polished real-world account page */}
        <section className={`relative overflow-hidden rounded-[2rem] shadow-2xl ${
          theme === 'dark'
            ? 'bg-[#0d1426] border border-slate-800'
            : 'bg-white border border-slate-200 shadow-slate-200/70'
        }`}>
          <div className="relative h-36 sm:h-44 overflow-hidden bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,.22),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,.18),transparent_28%)]" />
            <div className="absolute -right-16 -top-24 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div className="text-white font-black uppercase tracking-[0.28em] text-sm sm:text-base drop-shadow-lg">
                ThinkAHead Learning Hub
              </div>
            </div>
          </div>

          <div className="relative px-5 sm:px-8 pb-7">
            <div className="-mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="relative shrink-0 self-center sm:self-auto">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_16px_45px_rgba(37,99,235,.28)]">
                  <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center ring-4 ${theme === 'dark' ? 'bg-slate-900 ring-slate-950' : 'bg-slate-100 ring-white'}`}>
                    {photoPreview ? (
                      <img src={photoPreview} alt={name || 'Profile'} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl sm:text-6xl font-black text-white bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 w-full h-full flex items-center justify-center">
                        {initials}
                      </span>
                    )}
                  </div>
                </div>
                <label className="absolute right-1 bottom-1 w-11 h-11 rounded-full bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-xl ring-4 ring-white dark:ring-slate-900 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" title="Change profile photo">
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={handlePhoto} />
                  <Camera className="w-5 h-5" />
                </label>
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left sm:pb-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> {roleLabel}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-slate-900 dark:text-white break-words">
                  {name || 'Your Name'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 break-all">{currentUser?.email}</p>
              </div>

              <div className="sm:pb-2 self-center sm:self-auto">
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                  currentUser?.subscription?.active
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentUser?.subscription?.active ? currentUser.subscription.plan : 'Free Access'}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Editable account details */}
        <form onSubmit={handleSave} className={`mt-6 rounded-[2rem] p-5 sm:p-7 shadow-xl ${
          theme === 'dark' ? 'bg-[#0d1426] border border-slate-800' : 'bg-white border border-slate-200 shadow-slate-200/60'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-500">Personal information</div>
              <h2 className="text-lg sm:text-xl font-black mt-1">Your Profile</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">The name and photo you save here are used across your dashboard and certificates.</p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-xl self-start">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved to your account
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={name} onChange={e => setName(e.target.value)} maxLength={120} required className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10" placeholder="Enter your full name" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">This starts with the name entered during registration, and you can change it anytime.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                <input value={currentUser?.email || ''} readOnly className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm text-slate-500 cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} maxLength={30} className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" placeholder="Add your phone number" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Account Role</label>
              <div className="px-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300">
                {roleLabel}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">About You</label>
            <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} maxLength={1000} className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-y" placeholder="Tell us a little about yourself..." />
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-[10px] text-slate-400">Profile photo: JPG, PNG, WEBP or GIF • maximum 2MB</p>
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs text-white bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-600/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SettingsView: React.FC = () => {
  const { currentUser, theme, setTheme, updateSettings, setCurrentView } = useApp();
  const [emailNotifications, setEmailNotifications] = useState((currentUser as any)?.emailNotifications ?? true);

  const save = async () => {
    await updateSettings({ emailNotifications });
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Learning
        </button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Account Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Control your account preferences, appearance and notifications.</p>
      </div>

      <div className={`p-6 rounded-3xl border space-y-6 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div>
          <h3 className="font-bold text-sm">Appearance</h3>
          <div className="flex gap-2 mt-3">
            {(['dark','light'] as const).map(mode => (
              <button key={mode} onClick={() => setTheme(mode)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize ${theme === mode ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{mode} mode</button>
            ))}
          </div>
        </div>
        <div className="pt-5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button type="button" onClick={() => setCurrentView('student-notifications')} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-left hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all group">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-bold"><Bell className="w-4 h-4 text-indigo-500" /> Notifications</span><ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" /></div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">View and manage your learning and account updates.</p>
          </button>
          <button type="button" onClick={() => setCurrentView('student-help')} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-left hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all group">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-bold"><MessageCircle className="w-4 h-4 text-cyan-500" /> Help &amp; Support</span><ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" /></div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Find resources or contact the learner support team.</p>
          </button>
        </div>
        <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div><h3 className="font-bold text-sm">Email notifications</h3><p className="text-xs text-slate-500 mt-1">Receive important course, payment and account updates.</p></div>
          <button onClick={() => setEmailNotifications(v => !v)} className={`w-11 h-6 rounded-full transition-colors ${emailNotifications ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}><span className={`block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${emailNotifications ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
        </div>
        <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div><h3 className="font-bold text-sm">Account status</h3><p className="text-xs text-slate-500 mt-1">{currentUser?.emailVerified ? 'Email verified' : 'Email verification pending'}</p></div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">ACTIVE</span>
        </div>
        <div className="flex justify-end pt-2"><button onClick={save} className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500">Save Settings</button></div>
      </div>
    </div>
  );
};

// ==========================================
// 9. MESSAGES & MENTOR CHAT VIEW
// ==========================================
export const MessagesView: React.FC = () => {
  const { chatThreads, activeChatId, setActiveChatId, sendMessage, theme, setCurrentView } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const activeThread = chatThreads.find(t => t.id === activeChatId) || chatThreads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeThread) return;
    void sendMessage(activeThread.id, inputMsg);
    setInputMsg('');
  };

  if (!activeThread) return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-black tracking-tight">Messages</h1>
      <div className="mt-6 p-8 rounded-3xl bg-slate-900/60 text-center">
        <MessageCircle className="w-10 h-10 mx-auto text-slate-500 mb-3" />
        <p className="text-sm font-bold">No messages yet</p>
        <p className="text-xs text-slate-500 mt-1">Your mentor/support thread will appear here when the backend assigns one.</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
      <button onClick={() => setCurrentView('student-dashboard')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 ring-1 ring-cyan-400/30 shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Learning
      </button>
      <div className="mb-4">
        <h1 className="text-2xl font-black tracking-tight">Mentor & Support Chat</h1>
        <p className="text-xs text-slate-400">Direct asynchronous channel with IHCDR executive mentors.</p>
      </div>

      <div className={`flex-1 grid grid-cols-1 md:grid-cols-12 rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        {/* Threads List */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Conversations</div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {chatThreads.map(th => (
              <button
                key={th.id}
                onClick={() => setActiveChatId(th.id)}
                className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                  activeChatId === th.id
                    ? 'bg-indigo-600/10 border-l-4 border-indigo-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="relative">
                  <img
                    src={th.user.avatar}
                    alt={th.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {th.user.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{th.user.name}</span>
                    <span className="text-[10px] text-slate-400">{th.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{th.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Chat Window */}
        <div className="md:col-span-8 flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
            <div className="flex items-center gap-3">
              <img
                src={activeThread.user.avatar}
                alt={activeThread.user.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{activeThread.user.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{activeThread.user.role}</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Online Mentor
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {activeThread.messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col ${m.isSender ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                    m.isSender
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-700 rounded-bl-none border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-slate-50 dark:bg-slate-950/40">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              placeholder="Type your question or assignment feedback query..."
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
