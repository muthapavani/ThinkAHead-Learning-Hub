import React, { useEffect, useState } from 'react';
import {
  Users,
  BookOpen,
  CreditCard,
  Award,
  TrendingUp,
  Bell,
  Search,
  Filter,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Trash2,
  Sparkles,
  Lock,
  DollarSign,
  Calendar,
  Send,
  BarChart3,
  Settings,
  ShieldCheck,
  Clock,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, AppNotification } from '../../types';
import { api } from '../../services/api';

// ==========================================
// 1. ADMIN DASHBOARD OVERVIEW
// ==========================================
export const AdminDashboardView: React.FC = () => {
  const { payments, setCurrentView, theme, showToast } = useApp();
  const [stats, setStats] = useState<any>({
    students: 0, annualMembers: 0, revenue: 0, certificates: 0,
    completedCourses: 0, quizAttempts: 0, quizPassed: 0, quizPassRate: 0,
    averageProgress: 0, totalStudyHours: 0, courses: 0
  });

  const loadStats = async () => {
    try {
      const r = await api<any>('/admin/dashboard');
      setStats(r.stats || {});
    } catch (e: any) {
      showToast(e.message || 'Unable to load live dashboard statistics.');
    }
  };
  useEffect(() => { void loadStats(); const timer = window.setInterval(() => void loadStats(), 30000); return () => window.clearInterval(timer); }, []);

  const cards = [
    ['Total Learners', stats.students, 'Registered student accounts', Users, 'blue'],
    ['Annual Members', stats.annualMembers, 'Active paid memberships', CreditCard, 'emerald'],
    ['Total Collections', `₹${Number(stats.revenue || 0).toLocaleString('en-IN')}`, 'Successful payments only', TrendingUp, 'amber'],
    ['Certificates Issued', stats.certificates, 'Certificates generated', Award, 'purple']
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-[#070b16] border-rose-500/30 text-white'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-slate-700 text-white shadow-xl'
      }`}>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Live Executive Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">ThinkAHead Capability Platform Operations</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">All headline numbers are calculated from learners, courses, progress, quizzes, certificates and successful payments in MongoDB.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(([label,value,sub,Icon,accent]: any) => (
          <div key={label} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
              <div className={`p-2 rounded-xl bg-${accent}-500/10 text-${accent}-400`}><Icon className="w-4 h-4" /></div>
            </div>
            <div className="text-2xl font-black mt-2">{value}</div>
            <div className="text-[11px] text-slate-400 font-semibold mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          ['Courses', stats.courses || 0],
          ['Avg. Progress', `${stats.averageProgress || 0}%`],
          ['Quiz Attempts', stats.quizAttempts || 0],
          ['Quiz Pass Rate', `${stats.quizPassRate || 0}%`],
          ['Study Time', `${stats.totalStudyHours || 0} hrs`]
        ].map(([label,value]) => (
          <div key={label} className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</div>
            <div className="text-xl font-black mt-1">{value}</div>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold">Recent Successful Collections</h3>
            <p className="text-[11px] text-slate-400 mt-1">Live payment records used for the total collection KPI.</p>
          </div>
          <button onClick={() => setCurrentView('admin-subscriptions')} className="admin-view-payments text-xs font-bold text-indigo-500 hover:underline bg-transparent border-0 p-0">View Payments</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr><th className="py-2.5">Learner</th><th>Transaction</th><th>Amount</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {payments.filter(p => p.status === 'Successful').slice(0, 8).map(p => (
                <tr key={p.id}>
                  <td className="py-3 font-bold">{p.studentName}</td>
                  <td className="font-mono text-[10px] text-slate-500">{p.transactionId}</td>
                  <td className="font-bold text-emerald-500">₹{p.amount}</td>
                  <td className="text-slate-500">{p.date}</td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500">Successful</span></td>
                </tr>
              ))}
              {!payments.filter(p => p.status === 'Successful').length && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">No successful payments yet — collections stay at ₹0.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button onClick={() => setCurrentView('admin-courses')} className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"><BookOpen className="w-4 h-4 mx-auto mb-1"/>Manage Courses</button>
        <button onClick={() => setCurrentView('admin-students')} className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"><Users className="w-4 h-4 mx-auto mb-1"/>Learners</button>
        <button onClick={() => setCurrentView('admin-analytics')} className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"><BarChart3 className="w-4 h-4 mx-auto mb-1"/>Analytics</button>
        <button onClick={() => setCurrentView('admin-certificates')} className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"><Award className="w-4 h-4 mx-auto mb-1"/>Certificates</button>
      </div>
    </div>
  );
};

export const AdminStudentsView: React.FC = () => {
  const { theme, showToast } = useApp();
  const [selectedLearner, setSelectedLearner] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  useEffect(() => {
    void api<any>(`/admin/students?search=${encodeURIComponent(searchTerm)}`)
      .then(r => setStudents((r.students || []).map((s:any) => ({
        ...s,
        plan: s.subscription?.plan || 'Free Trial',
        coursesCompleted: s.completedCourseIds?.length || 0,
        streak: s.streakDays || 0,
        joined: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-GB') : '-',
        status: s.subscription?.active ? 'Active' : 'Trial'
      }))))
      .catch(e => showToast(e.message));
  }, [searchTerm]);

  const filtered = students;

  const grantMonthAccess = async (studentId: string, months: number) => {
    try {
      const r = await api<any>(`/admin/students/${studentId}/access`, { method: 'PATCH', body: JSON.stringify({ unlockedMonths: months }) });
      setStudents(prev => prev.map(student => student.id === studentId ? { ...student, subscription: r.user.subscription, plan: r.user.subscription?.plan || student.plan, status: r.user.subscription?.active ? 'Active' : 'Trial' } : student));
      showToast(`Access granted through Month ${months}.`);
    } catch (e: any) {
      showToast(e.message || 'Unable to update learner access.');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Learner Directory</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage student records, enrollment status, and progress metrics.
          </p>
        </div>

        <button
          onClick={() => showToast('Exported student directory CSV')}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Learner CSV</span>
        </button>
      </div>

      <div className={`p-6 rounded-3xl border space-y-4 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
        {/* Search */}
        <div className="relative max-w-md">
          <Search className={`w-4 h-4 absolute left-3 top-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search learners by name or email..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3">Learner</th>
                <th className="py-3">Contact</th>
                <th className="py-3">Membership Plan</th>
                <th className="py-3">Courses Completed</th>
                <th className="py-3">Joined Date</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-bold text-slate-900 dark:text-slate-100">{s.name}</td>
                  <td className="py-3">
                    <div className="text-slate-600 dark:text-slate-300">{s.email}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{s.phone}</div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30">
                      {s.plan}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">{s.coursesCompleted} of 22</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{s.joined}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={s.subscription?.unlockedMonths || 1}
                        onChange={e => void grantMonthAccess(s.id, Number(e.target.value))}
                        className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200"
                        title="Grant course access through this month"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => <option key={month} value={month}>M{month}</option>)}
                      </select>
                      <button
                        onClick={() => setSelectedLearner(s)}
                        className="px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold border border-slate-200 dark:border-slate-700"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLearner && (
        <div className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setSelectedLearner(null); }}>
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-black text-indigo-500">Learner Profile</div>
                <h3 className="text-xl font-black mt-1">{selectedLearner.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedLearner.email}</p>
              </div>
              <button onClick={() => setSelectedLearner(null)} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 flex items-center justify-center" aria-label="Close details">×</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70"><div className="text-[10px] text-slate-400 uppercase font-bold">Plan</div><div className="font-black mt-1">{selectedLearner.plan}</div></div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70"><div className="text-[10px] text-slate-400 uppercase font-bold">Completed</div><div className="font-black mt-1">{selectedLearner.coursesCompleted} / 22</div></div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70"><div className="text-[10px] text-slate-400 uppercase font-bold">Phone</div><div className="font-bold mt-1 text-sm">{selectedLearner.phone || 'Not provided'}</div></div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70"><div className="text-[10px] text-slate-400 uppercase font-bold">Joined</div><div className="font-bold mt-1 text-sm">{selectedLearner.joined || '—'}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. ADMIN ACHIEVEMENT DEFINITIONS
// ==========================================
export const AdminAchievementsView: React.FC = () => {
  const { theme, showToast } = useApp();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const r = await api<any>('/admin/achievements');
      setAchievements(r.achievements || []);
    } catch (e: any) {
      showToast(e.message || 'Unable to load achievements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadAchievements(); }, []);

  const updateAchievement = async (achievement: any) => {
    try {
      const r = await api<any>(`/admin/achievements/${achievement.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category
        })
      });
      setAchievements(prev => prev.map(item => item.id === achievement.id ? r.achievement : item));
      showToast('Achievement definition updated.');
    } catch (e: any) {
      showToast(e.message || 'Unable to update achievement.');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Achievement Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Achievement Definitions</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Edit the definitions stored in MongoDB. Learner unlock state remains per-student through User.unlockedBadgeIds.</p>
      </div>

      <div className={`p-6 rounded-3xl border space-y-4 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        {loading ? <div className="text-sm text-slate-400">Loading achievements…</div> : achievements.map((achievement, index) => (
          <div key={achievement.id} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="lg:col-span-1 flex items-center gap-2">
              <span className="text-2xl">{achievement.icon || '🏆'}</span>
              <span className="text-[10px] font-mono text-slate-400">#{index + 1}</span>
            </div>
            <input value={achievement.title || ''} onChange={e => setAchievements(prev => prev.map(item => item.id === achievement.id ? { ...item, title: e.target.value } : item))} className="lg:col-span-3 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white" placeholder="Title" />
            <textarea value={achievement.description || ''} onChange={e => setAchievements(prev => prev.map(item => item.id === achievement.id ? { ...item, description: e.target.value } : item))} className="lg:col-span-4 min-h-10 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300" placeholder="Description" />
            <div className="lg:col-span-2 flex gap-2">
              <input value={achievement.icon || ''} onChange={e => setAchievements(prev => prev.map(item => item.id === achievement.id ? { ...item, icon: e.target.value } : item))} className="w-16 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-center" placeholder="Icon" />
              <select value={achievement.category || 'Course'} onChange={e => setAchievements(prev => prev.map(item => item.id === achievement.id ? { ...item, category: e.target.value } : item))} className="min-w-0 flex-1 px-2 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                {['Course', 'Quiz'].map(category => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <button onClick={() => void updateAchievement(achievement)} className="lg:col-span-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20">Save Definition</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. ADMIN COURSE CATALOG MANAGEMENT
// ==========================================
export const AdminCoursesView: React.FC = () => {
  const { courses, theme, showToast } = useApp();
  const [adminCourses, setAdminCourses] = useState<any[]>(courses);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => { setAdminCourses(courses as any[]); }, [courses]);

  // Sends the file to the backend, which stores it and returns a public URL.
  // The URL is written straight into the field the button belongs to.
  const uploadImage = async (field: string, file: File) => {
    if (file.size > 3 * 1024 * 1024) { showToast('That image is over 3MB. Please compress it first (try squoosh.app).'); return; }
    setUploadingField(field);
    try {
      const form = new FormData();
      form.append('image', file);
      const r = await api<any>('/admin/uploads/image', { method: 'POST', body: form });
      setEditing((prev: any) => ({ ...prev, [field]: r.url }));
      showToast('Image uploaded.');
    } catch (e: any) {
      showToast(e.message || 'Could not upload that image.');
    } finally {
      setUploadingField(null);
    }
  };

  const blankLesson = (order: number) => ({
    id: `les-${Date.now()}-${order}`,
    title: `Lesson ${order}`,
    duration: '0m',
    durationSeconds: 0,
    videoUrl: '',
    videoUrls: [],
    description: '',
    keyPoints: [],
    order
  });

  const openEditor = (course?: any) => {
    const c = course ? JSON.parse(JSON.stringify(course)) : {
      title: '', shortDescription: '', fullDescription: '', category: 'Professional Skills',
      thumbnail: '', bannerImage: '', monthUnlock: 1, isFree: false, level: 'Beginner',
      instructor: { name: 'IHCDR Faculty', title: 'Capability Development Mentor', avatar: '', experience: '' },
      modules: [{ id: `mod-${Date.now()}`, title: 'Module 1', lessons: [blankLesson(1)] }],
      resources: [], assignments: [],
      quiz: { id: `quiz-${Date.now()}`, title: 'Course Quiz', durationMinutes: 10, passingScorePercentage: 70, questions: [] },
      learningOutcomes: []
    };
    c.modules = c.modules?.length ? c.modules : [{ id: `mod-${Date.now()}`, title: 'Module 1', lessons: [blankLesson(1)] }];
    c.resources = c.resources || [];
    c.quiz = c.quiz || { id: `quiz-${Date.now()}`, title: `${c.title} Quiz`, durationMinutes: 10, passingScorePercentage: 70, questions: [] };
    setEditing(c);
    setEditorOpen(true);
  };

  const updateLesson = (mi:number, li:number, patch:any) => {
    setEditing((prev:any) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.modules[mi].lessons[li] = { ...next.modules[mi].lessons[li], ...patch };
      return next;
    });
  };

  const addLesson = (mi:number) => {
    setEditing((prev:any) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.modules[mi].lessons.push(blankLesson(next.modules[mi].lessons.length + 1));
      return next;
    });
  };

  const addModule = () => {
    setEditing((prev:any) => ({
      ...prev,
      modules: [...(prev.modules || []), { id:`mod-${Date.now()}`, title:`Module ${(prev.modules?.length||0)+1}`, lessons:[blankLesson(1)] }]
    }));
  };

  const addPdf = () => {
    setEditing((prev:any) => ({
      ...prev,
      resources: [...(prev.resources || []), {
        id:`res-${Date.now()}`, title:'', type:'pdf', fileName:'', fileSize:'',
        category:'Course PDF', downloadUrl:'', contentSummary:'', published:true
      }]
    }));
  };

  const updateQuizQuestion = (questionIndex:number, field:string, value:any) => {
    setEditing((p:any) => {
      const quiz = p.quiz || { questions: [] };
      const questions = [...(quiz.questions || [])];
      questions[questionIndex] = { ...questions[questionIndex], [field]: value };
      return { ...p, quiz: { ...quiz, questions } };
    });
  };

  const updateQuizOption = (questionIndex:number, optionIndex:number, value:string) => {
    setEditing((p:any) => {
      const quiz = p.quiz || { questions: [] };
      const questions = [...(quiz.questions || [])];
      const question = { ...(questions[questionIndex] || {}), options: [...(questions[questionIndex]?.options || ['', '', '', ''])] };
      question.options[optionIndex] = value;
      questions[questionIndex] = question;
      return { ...p, quiz: { ...quiz, questions } };
    });
  };

  const addQuizQuestion = () => {
    setEditing((prev:any) => ({
      ...prev,
      quiz: {
        ...(prev.quiz || {}),
        questions: [...(prev.quiz?.questions || []), {
          id:`q-${Date.now()}`, question:'', options:['','','',''], correctAnswer:0, explanation:''
        }]
      }
    }));
  };

  const syncVideoDuration = (mi:number, li:number, rawUrls:string) => {
    const urls = rawUrls.split('\n').map(x=>x.trim()).filter(Boolean);
    if (!urls.length) return;
    Promise.all(urls.map(url => new Promise<number>(resolve => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => resolve(Math.round(video.duration || 0));
      video.onerror = () => resolve(0);
      video.src = url;
    }))).then(values => {
      const seconds = values.reduce((a,b)=>a+b,0);
      if (!seconds) return;
      const mins = Math.floor(seconds / 60), secs = seconds % 60;
      updateLesson(mi, li, { durationSeconds: seconds, duration: `${mins}m ${String(secs).padStart(2,'0')}s` });
    });
  };

  const saveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const modules = (editing.modules || []).map((m:any, mi:number) => ({
        ...m,
        lessons: (m.lessons || []).map((l:any, li:number) => {
          const videos = (l.videoUrls || []).filter(Boolean);
          return {
            ...l,
            videoUrls: videos,
            videoUrl: videos[0] || l.videoUrl || '',
            order: li + 1
          };
        })
      }));
      const lessonsCount = modules.reduce((n:number,m:any)=>n+(m.lessons?.length||0),0);
      const totalSeconds = modules.flatMap((m:any)=>m.lessons||[]).reduce((n:number,l:any)=>n+Number(l.durationSeconds||0),0);
      const totalDuration = `${Math.floor(totalSeconds/3600)}h ${Math.floor((totalSeconds%3600)/60)}m`;

      const payload:any = {
        ...editing, modules, lessonsCount,
        totalDuration: totalSeconds ? totalDuration : (editing.totalDuration || '0h 0m'),
        thumbnail: editing.thumbnail || '/assets/images/hero-growth-journey.png',
        bannerImage: editing.bannerImage || editing.thumbnail || '/assets/images/hero-growth-journey.png',
        fullDescription: editing.fullDescription || editing.shortDescription,
        resources: editing.resources || [],
        quiz: editing.quiz || { id:`quiz-${Date.now()}`, title:`${editing.title} Quiz`, durationMinutes:10, passingScorePercentage:70, questions:[] }
      };
      const response = editing.id
        ? await api<any>(`/admin/courses/${editing.id}`, { method:'PATCH', body:JSON.stringify(payload) })
        : await api<any>('/admin/courses', { method:'POST', body:JSON.stringify(payload) });
      const saved = response.course;
      setAdminCourses(prev => editing.id ? prev.map(c=>c.id===saved.id?saved:c) : [saved,...prev]);
      setEditorOpen(false); setEditing(null);
      showToast(editing.id ? 'Course updated successfully.' : 'Course added successfully.');
    } catch(e:any) { showToast(e.message || 'Unable to save course.'); }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold"><BookOpen className="w-3.5 h-3.5"/> Course Catalog</div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Course & Curriculum Control</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Add unlimited videos, lessons, PDFs and quizzes. Lesson duration and course duration are calculated from video metadata when the URL is reachable.</p>
        </div>
        <button onClick={()=>openEditor()} className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"><Plus className="w-4 h-4"/> Add New Course</button>
      </div>

      {!adminCourses.length && <div className={`p-10 rounded-3xl border text-center ${theme==='dark'?'bg-slate-900/80 border-slate-800':'bg-white border-slate-200'}`}><BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2"/><div className="font-bold">No courses yet</div><p className="text-xs text-slate-400 mt-1">Add a course to start populating videos, PDFs and quizzes.</p></div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCourses.map(c=>(
          <div key={c.id} className={`rounded-3xl border overflow-hidden ${theme==='dark'?'bg-slate-900/80 border-slate-800':'bg-white border-slate-200 shadow-sm'}`}>
            <div className="relative aspect-video overflow-hidden">
              <img src={c.thumbnail || '/assets/images/hero-growth-journey.png'} className="w-full h-full object-cover" alt={c.title}/>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"/>
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-bold">{c.isFree?'FREE':`Paid Month ${c.monthUnlock}`}</div>
              <div className="absolute bottom-3 left-3 text-white font-black text-sm">{c.title}</div>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{c.shortDescription}</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <span className="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 font-bold">{c.lessonsCount||0} Lessons</span>
                <span className="px-2 py-1 rounded-lg bg-cyan-500/10 text-cyan-500 font-bold">{c.totalDuration||'0h 0m'}</span>
                <span className="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-500 font-bold">{(c.modules||[]).reduce((n:number,m:any)=>n+(m.lessons||[]).reduce((x:number,l:any)=>x+(l.videoUrls?.length || (l.videoUrl?1:0)),0),0)} Videos</span>
                <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-bold">{(c.resources||[]).filter((r:any)=>r.type==='pdf').length} PDFs</span>
              </div>
              <div className="text-[10px] text-slate-500">Quiz: {(c.quiz?.questions||[]).length} questions</div>
              <button onClick={()=>openEditor(c)} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"><Edit className="w-3.5 h-3.5"/> Edit Course Content</button>
            </div>
          </div>
        ))}
      </div>

      {editorOpen && editing && (
        <div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md overflow-y-auto p-4">
          <form onSubmit={saveCourse} className={`w-full max-w-5xl mx-auto rounded-3xl border p-6 sm:p-8 space-y-7 ${theme==='dark'?'bg-[#0b1220] border-slate-700 text-white':'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between sticky top-0 z-10 py-2 bg-inherit">
              <div><h2 className="text-xl font-black">{editing.id?'Edit Course':'Add Course'}</h2><p className="text-[11px] text-slate-500">Build the complete learning experience in one place.</p></div>
              <button type="button" onClick={()=>setEditorOpen(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"><XCircle className="w-5 h-5 text-slate-500"/></button>
            </div>

            <section className="space-y-4">
              <h3 className="font-black text-sm">1. Course Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  ['title','Course Name'],['shortDescription','Short Description'],['thumbnail','Course Image'],['bannerImage','Banner Image']
                ].map(([key,label])=>{
                  const isImage = key==='thumbnail' || key==='bannerImage';
                  return (
                  <label key={key} className={key==='shortDescription'?'sm:col-span-2':''}>
                    <span className="block text-[11px] font-bold text-slate-500 mb-1">{label}</span>
                    <input required={key==='title'||key==='shortDescription'} value={editing[key]||''} onChange={e=>setEditing({...editing,[key]:e.target.value})} placeholder={isImage?'Upload a file, or paste a link':''} className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm"/>
                    {isImage && (
                      <div className="flex items-center gap-3 mt-2">
                        <label className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer ${uploadingField===key?'bg-slate-300 text-slate-600 cursor-wait':'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
                          {uploadingField===key ? 'Uploading…' : 'Upload image'}
                          <input type="file" accept="image/*" disabled={!!uploadingField} className="hidden" onChange={e=>{const f=e.target.files?.[0]; e.currentTarget.value=''; if(f)void uploadImage(key,f);}}/>
                        </label>
                        {editing[key] ? <img src={editing[key]} alt="" className="h-9 w-14 object-cover rounded-md border border-slate-200 dark:border-slate-700"/> : <span className="text-[10px] text-slate-400">JPG, PNG or WebP · under 3MB</span>}
                        {editing[key] && <button type="button" onClick={()=>setEditing({...editing,[key]:''})} className="text-[11px] font-bold text-rose-500">Remove</button>}
                      </div>
                    )}
                  </label>);
                })}
                <label><span className="block text-[11px] font-bold text-slate-500 mb-1">Category</span><select value={editing.category||'Professional Skills'} onChange={e=>setEditing({...editing,category:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm"><option>Personal Growth</option><option>Professional Skills</option><option>Leadership</option><option>Future Skills</option></select></label>
                <label><span className="block text-[11px] font-bold text-slate-500 mb-1">Release Month</span><input type="number" min="1" max="12" value={editing.monthUnlock||1} onChange={e=>setEditing({...editing,monthUnlock:Number(e.target.value)})} className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm"/></label>
                <label className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700"><input type="checkbox" checked={!!editing.isFree} onChange={e=>setEditing({...editing,isFree:e.target.checked,monthUnlock:e.target.checked?1:editing.monthUnlock})}/><span className="text-xs font-bold">Free course — available as part of the initial free access</span></label>
                <label className="sm:col-span-2"><span className="block text-[11px] font-bold text-slate-500 mb-1">Full Description</span><textarea rows={3} value={editing.fullDescription||''} onChange={e=>setEditing({...editing,fullDescription:e.target.value})} className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm"/></label>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between"><div><h3 className="font-black text-sm">2. Lessons & Videos</h3><p className="text-[11px] text-slate-500">Each lesson can contain any number of videos. Paste one URL per line. Duration is read from the video metadata when possible.</p></div><button type="button" onClick={addModule} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"><Plus className="w-3.5 h-3.5 inline mr-1"/> Add Module</button></div>
              {(editing.modules||[]).map((m:any,mi:number)=>(
                <div key={m.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
                  <input value={m.title||''} onChange={e=>setEditing((p:any)=>({...p,modules:p.modules.map((x:any,i:number)=>i===mi?{...x,title:e.target.value}:x)}))} className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 font-bold text-sm"/>
                  {(m.lessons||[]).map((l:any,li:number)=>(
                    <div key={l.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between"><span className="text-[10px] uppercase font-black tracking-wider text-indigo-500">Lesson {li+1}</span><button type="button" onClick={()=>addLesson(mi)} className="text-[10px] font-bold text-indigo-500">+ Add Lesson</button></div>
                      <input value={l.title||''} onChange={e=>updateLesson(mi,li,{title:e.target.value})} placeholder="Lesson title" className="w-full px-3 py-2.5 rounded-xl border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-sm font-bold"/>
                      <textarea value={(l.videoUrls||((l.videoUrl&&[l.videoUrl])||[])).join('\\n')} onChange={e=>{const urls=e.target.value.split('\\n').map(x=>x.trim()).filter(Boolean);updateLesson(mi,li,{videoUrls:urls,videoUrl:urls[0]||''})}} onBlur={e=>syncVideoDuration(mi,li,e.currentTarget.value)} placeholder="Video URL(s) — one per line" rows={3} className="w-full px-3 py-2.5 rounded-xl border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-xs font-mono"/>
                      <div className="grid grid-cols-2 gap-3"><label><span className="block text-[10px] font-bold text-slate-500 mb-1">Duration (auto / seconds)</span><input type="number" min="0" value={l.durationSeconds||0} onChange={e=>updateLesson(mi,li,{durationSeconds:Number(e.target.value),duration:`${Math.floor(Number(e.target.value)/60)}m ${String(Number(e.target.value)%60).padStart(2,'0')}s`})} className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-sm"/></label><label><span className="block text-[10px] font-bold text-slate-500 mb-1">Duration Display</span><input value={l.duration||''} onChange={e=>updateLesson(mi,li,{duration:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-sm"/></label></div>
                      <textarea value={l.description||''} onChange={e=>updateLesson(mi,li,{description:e.target.value})} placeholder="Lesson description" rows={2} className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-xs"/>
                    </div>
                  ))}
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between"><div><h3 className="font-black text-sm">3. PDF Resources</h3><p className="text-[11px] text-slate-500">Add as many PDFs as needed. Student resource count is based on the saved PDF records.</p></div><button type="button" onClick={addPdf} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"><Plus className="w-3.5 h-3.5 inline mr-1"/> Add PDF</button></div>
              {(editing.resources||[]).filter((r:any)=>r.type==='pdf').map((r:any,ri:number)=>{
                const realIndex=(editing.resources||[]).findIndex((x:any)=>x.id===r.id);
                return <div key={r.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {['title','fileName','fileSize','downloadUrl'].map(key=><input key={key} placeholder={key==='downloadUrl'?'PDF URL / download URL':key.replace(/([A-Z])/g,' $1')} value={r[key]||''} onChange={e=>setEditing((p:any)=>({...p,resources:p.resources.map((x:any,i:number)=>i===realIndex?{...x,[key]:e.target.value}:x)}))} className="px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs"/>)}
                </div>
              })}
              {!((editing.resources||[]).some((r:any)=>r.type==='pdf')) && <div className="p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400">No PDFs added yet.</div>}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between"><div><h3 className="font-black text-sm">4. Quiz</h3><p className="text-[11px] text-slate-500">Quiz performance is stored per learner and automatically feeds admin analytics.</p></div><button type="button" onClick={addQuizQuestion} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"><Plus className="w-3.5 h-3.5 inline mr-1"/> Add Quiz Question</button></div>
              <div className="grid grid-cols-2 gap-3"><input value={editing.quiz?.title||''} onChange={e=>setEditing((p:any)=>({...p,quiz:{...p.quiz,title:e.target.value}}))} placeholder="Quiz title" className="px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs"/><input type="number" min="1" value={editing.quiz?.passingScorePercentage||70} onChange={e=>setEditing((p:any)=>({...p,quiz:{...p.quiz,passingScorePercentage:Number(e.target.value)}}))} placeholder="Pass % " className="px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs"/></div>
              {(editing.quiz?.questions || []).map((q:any, qi:number) => (
                <div key={q.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <input value={q.question || ''} onChange={e => updateQuizQuestion(qi, 'question', e.target.value)} placeholder={`Question ${qi + 1}`} className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs font-bold" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(q.options || ['', '', '', '']).map((o:string, oi:number) => (
                      <input key={oi} value={o} onChange={e => updateQuizOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} className="px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-xs" />
                    ))}
                  </div>
                  <label className="text-[10px] font-bold text-slate-500">
                    Correct option
                    <select value={q.correctAnswer ?? 0} onChange={e => updateQuizQuestion(qi, 'correctAnswer', Number(e.target.value))} className="ml-2 px-2 py-1 rounded-lg border">
                      <option value={0}>1</option><option value={1}>2</option><option value={2}>3</option><option value={3}>4</option>
                    </select>
                  </label>
                </div>
              ))}
            </section>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={()=>setEditorOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">Cancel</button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">{editing.id?'Save Changes':'Create Course'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const AdminAssignmentsView: React.FC = () => {
  const { theme, showToast } = useApp();

  const [submissions, setSubmissions] = useState<any[]>([]);
  useEffect(() => {
    void api<any>('/admin/assignments')
      .then(r => setSubmissions(r.submissions || []))
      .catch(e => showToast(e.message));
  }, []);

  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [scoreInput, setScoreInput] = useState(90);
  const [feedbackInput, setFeedbackInput] = useState('');

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    try {
      await api(`/admin/assignments/${selectedSub.progressId}/${selectedSub.assignmentId}/grade`, {
        method: 'PATCH',
        body: JSON.stringify({ score: scoreInput, feedback: feedbackInput })
      });
      setSubmissions(prev => prev.map(s => s.id === selectedSub.id
        ? { ...s, status: 'Graded', score: scoreInput, feedback: feedbackInput }
        : s
      ));
      showToast(`Assignment graded for ${selectedSub.studentName}! Score: ${scoreInput}/100`);
      setSelectedSub(null);
    } catch (e:any) {
      showToast(e.message);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Assignment Grading Queue</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review applied practical case studies submitted by learners and issue personalized mentor feedback.
        </p>
      </div>

      <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3">Learner</th>
                <th className="py-3">Course & Assignment</th>
                <th className="py-3">Submission File</th>
                <th className="py-3">Date</th>
                <th className="py-3">Status / Score</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-bold text-slate-900 dark:text-slate-100">{sub.studentName}</td>
                  <td className="py-3">
                    <div className="font-bold text-slate-900 dark:text-slate-200">{sub.assignmentTitle}</div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400">{sub.courseName}</div>
                  </td>
                  <td className="py-3 font-mono text-[11px] text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{sub.fileName}</span>
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{sub.submittedDate}</td>
                  <td className="py-3">
                    {sub.status === 'Graded' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {sub.score}/100 Graded
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Pending Review
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => {
                        setSelectedSub(sub);
                        setScoreInput(sub.score || 90);
                        setFeedbackInput(sub.feedback || 'Well-structured response with clear actionable recommendations.');
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-sm"
                    >
                      {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Submission'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 text-white">
            <h3 className="text-base font-bold">Grade Submission: {selectedSub.studentName}</h3>
            <p className="text-xs text-slate-400">{selectedSub.assignmentTitle}</p>

            <form onSubmit={handleGrade} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Score (out of 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={scoreInput}
                  onChange={e => setScoreInput(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Mentor Written Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md"
                >
                  Submit Final Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. ADMIN SUBSCRIPTIONS & REVENUE
// ==========================================
export const AdminSubscriptionsView: React.FC = () => {
  const { payments, updatePaymentStatus, theme, showToast } = useApp();

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Revenue & Subscriptions</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time tracking of monthly membership payments and payment gateway logs.
          </p>
        </div>

        <button
          onClick={() => showToast('Exported payment receipts ledger')}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 w-fit"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Receipts</span>
        </button>
      </div>

      <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3">Transaction ID</th>
                <th className="py-3">Learner Name</th>
                <th className="py-3">Plan</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Payment Method</th>
                <th className="py-3">Date</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-slate-200">{p.transactionId}</td>
                  <td className="py-3">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{p.studentName}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{p.studentEmail}</div>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{p.plan}</td>
                  <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{p.amount}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{p.paymentMethod}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{p.date}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. ADMIN CERTIFICATES REGISTRY
// ==========================================
export const AdminCertificatesView: React.FC = () => {
  const { certificates, setActiveCertificate, setViewCertificateModal, theme, showToast } = useApp();
  const [searchCert, setSearchCert] = useState('');

  const filtered = certificates.filter(c =>
    c.certificateNumber.toLowerCase().includes(searchCert.toLowerCase()) ||
    c.studentName.toLowerCase().includes(searchCert.toLowerCase()) ||
    c.courseName.toLowerCase().includes(searchCert.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Verified Certificates Registry</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Cryptographically signed digital credentials issued to graduates.
        </p>
      </div>

      <div className={`p-6 rounded-3xl border space-y-4 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="relative max-w-md">
          <Search className={`w-4 h-4 absolute left-3 top-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            value={searchCert}
            onChange={e => setSearchCert(e.target.value)}
            placeholder="Search by certificate ID or recipient..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3">Certificate ID</th>
                <th className="py-3">Graduate Name</th>
                <th className="py-3">Course Title</th>
                <th className="py-3">Issue Date</th>
                <th className="py-3">Signatures</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filtered.map(cert => (
                <tr key={cert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="py-3 font-mono font-bold text-amber-600 dark:text-amber-400">{cert.certificateNumber}</td>
                  <td className="py-3 font-bold text-slate-900 dark:text-slate-100">{cert.studentName}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{cert.courseName}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{cert.issueDate}</td>
                  <td className="py-3 text-[11px] text-slate-500 dark:text-slate-400">Founder {cert.founderName}</td>
                  <td className="py-3">
                    <button
                      onClick={() => {
                        setActiveCertificate(cert);
                        setViewCertificateModal(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-sm"
                    >
                      Inspect Credential
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. ADMIN BROADCAST NOTIFICATIONS
// ==========================================
export const AdminNotificationsView: React.FC = () => {
  const { sendBroadcastNotification, theme, showToast } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AppNotification['category']>('Course Updates');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState(0);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadBroadcasts = async () => {
    try {
      const r = await api<any>('/admin/notifications/broadcasts');
      setAudience(Number(r.audience || 0));
      setRecent(r.broadcasts || []);
    } catch (e: any) {
      showToast(e.message || 'Unable to load broadcast history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadBroadcasts(); }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || sending) return;
    setSending(true);
    try {
      await sendBroadcastNotification(category, title.trim(), message.trim());
      setTitle('');
      setMessage('');
      await loadBroadcasts();
    } finally {
      setSending(false);
    }
  };

  const categories = ['Course Updates', 'Quiz & Assessments', 'Membership', 'Certificates', 'Platform News'];

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/15">
            <Bell className="w-3.5 h-3.5" /> Broadcast Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">Broadcast Alerts</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Send important updates to every learner from one controlled communication panel.</p>
        </div>
        <div className={`px-4 py-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="text-[10px] uppercase tracking-wider font-black text-slate-400">Current Audience</div>
          <div className="text-xl font-black mt-0.5">{audience.toLocaleString('en-IN')} learners</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-6">
        <div className={`p-6 sm:p-7 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-lg"><Send className="w-4 h-4" /></div>
            <div><h3 className="font-black text-sm">Create Announcement</h3><p className="text-[11px] text-slate-400">The alert will appear in learner notifications.</p></div>
          </div>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Notification Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as AppNotification['category'])} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Headline / Title</label>
              <input type="text" required maxLength={120} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. New course module is now available" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5"><label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Message Body</label><span className="text-[10px] text-slate-400">{message.length}/500</span></div>
              <textarea rows={6} required maxLength={500} value={message} onChange={e => setMessage(e.target.value)} placeholder="Write a clear message for all learners..." className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-[11px] text-slate-400">Audience: <span className="font-bold text-slate-600 dark:text-slate-200">All registered learners</span></div>
              <button type="submit" disabled={sending || !title.trim() || !message.trim()} className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> {sending ? 'Sending...' : 'Broadcast to All Learners'}
              </button>
            </div>
          </form>
        </div>

        <div className={`p-6 sm:p-7 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4"><div><h3 className="font-black text-sm">Recent Broadcasts</h3><p className="text-[11px] text-slate-400">Latest announcements sent from this panel.</p></div><button onClick={() => void loadBroadcasts()} className="text-[11px] font-bold text-indigo-500 hover:underline">Refresh</button></div>
          {loading ? <div className="py-10 text-center text-xs text-slate-400">Loading broadcast history...</div> : recent.length === 0 ? <div className="py-10 text-center text-xs text-slate-400">No broadcasts have been sent yet.</div> : <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {recent.map((item: any) => (
              <div key={item.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
                <div className="flex items-start justify-between gap-3"><span className="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-[9px] font-black uppercase">{item.category}</span><span className="text-[10px] text-slate-400 whitespace-nowrap">{item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN', {day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'}) : '—'}</span></div>
                <div className="font-bold text-sm mt-2">{item.title}</div><p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.message}</p>
                <div className="text-[10px] font-semibold text-emerald-500 mt-2">Delivered to {Number(item.recipientCount || 0).toLocaleString('en-IN')} learners</div>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. ADMIN CAPABILITY ANALYTICS
// ==========================================
export const AdminAnalyticsView: React.FC = () => {
  const { theme, showToast } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const r = await api<any>('/admin/analytics');
      setAnalytics(r.analytics || null);
    } catch (e: any) {
      showToast(e.message || 'Unable to load capability analytics.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void loadAnalytics(); const t = window.setInterval(() => void loadAnalytics(), 30000); return () => window.clearInterval(t); }, []);

  const summary = analytics?.summary || {};
  const rows = analytics?.courseProgress || [];

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold border border-cyan-500/15"><BarChart3 className="w-3.5 h-3.5" /> Live Learning Intelligence</div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">Capability Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Real learner progress, quiz performance and course completion data from MongoDB.</p>
        </div>
      </div>

      {loading && !analytics ? <div className={`p-12 rounded-3xl border text-center text-sm text-slate-400 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>Loading live analytics...</div> : <>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            ['Learners', summary.learners || 0],
            ['Active Courses', summary.courses || 0],
            ['Avg Progress', `${summary.averageProgress || 0}%`],
            ['Final Quiz Pass', `${summary.finalQuizPassRate || 0}%`],
            ['Certificates', summary.certificates || 0]
          ].map(([label,value]) => <div key={String(label)} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}><div className="text-[10px] uppercase tracking-wider font-black text-slate-400">{label}</div><div className="text-2xl font-black mt-1">{value}</div></div>)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-5"><div><h3 className="font-black text-sm">Course Engagement</h3><p className="text-[11px] text-slate-400">Learners enrolled and average learning progress.</p></div><span className="text-[10px] font-bold text-emerald-500">Live</span></div>
            <div className="space-y-4">
              {rows.length === 0 ? <div className="py-8 text-center text-xs text-slate-400">No course progress data yet.</div> : rows.map((r:any) => <div key={r.courseId} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3"><div className="text-xs font-bold truncate">{r.courseTitle || r.courseId}</div><div className="text-[10px] text-slate-400 whitespace-nowrap">{r.learners || 0} learners · {Math.round(r.avgProgress || 0)}%</div></div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all" style={{width:`${Math.min(100, Math.max(0, Number(r.avgProgress || 0)))}%`}} /></div>
              </div>)}
            </div>
          </div>

          <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className="font-black text-sm">Assessment Health</h3><p className="text-[11px] text-slate-400 mt-1">Starting quiz vs final quiz performance.</p>
            <div className="mt-6 space-y-5">
              <div><div className="flex justify-between text-xs font-bold"><span>Starting Quiz</span><span>{summary.averageStartingQuiz || 0}%</span></div><div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-2"><div className="h-full rounded-full bg-cyan-500" style={{width:`${Math.min(100, Number(summary.averageStartingQuiz || 0))}%`}} /></div></div>
              <div><div className="flex justify-between text-xs font-bold"><span>Final Quiz</span><span>{summary.averageFinalQuiz || 0}%</span></div><div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 mt-2"><div className="h-full rounded-full bg-indigo-500" style={{width:`${Math.min(100, Number(summary.averageFinalQuiz || 0))}%`}} /></div></div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3"><div><div className="text-[10px] uppercase font-black text-slate-400">Quiz Attempts</div><div className="text-lg font-black mt-1">{summary.finalQuizAttempts || 0}</div></div><div><div className="text-[10px] uppercase font-black text-slate-400">Completed</div><div className="text-lg font-black mt-1">{summary.completedCourses || 0}</div></div></div>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800"><h3 className="font-black text-sm">Course Performance Matrix</h3><p className="text-[11px] text-slate-400 mt-1">Completion and assessment signals for every course with learner activity.</p></div>
          <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800"><tr><th className="py-3 px-5">Course</th><th>Learners</th><th>Avg Progress</th><th>Completed</th><th>Starting Quiz</th><th>Final Quiz</th><th>Pass Rate</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">{rows.map((r:any)=><tr key={`matrix-${r.courseId}`}><td className="py-3 px-5 font-bold min-w-[220px]">{r.courseTitle || r.courseId}</td><td>{r.learners || 0}</td><td>{Math.round(r.avgProgress || 0)}%</td><td>{r.completed || 0}</td><td>{r.startingAttempts || 0} · {Math.round(r.avgStartingQuiz || 0)}%</td><td>{r.finalAttempts || 0} · {Math.round(r.avgFinalQuiz || 0)}%</td><td><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${Number(r.finalPassRate || 0) >= 70 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{Math.round(r.finalPassRate || 0)}%</span></td></tr>)}</tbody></table></div>
        </div>
      </>}
    </div>
  );
};

// ==========================================
// 9. ADMIN SETTINGS
// ==========================================
export const AdminSettingsView: React.FC = () => {
  const { theme, showToast } = useApp();

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Portal Configuration</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Institute parameters, payment gateway keys, and certificate signing authority.
        </p>
      </div>

      <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Certifying Authority Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Director Name (Certificates)</label>
              <input
                type="text"
                defaultValue="G. Satyanarayana"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold">Institute Title</label>
              <input
                type="text"
                defaultValue="The Institute of Human Capability Development and Research"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => { void api('/admin/settings', { method: 'PATCH', body: JSON.stringify({ certificateDirectorName: 'G. Satyanarayana', instituteName: 'The Institute of Human Capability Development and Research' }) }).then(() => showToast('Portal configuration saved.')).catch((e:any) => showToast(e.message)); }}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
