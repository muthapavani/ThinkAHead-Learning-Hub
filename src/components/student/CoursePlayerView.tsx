import React, { useEffect, useMemo, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  RotateCcw,
  CheckCircle2,
  Circle,
  FileText,
  HelpCircle,
  Download,
  Share2,
  Award,
  ArrowLeft,
  ListChecks,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourseLesson, QuizQuestion } from '../../types';
import confetti from 'canvas-confetti';

export const CoursePlayerView: React.FC = () => {
  const {
    currentUser,
    courses,
    selectedCourseId,
    setCurrentView,
    progressMap,
    markLessonComplete,
    saveLessonNote,
    submitQuiz,
    theme,
    certificates,
    setActiveCertificate,
    setViewCertificateModal,
    showToast
  } = useApp();

  const currentCourse =
    courses.find(c => c.id === selectedCourseId) || courses[0];

  useEffect(() => {
    setActiveModuleIndex(0);
    setActiveLessonIndex(0);
    setActiveTab('overview');
    setIsPlaying(false);
    setShowCompletionCelebration(false);
    setStartingQuizAnswers({});
    setStartingQuizSubmitted(false);
    setStartingQuizScore(null);
    setFinalQuizAnswers({});
    setFinalQuizSubmitted(false);
    setFinalQuizScore(null);
  }, [selectedCourseId]);

  // Restore quiz results saved on the learner progress record so the
  // improvement comparison remains visible when the course is reopened.
  useEffect(() => {
    const saved = progressMap[selectedCourseId];
    setStartingQuizScore(saved?.startingQuizResult?.percentage ?? null);
    setStartingQuizSubmitted(!!saved?.startingQuizResult);
    setFinalQuizScore(saved?.quizResult?.percentage ?? null);
    setFinalQuizSubmitted(!!saved?.quizResult);
  }, [selectedCourseId, progressMap]);

  // Active module & lesson tracking
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'resources' | 'curriculum' | 'quizzes'>('overview');

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [studentNotes, setStudentNotes] = useState(
    'Key takeaway: Level 4 leadership is People Development. Great leaders produce more leaders, not followers.\nAction item: Schedule weekly 1-on-1 development reviews.'
  );

  // Quiz state
  const [startingQuizAnswers, setStartingQuizAnswers] = useState<Record<string, number>>({});
  const [startingQuizSubmitted, setStartingQuizSubmitted] = useState(false);
  const [startingQuizScore, setStartingQuizScore] = useState<number | null>(null);
  const [finalQuizAnswers, setFinalQuizAnswers] = useState<Record<string, number>>({});
  const [finalQuizSubmitted, setFinalQuizSubmitted] = useState(false);
  const [finalQuizScore, setFinalQuizScore] = useState<number | null>(null);


  if (!currentCourse) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-slate-400">Loading course content…</div>;
  }
  const progress = progressMap[currentCourse.id];

  const activeModule = currentCourse.modules?.[activeModuleIndex] || currentCourse.modules?.[0];
  if (!activeModule || !activeModule.lessons?.length) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-[#070b16] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-xl">
          <BookOpen className="w-10 h-10 mx-auto text-indigo-500 mb-4" />
          <h2 className="text-xl font-black">Course content is being prepared</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">This course does not have lessons yet. You can return to the dashboard without seeing a blank page.</p>
          <button onClick={() => setCurrentView('student-dashboard')} className="mt-6 px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-600 via-indigo-600 to-blue-600 shadow-lg">Back to Dashboard</button>
        </div>
      </div>
    );
  }
  const activeLesson: CourseLesson =
    activeModule?.lessons[activeLessonIndex] || activeModule?.lessons[0] || {
      id: 'dummy',
      title: 'Introduction to Capability Architecture',
      duration: '12:45',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    };

  const activeVideoUrl: string =
    (activeLesson.videoUrls && activeLesson.videoUrls.length ? activeLesson.videoUrls[0] : activeLesson.videoUrl) || '';

  // Hosted platforms have to be embedded in an iframe; a plain file can go
  // straight into <video>. Anything unrecognised is treated as a file.
  const embedUrl: string | null = useMemo(() => {
    const raw = activeVideoUrl.trim();
    if (!raw) return null;

    let url: URL;
    try { url = new URL(raw); } catch { return null; }
    const host = url.hostname.replace(/^www\./, '');

    // youtu.be/ID · youtube.com/watch?v=ID · /embed/ID · /shorts/ID · /live/ID
    if (host === 'youtu.be' || host.endsWith('youtube.com') || host === 'youtube-nocookie.com') {
      let id = '';
      if (host === 'youtu.be') id = url.pathname.slice(1);
      else if (url.searchParams.get('v')) id = url.searchParams.get('v') || '';
      else {
        const m = url.pathname.match(/\/(embed|shorts|live|v)\/([^/?#]+)/);
        if (m) id = m[2];
      }
      id = id.split(/[/?#]/)[0];
      if (!id) return null;
      const params = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' });
      // Keep a ?t=90 or &start=90 deep link working.
      const start = url.searchParams.get('start') || url.searchParams.get('t');
      if (start) params.set('start', String(parseInt(start, 10) || 0));
      return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean).pop() || '';
      return /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }

    // Google Drive share links need the /preview form.
    if (host === 'drive.google.com') {
      const m = url.pathname.match(/\/file\/d\/([^/]+)/);
      const id = m ? m[1] : url.searchParams.get('id');
      return id ? `https://drive.google.com/file/d/${id}/preview` : null;
    }

    return null;
  }, [activeVideoUrl]);

  // Marks the lesson watched without moving on. Used by the video's own end
  // event and by the checkbox in the curriculum list, since the old
  // "Mark Complete & Next" button was removed.
  const completeLesson = async (courseId: string, lessonId: string, title: string) => {
    if (progress?.completedLessonIds?.includes(lessonId)) return;
    await markLessonComplete(courseId, lessonId);
    showToast(`Lesson completed: ${title}`);
  };

  // The download attribute is ignored for cross-origin links, so the browser
  // just opens the PDF in a new tab. Fetching the bytes and saving them from a
  // blob URL keeps it a real download.
  const downloadResource = async (res: any) => {
    setDownloadingId(res.id);
    try {
      const url = `${res.downloadUrl}${res.downloadUrl.includes('?') ? '&' : '?'}download=1`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = res.fileName || `${res.title || 'resource'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      showToast(`Downloaded: ${res.title}`);
    } catch (e: any) {
      showToast(e?.message ? `Could not download that file: ${e.message}` : 'Could not download that file.');
    } finally {
      setDownloadingId(null);
    }
  };

  const toggleLessonComplete = async (lessonId: string, title: string, isComplete: boolean) => {
    if (isComplete) { showToast('This lesson is already marked as watched.'); return; }
    await markLessonComplete(currentCourse.id, lessonId);
    showToast(`Lesson completed: ${title}`);
  };

  const handleLessonNext = async () => {
    await markLessonComplete(currentCourse.id, activeLesson.id);
    showToast(`Lesson completed: ${activeLesson.title}`);

    if (activeLessonIndex + 1 < activeModule.lessons.length) {
      setActiveLessonIndex(activeLessonIndex + 1);
      return;
    }
    if (activeModuleIndex + 1 < currentCourse.modules.length) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveLessonIndex(0);
      return;
    }

    setShowCompletionCelebration(false);
    showToast('All lessons completed. Your Final Quiz is now unlocked in the Quizzes tab.');
    setActiveTab('quizzes');
  };

  const handleQuizSubmit = async (phase: 'starting' | 'final') => {
    const source: any = phase === 'starting'
      ? ((currentCourse as any).startingQuiz?.questions?.length ? (currentCourse as any).startingQuiz : (currentCourse as any).quiz)
      : (currentCourse as any).quiz;
    const questions = source?.questions || [];
    if (!questions.length) return;
    const answers = phase === 'starting' ? startingQuizAnswers : finalQuizAnswers;
    const result = await submitQuiz(currentCourse.id, answers, phase);
    if (phase === 'starting') {
      setStartingQuizScore(result.percentage);
      setStartingQuizSubmitted(true);
      showToast(`Starting Quiz score: ${result.percentage}%`);
    } else {
      setFinalQuizScore(result.percentage);
      setFinalQuizSubmitted(true);
      if (result.passed) {
        try { confetti({ particleCount: 180, spread: 90, origin: { y: 0.55 } }); } catch {}
        setShowCompletionCelebration(true);
        showToast(`🎉 Final Quiz passed with ${result.percentage}%! Course completed.`);
      } else {
        showToast(`Final Quiz score: ${result.percentage}%. Minimum passing grade is 70%. Please review and retry.`);
      }
    }
  };


  const allLessons = currentCourse.modules.flatMap(mod => mod.lessons || []);
  const allLessonsCompleted = allLessons.length > 0 && allLessons.every(lesson => progress?.completedLessonIds?.includes(lesson.id));
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter(lesson => progress?.completedLessonIds?.includes(lesson.id)).length;
  const lessonPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const renderQuizSection = (
    phase: 'starting' | 'final',
    answers: Record<string, number>,
    setAnswers: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    submitted: boolean,
    score: number | null
  ) => {
    const isFinal = phase === 'final';
    // Each phase has its own question set; the starting quiz falls back to the
    // final one only when no separate starting quiz was configured.
    const quizData: any = isFinal
      ? (currentCourse as any).quiz
      : ((currentCourse as any).startingQuiz?.questions?.length ? (currentCourse as any).startingQuiz : (currentCourse as any).quiz);
    const questions = quizData?.questions || [];
    return (
      <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${isFinal ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>
              {isFinal ? 'After Course Completion' : 'Before You Start'}
            </div>
            <h3 className="mt-2 text-base font-black text-slate-900 dark:text-slate-100">{isFinal ? 'Final Course Quiz' : 'Starting Quiz'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isFinal ? `Complete all lessons, then pass this quiz with ${currentCourse.quiz?.passingScorePercentage || 70}% or higher.` : 'Take this short assessment before learning to measure your starting knowledge.'}
            </p>
          </div>
          {submitted && score !== null && (
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${score >= (currentCourse.quiz?.passingScorePercentage || 70) ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'}`}>
              Score: {score}%
            </span>
          )}
        </div>
        {!questions.length ? (
          <p className="text-xs text-slate-500">No quiz questions have been added for this course yet.</p>
        ) : (
          <>
            <div className="space-y-5">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="space-y-3">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{qIndex + 1}. {q.question}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = answers[q.id] === optIndex;
                      return (
                        <button key={optIndex} type="button" onClick={() => setAnswers(prev => ({ ...prev, [q.id]: optIndex }))}
                          className={`p-3 rounded-2xl text-xs font-medium text-left border transition-all ${isSelected ? 'bg-indigo-600/10 border-indigo-500 text-indigo-700 dark:bg-indigo-600/30 dark:text-indigo-200 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/40 dark:border-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                          <span className="font-bold mr-2">{String.fromCharCode(65 + optIndex)}.</span><span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => void handleQuizSubmit(phase)} disabled={isFinal && !allLessonsCompleted}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
              <span>{isFinal && !allLessonsCompleted ? 'Complete All Lessons to Unlock Final Quiz' : submitted ? 'Retake Quiz & Recalculate Score' : 'Submit Quiz & Calculate Score'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );
  };


  return (
    <div
      className={`min-h-screen transition-colors duration-200 relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#070b18] via-[#111b46] to-[#06384b] text-white'
          : 'bg-gradient-to-br from-[#f7f9ff] via-[#eeeaff] to-[#e9fbff] text-slate-900'
      }`}
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      {/* Top Header Bar */}
      <div
        className={`relative px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 sticky top-0 z-30 backdrop-blur-md ${
          theme === 'dark' ? 'bg-[#0a0f1d]/90 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setCurrentView('student-dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black shadow-lg transition-all ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 text-white ring-1 ring-cyan-400/30 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 shadow-indigo-500/25'
                : 'bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 text-white ring-1 ring-cyan-400/30 hover:from-indigo-500 hover:via-cyan-400 hover:to-blue-500 shadow-indigo-500/25'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold truncate text-slate-900 dark:text-slate-100 leading-tight">{currentCourse.title}</h1>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentCourse.category}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span>{completedCount} of {totalLessons} lessons done</span>
            </div>
          </div>
        </div>

        {/* Certificate trigger if completed */}
        <div className="flex items-center gap-3">
          {progress?.isCompleted ? (
            <button
              onClick={() => {
                setActiveCertificate(certificates[0]);
                setViewCertificateModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all animate-pulse"
            >
              <Award className="w-3.5 h-3.5" />
              <span>View Certificate</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Progress</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{lessonPercent}%</span>
            </div>
          )}
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-slate-200/70 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-[width] duration-500"
            style={{ width: `${lessonPercent}%` }}
          />
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex flex-col max-w-[1100px] mx-auto w-full">
        {/* Video player, tabs, then the module list underneath */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* 1. Custom Interactive Video Player */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl group flex flex-col justify-between">
            {/* Admin-managed course video. YouTube and Vimeo links are embedded,
                direct files (MP4/WebM, e.g. from R2) use the native player. */}
            {embedUrl ? (
              <iframe
                key={activeLesson.id}
                className="absolute inset-0 w-full h-full"
                src={embedUrl}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                frameBorder="0"
              />
            ) : (
              <video
                key={activeLesson.id}
                className="absolute inset-0 w-full h-full object-cover"
                src={activeVideoUrl}
                poster={currentCourse.bannerImage || currentCourse.thumbnail}
                controls
                playsInline
                onPlay={() => setIsPlaying(true)}
              onEnded={() => { setIsPlaying(false); void completeLesson(currentCourse.id, activeLesson.id, activeLesson.title); }}
                onPause={() => setIsPlaying(false)}
              />
            )}
            {!embedUrl && <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/10 to-transparent" />}

            {/* Top Video Header */}
            <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-600/80 text-white font-mono text-[10px] font-bold">
                  {activeModule.title}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {activeLesson.title}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">{activeLesson.duration}</span>
            </div>
            {!embedUrl && <div className="relative z-10 px-4 pb-4 mt-auto pointer-events-none">
              <div className="max-w-xl rounded-2xl border border-white/15 bg-slate-950/75 backdrop-blur-xl p-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <img src={currentCourse.thumbnail} alt="" className="w-14 h-10 rounded-lg object-cover border border-white/10" />
                  <div className="min-w-0">
                    <div className="text-[9px] uppercase tracking-[0.18em] text-cyan-300 font-bold">{currentCourse.category} • {currentCourse.level}</div>
                    <div className="text-sm font-extrabold text-white truncate">{currentCourse.title}</div>
                    <div className="text-[10px] text-slate-300 truncate">{currentCourse.shortDescription}</div>
                  </div>
                  <span className="ml-auto shrink-0 px-2 py-1 rounded-lg bg-white/10 text-[9px] font-bold text-white border border-white/10">{currentCourse.lessonsCount} Lessons</span>
                </div>
              </div>
            </div>}

            {!embedUrl && <div className="absolute left-4 bottom-4 z-10 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-white pointer-events-none">
              {isPlaying ? 'Now Playing' : 'Ready to Play'} • {activeLesson.duration}
            </div>}
          </div>

          {/* Lesson Action Bar */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{activeLesson.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Instructor: {typeof currentCourse.instructor === 'object' ? currentCourse.instructor?.name : currentCourse.instructor} {typeof currentCourse.instructor === 'object' && currentCourse.instructor?.title ? `(${currentCourse.instructor.title})` : ''}
              </p>
            </div>

          </div>

          {showCompletionCelebration && (
            <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-7 ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-indigo-950/70 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 via-white to-indigo-50 border-emerald-200 shadow-lg shadow-emerald-100/70'}`}>
              <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-emerald-400/15 blur-3xl" />
              <div className="relative flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-xl"><Sparkles className="w-8 h-8" /></div>
                <div className="min-w-0 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-[9px] font-black uppercase tracking-[0.16em]">Course Completed 🎉</div>
                  <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Congratulations!</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300"><span className="font-black">{currentCourse.title}</span> has been completed successfully.</p>
                </div>
                <div className="sm:ml-auto flex gap-2 shrink-0">
                  <button onClick={() => setShowCompletionCelebration(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Continue Here</button>
                  <button onClick={() => setCurrentView('student-my-learning')} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white text-xs font-black shadow-lg">My Learning</button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Course Workspace Tabs */}
          <div className="space-y-4">
            <div className={`flex gap-1 overflow-x-auto -mx-1 px-1 text-xs font-semibold border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              {[
                { id: 'overview', label: 'Overview & Objectives', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: 'notes', label: 'Interactive Notes', icon: <FileText className="w-3.5 h-3.5" /> },
                { id: 'resources', label: 'Handbooks & PDFs', icon: <Download className="w-3.5 h-3.5" /> },
                { id: 'curriculum', label: 'Course Curriculum', icon: <ListChecks className="w-3.5 h-3.5" /> },
                { id: 'quizzes', label: 'Quizzes', icon: <ClipboardCheck className="w-3.5 h-3.5" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold -mb-px'
                      : 'border-b-2 border-transparent -mb-px text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className={`p-6 rounded-3xl border space-y-5 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">About This Course</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {currentCourse.longDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-2">Key Learning Outcomes</h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {currentCourse.learningOutcomes.map((out, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-2">Target Audience</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {currentCourse.targetAudience}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-200">Prerequisites: </span>
                      {currentCourse.prerequisites}
                    </div>
                  </div>
                </div>

              </div>
            )}


            {/* TAB CONTENT: QUIZZES */}
            {activeTab === 'quizzes' && (
              // Side by side so the final quiz is visible without scrolling past
              // the starting one. Stacks on narrow screens.
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
              <div className="pt-1">
                {renderQuizSection('starting', startingQuizAnswers, setStartingQuizAnswers, startingQuizSubmitted, startingQuizScore)}
              </div>

              {(allLessonsCompleted || finalQuizSubmitted) && (
                <div className="pt-1">
                  {renderQuizSection('final', finalQuizAnswers, setFinalQuizAnswers, finalQuizSubmitted, finalQuizScore)}
                  {finalQuizSubmitted && startingQuizScore !== null && finalQuizScore !== null && (
                    <div className={`mt-4 p-5 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-indigo-500">Learning Improvement</div>
                          <h4 className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">Starting Quiz vs Final Quiz</h4>
                        </div>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3"><div className="text-[10px] font-bold text-slate-500">Starting</div><div className="mt-1 text-xl font-black">{startingQuizScore}%</div></div>
                        <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 p-3"><div className="text-[10px] font-bold text-slate-500">Final</div><div className="mt-1 text-xl font-black text-indigo-600 dark:text-indigo-300">{finalQuizScore}%</div></div>
                        <div className={`rounded-2xl p-3 ${finalQuizScore - startingQuizScore >= 0 ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10'}`}><div className="text-[10px] font-bold text-slate-500">Improvement</div><div className={`mt-1 text-xl font-black ${finalQuizScore - startingQuizScore >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>{finalQuizScore - startingQuizScore >= 0 ? '+' : ''}{finalQuizScore - startingQuizScore}%</div></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

                {!allLessonsCompleted && !finalQuizSubmitted && (
                  <div className={`p-5 rounded-3xl border border-dashed text-center ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                    <Lock className="w-5 h-5 mx-auto mb-2 opacity-60" />
                    <div className="text-xs font-bold">Final quiz is locked</div>
                    <p className="text-[11px] mt-1">Finish every lesson in the curriculum to unlock it.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: NOTES */}
            {activeTab === 'notes' && (
              <div className={`p-6 rounded-3xl border space-y-3 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Personal Synchronized Study Notes
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Auto-saved to profile</span>
                </div>
                <textarea
                  rows={8}
                  value={studentNotes}
                  onChange={e => setStudentNotes(e.target.value)}
                  onBlur={() => void saveLessonNote(currentCourse.id, activeLesson.id, studentNotes)}
                  placeholder="Type notes, time-stamped thoughts, or key formulas here..."
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => showToast('Notes downloaded as text file!')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Notes (.TXT)</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: RESOURCES */}
            {activeTab === 'resources' && (
              <div className={`p-6 rounded-3xl border space-y-3 ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Course Handbooks & Action Worksheets
                </h3>
                <div className="space-y-2">
                  {currentCourse.resources.map(res => (
                    <div
                      key={res.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{res.title}</h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">{res.type} • {res.size}</span>
                        </div>
                      </div>
                      {res.downloadUrl ? (
                        <button
                          type="button"
                          disabled={downloadingId === res.id}
                          onClick={() => void downloadResource(res)}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-blue-600 hover:text-white dark:bg-slate-700 dark:hover:bg-blue-600 text-slate-700 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-60"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadingId === res.id ? 'Downloading…' : 'Download'}</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold">Not uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CURRICULUM */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              Course Curriculum ({currentCourse.modules.length} Modules)
            </h3>

            {currentCourse.modules.map((mod, modIdx) => (
              <div
                key={mod.id}
                className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'}`}
              >
                {/* Module Header */}
                <button
                  onClick={() => setActiveModuleIndex(modIdx)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      Module {modIdx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{mod.title}</h4>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      activeModuleIndex === modIdx ? 'rotate-180 text-indigo-500 dark:text-indigo-400' : ''
                    }`}
                  />
                </button>

                {/* Lessons in Module */}
                {activeModuleIndex === modIdx && (
                  <div className={`p-2 pt-0 space-y-1 border-t ${theme === 'dark' ? 'border-slate-800/60' : 'border-slate-100'}`}>
                    {mod.lessons.map((les, lesIdx) => {
                      const isComplete = progress?.completedLessonIds?.includes(les.id);
                      const isSelected = activeLessonIndex === lesIdx;

                      return (
                        <div
                          key={les.id}
                          className={`w-full p-2.5 rounded-xl flex items-center justify-between gap-2 text-xs transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold shadow-sm'
                              : isComplete
                              ? 'bg-slate-50 text-slate-600 dark:bg-slate-800/30 dark:text-slate-300'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {/* The tick is its own control. A YouTube embed cannot
                              report that a video finished, so the learner marks
                              the lesson watched from here. */}
                          <button
                            type="button"
                            title={isComplete ? 'Already watched' : 'Mark as watched'}
                            onClick={() => void toggleLessonComplete(les.id, les.title, !!isComplete)}
                            className="shrink-0"
                          >
                            {isComplete
                              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                              : <Circle className={`w-4 h-4 hover:text-emerald-500 ${isSelected ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`} />}
                          </button>

                          <button
                            type="button"
                            onClick={() => { setActiveLessonIndex(lesIdx); setIsPlaying(true); }}
                            className="flex items-center gap-2 min-w-0 flex-1 text-left"
                          >
                            {isSelected && <Play className="w-3.5 h-3.5 text-white shrink-0 fill-white" />}
                            <span className="truncate">{les.title}</span>
                          </button>

                          <span className={`text-[10px] font-mono shrink-0 pl-2 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                            {les.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
              </div>
            )}


          </div>
        </div>

      </div>

    </div>
  );
};
