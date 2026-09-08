import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ThemeMode, UserProfile, UserRole, Course, StudentCourseProgress, CertificateRecord,
  LiveSession, ForumPost, ChatThread, AppNotification, AchievementBadge, PaymentTransaction
} from '../types';
import { api, clearToken, getToken, setToken, uploadFile } from '../services/api';

export type AppView =
  | 'landing' | 'auth-login' | 'auth-register' | 'auth-forgot' | 'auth-verify' | 'auth-reset'
  | 'student-dashboard' | 'student-my-learning' | 'student-all-courses' | 'student-player'
  | 'student-certificates' | 'student-subscription' | 'student-live' | 'student-live-sessions'
  | 'student-achievements' | 'student-community' | 'student-messages' | 'student-progress'
  | 'student-notifications' | 'student-settings' | 'student-profile' | 'student-resources' | 'student-help'
  | 'admin-dashboard' | 'admin-students' | 'admin-courses' | 'admin-videos' | 'admin-resources'
  | 'admin-subscriptions' | 'admin-certificates' | 'admin-notifications'
  | 'admin-analytics' | 'admin-settings' | 'admin-profile';

interface AppContextType {
  theme: ThemeMode; setTheme: (theme: ThemeMode) => void; toggleTheme: () => void;
  currentView: AppView; setCurrentView: (view: AppView) => void; searchQuery: string; setSearchQuery: (query: string) => void;
  currentUser: UserProfile | null; setCurrentUser: (user: UserProfile | null) => void;
  switchToRole: (role: 'student' | 'admin' | 'guest') => void;
  login: (email: string, password?: string) => Promise<{success:boolean;role?:UserRole;message?:string}>;
  register: (name: string, email: string, phone?: string, password?: string) => Promise<void>;
  logout: () => void;
  confirmLogout: () => void; cancelLogout: () => void; logoutConfirmOpen: boolean;
  updateProfile: (data:{name?:string;phone?:string;bio?:string;avatar?:string}) => Promise<void>;
  uploadProfilePhoto: (file: File) => Promise<void>;
  signInWithGoogle: (credential: string) => Promise<void>;
  updateSettings: (data:{emailNotifications?:boolean}) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string | undefined>;
  completeVerifiedSession: (token: string, user: any) => Promise<void>;
  verifyPasswordResetOtp: (email: string, otp: string) => Promise<string | undefined>;
  resendPasswordResetOtp: (email: string) => Promise<void>;
  resetPassword: (newPassword: string, token?: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;

  courses: Course[]; selectedCourseId: string; setSelectedCourseId: (id: string) => void; activeCourse: Course;
  isCourseUnlocked: (courseOrId: Course | string) => boolean;
  subscriptionUnlockedMonths: number;

  progressMap: Record<string, StudentCourseProgress>;
  markLessonComplete: (courseId: string, lessonId: string) => Promise<void>;
  saveLessonNote: (courseId: string, lessonId: string, noteText: string) => Promise<void>;
  submitAssignment: (courseId: string, assignmentId: string, text: string, fileName?: string) => Promise<void>;
  submitQuiz: (courseId: string, answers: Record<string, number>, phase?: 'starting' | 'final') => Promise<{passed:boolean;score:number;total:number;percentage:number}>;
  completeCourse: (courseId: string) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;

  completedCoursesCount: number; totalCoursesCount: number; enrolledCoursesCount: number; overallProgressPercent: number; masterCertificate: CertificateRecord | null;
  completeAllCoursesForDemo: () => Promise<void>; openMasterCertificate: () => Promise<void>;
  certificates: CertificateRecord[]; activeCertificate: CertificateRecord | null; setActiveCertificate: (cert: CertificateRecord | null) => void;
  viewCertificateModal: boolean; setViewCertificateModal: (open: boolean) => void;
  generateCertificateForCourse: (courseId: string) => CertificateRecord | null;

  checkoutModalOpen: boolean; setCheckoutModalOpen: (open: boolean) => void; upgradeToMonthlyPlan: (paymentMethod?: string) => Promise<void>;
  liveSessions: LiveSession[]; registerLiveSession: (sessionId: string) => Promise<void>;
  communityPosts: ForumPost[]; addCommunityPost: (title:string,category:string,content:string)=>Promise<void>;
  addCommunityReply: (postId:string,content:string)=>Promise<void>; togglePostLike: (postId:string)=>Promise<void>;
  chatThreads: ChatThread[]; activeChatId: string; setActiveChatId: (id:string)=>void; sendMessage:(threadId:string,text:string)=>Promise<void>;
  notifications: AppNotification[]; markNotificationAsRead:(id:string)=>Promise<void>; markAllNotificationsAsRead:()=>Promise<void>;
  sendBroadcastNotification:(category:AppNotification['category'],title:string,message:string)=>Promise<void>;
  achievements: AchievementBadge[]; payments: PaymentTransaction[];
  updatePaymentStatus:(paymentId:string,status:'Successful'|'Pending'|'Failed')=>Promise<void>;
  submitContact:(name:string,email:string,message:string)=>Promise<void>; subscribeNewsletter:(email:string)=>Promise<void>;
  toastMessage:string|null; showToast:(msg:string)=>void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const toProgress = (p:any): StudentCourseProgress => ({
  courseId:p.courseId, percent:p.percent||0, completedLessonIds:p.completedLessonIds||[], currentLessonId:p.currentLessonId||'',
  notes:p.notes || {}, assignmentSubmissions:p.assignmentSubmissions || {}, quizResult:p.quizResult, startingQuizResult:p.startingQuizResult,
  isCompleted:!!p.isCompleted, completedDate:p.completedDate, certificateEarned:!!p.certificateEarned, certificateId:p.certificateId
});
const toCertificate = (c:any): CertificateRecord => ({
  id:c.id || c._id, certificateNumber:c.certificateNumber, studentName:c.studentName, studentEmail:c.studentEmail,
  courseId:c.courseId, courseName:c.courseName, issueDate:c.issueDate, qrCodeUrl:c.qrCodeUrl,
  directorName:c.directorName, founderName:c.founderName, verified:!!c.verified,
  overallAssessmentScore:Number(c.overallAssessmentScore||0), assessmentScores:Array.isArray(c.assessmentScores)?c.assessmentScores:[]
});
const normalizeNotification=(n:any):AppNotification=>({...n,id:n.id||n._id});
const normalizePost=(p:any):ForumPost=>({...p,id:p.id||p._id,likedByMe:!!p.likedByMe,replies:(p.replies||[]).map((r:any)=>({...r,id:r.id||r._id}))});
const normalizeThread=(t:any):ChatThread=>({...t,id:t.id||t._id,messages:t.messages||[]});

export const AppProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [theme,setThemeState]=useState<ThemeMode>(()=>(localStorage.getItem('tah_theme') as ThemeMode)||'dark');
  const [currentView,setCurrentView]=useState<AppView>('landing');
  const [searchQuery,setSearchQuery]=useState('');
  const [currentUser,setCurrentUserState]=useState<UserProfile|null>(null);
  const [courses,setCourses]=useState<Course[]>([]);
  const [selectedCourseId,setSelectedCourseId]=useState('course-1');
  const [progressMap,setProgressMap]=useState<Record<string,StudentCourseProgress>>({});
  const [certificates,setCertificates]=useState<CertificateRecord[]>([]);
  const [activeCertificate,setActiveCertificate]=useState<CertificateRecord|null>(null);
  const [viewCertificateModal,setViewCertificateModal]=useState(false);
  const [checkoutModalOpen,setCheckoutModalOpen]=useState(false);
  const [liveSessions,setLiveSessions]=useState<LiveSession[]>([]);
  const [communityPosts,setCommunityPosts]=useState<ForumPost[]>([]);
  const [chatThreads,setChatThreads]=useState<ChatThread[]>([]);
  const [activeChatId,setActiveChatId]=useState('chat-1');
  const [notifications,setNotifications]=useState<AppNotification[]>([]);
  const [achievements,setAchievements]=useState<AchievementBadge[]>([]);
  const [payments,setPayments]=useState<PaymentTransaction[]>([]);
  const [masterCertificate,setMasterCertificate]=useState<CertificateRecord|null>(null);
  const [toastMessage,setToastMessage]=useState<string|null>(null);
  const [logoutConfirmOpen,setLogoutConfirmOpen]=useState(false);

  const setTheme=(mode:ThemeMode)=>{setThemeState(mode);localStorage.setItem('tah_theme',mode)};
  const toggleTheme=()=>setTheme(theme==='dark'?'light':'dark');
  useEffect(()=>{if(theme==='dark'){document.documentElement.classList.add('dark');document.documentElement.classList.remove('light-theme');document.body.className='bg-[#0a0f1d] text-slate-100 antialiased transition-colors duration-200'}else{document.documentElement.classList.remove('dark');document.documentElement.classList.add('light-theme');document.body.className='bg-[#f8fafc] text-slate-900 antialiased transition-colors duration-200'}},[theme]);
  const showToast=(msg:string)=>{setToastMessage(msg);window.setTimeout(()=>setToastMessage(null),4000)};
  const setCurrentUser=(u:UserProfile|null)=>{setCurrentUserState(u);if(u)localStorage.setItem('ihcdr_user',JSON.stringify(u));else localStorage.removeItem('ihcdr_user')};

  const applyBootstrap=(data:any)=>{
    if(Array.isArray(data.courses))setCourses(data.courses);
    if(data.user)setCurrentUser(data.user);
    if(data.progress)setProgressMap(Object.fromEntries(data.progress.map((p:any)=>[p.courseId,toProgress(p)])));
    if(Array.isArray(data.certificates)){const cs=data.certificates.map(toCertificate);setCertificates(cs);const master=cs.find((c:any)=>c.courseId==='all-22-capabilities-master');if(master)setMasterCertificate(master);}
    if(Array.isArray(data.liveSessions))setLiveSessions(data.liveSessions);
    if(Array.isArray(data.communityPosts))setCommunityPosts(data.communityPosts.map(normalizePost));
    if(Array.isArray(data.chatThreads))setChatThreads(data.chatThreads.map(normalizeThread));
    if(Array.isArray(data.notifications))setNotifications(data.notifications.map(normalizeNotification));
    if(Array.isArray(data.achievements))setAchievements(data.achievements);
    if(Array.isArray(data.payments))setPayments(data.payments);
  };

  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      const params=new URLSearchParams(window.location.search);
      const resetToken=params.get('resetToken');
      const resetEmail=params.get('email');
      const claim=params.get('claim');
      const verifyToken=params.get('verifyToken');
      if(resetToken){localStorage.setItem('tah_reset_token',resetToken);if(resetEmail)localStorage.setItem('tah_reset_email',resetEmail);setCurrentView('auth-reset');}

      // Arriving from the "Verify My Email" button. The token is exchanged with
      // a background request so the browser stays on this domain throughout.
      if(verifyToken){
        window.history.replaceState({},'',window.location.pathname);
        try {
          const r=await api<any>('/auth/verify-email-token',{method:'POST',body:JSON.stringify({token:verifyToken})});
          if(cancelled)return;
          setToken(r.token);
          setCurrentUser(r.user);
          localStorage.removeItem('tah_verify_email');
          localStorage.removeItem('tah_verify_purpose');
          localStorage.removeItem('tah_verify_started');localStorage.removeItem('tah_pending_token');
          setCurrentView(r.user.role==='admin'?'admin-dashboard':'student-dashboard');
          showToast('Email verified. Welcome to ThinkAHead Learning Hub!');
          if(r.user.role==='student'){try{const boot=await api<any>('/student/bootstrap');if(!cancelled)applyBootstrap(boot.data)}catch{}}
          return;
        } catch(e:any){
          if(cancelled)return;
          setCurrentView('auth-login');
          showToast(e.message||'This verification link is invalid or has expired. Please sign in or request a new one.');
          return;
        }
      }

      // Arriving back from the "Verify My Email" link: trade the one-time token
      // for a session so this tab lands on the dashboard, already signed in.
      if(claim){
        window.history.replaceState({},'',window.location.pathname);
        try {
          const r=await api<any>('/auth/claim-session',{method:'POST',body:JSON.stringify({token:claim})});
          if(cancelled)return;
          setToken(r.token);
          setCurrentUser(r.user);
          localStorage.removeItem('tah_verify_email');
          localStorage.removeItem('tah_verify_purpose');
          localStorage.removeItem('tah_verify_started');localStorage.removeItem('tah_pending_token');
          setCurrentView(r.user.role==='admin'?'admin-dashboard':'student-dashboard');
          showToast('Email verified. Welcome to ThinkAHead Learning Hub!');
          if(r.user.role==='student'){try{const boot=await api<any>('/student/bootstrap');if(!cancelled)applyBootstrap(boot.data)}catch{}}
          return;
        } catch(e:any){
          if(cancelled)return;
          localStorage.removeItem('tah_verify_email');
          localStorage.removeItem('tah_verify_purpose');
          setCurrentView('auth-login');
          showToast(e.message||'This verification link has already been used. Please sign in.');
          return;
        }
      }
      try {
        const pub=await api<any>('/public/bootstrap'); if(cancelled)return;
        if(pub.data?.courses?.length)setCourses(pub.data.courses);
        if(pub.data?.certificates?.length)setCertificates(pub.data.certificates.map(toCertificate));
        if(pub.data?.liveSessions?.length)setLiveSessions(pub.data.liveSessions);
      } catch {}
      if(getToken()){
        try {
          const auth=await api<any>('/auth/me');
          if(cancelled)return;
          // A reload must never skip email verification. Older sessions created
          // before verification was enforced can still hold a token here.
          if(auth.user.emailVerified!==true){
            clearToken();
            setCurrentUser(null);
            localStorage.setItem('tah_verify_email',auth.user.email);
            localStorage.setItem('tah_verify_purpose','registration');
            localStorage.setItem('tah_verify_started',String(Date.now()));
            setCurrentView('auth-verify');
            return;
          }
          setCurrentUser(auth.user);
          setCurrentView(auth.user.role==='admin'?'admin-dashboard':'student-dashboard');
          // Student bootstrap is protected for student accounts. Never call it
          // with an admin token, otherwise a valid admin session can be
          // cleared by the role middleware before the admin dashboard loads.
          if(auth.user.role==='student'){
            const boot=await api<any>('/student/bootstrap');
            if(!cancelled)applyBootstrap(boot.data);
          }
          if(auth.user.role==='admin'){
            const [p,c]=await Promise.all([api<any>('/admin/payments'),api<any>('/admin/certificates')]);
            if(!cancelled){setPayments(p.payments);setCertificates(c.certificates.map(toCertificate))}
          }
        } catch { clearToken(); setCurrentUser(null); setCurrentView('landing'); }
      } else if(!resetToken){
        // A pending verification should only take over the page right after
        // signing up. Anything older is stale, so the landing page wins.
        const pendingEmail=localStorage.getItem('tah_verify_email');
        const startedAt=Number(localStorage.getItem('tah_verify_started')||0);
        const isRecent=startedAt>0 && Date.now()-startedAt < 60*60*1000;
        if(pendingEmail && !isRecent){
          localStorage.removeItem('tah_verify_email');
          localStorage.removeItem('tah_verify_purpose');
          localStorage.removeItem('tah_verify_started');localStorage.removeItem('tah_pending_token');
        } else if(pendingEmail){
          try {
            const st=await api<any>(`/auth/verification-status?email=${encodeURIComponent(pendingEmail)}`);
            if(cancelled)return;
            if(st.verified){
              // They used the link in the email, so nothing is pending anymore.
              localStorage.removeItem('tah_verify_email');
              localStorage.removeItem('tah_verify_purpose');
              localStorage.removeItem('tah_verify_started');localStorage.removeItem('tah_pending_token');
              setCurrentView('auth-login');
              showToast('Your email is already verified. Please sign in.');
              return;
            }
          } catch {}
          if(!cancelled)setCurrentView('auth-verify');
        }
      }
    })();
    return ()=>{cancelled=true};
  },[]);


  const activeCourse=useMemo(()=>courses.find(c=>c.id===selectedCourseId)||courses[0],[courses,selectedCourseId]);
  const subscriptionUnlockedMonths=useMemo(()=>{
    const sub=currentUser?.subscription;
    if(!sub?.active) return 0;
    const today=new Date();
    if(sub.expiresDate && new Date(`${sub.expiresDate}T23:59:59`) < today) return 0;
    if(!sub.startDate) return Math.min(12, Math.max(1, Number(sub.unlockedMonths||1)));
    const start=new Date(`${sub.startDate}T00:00:00`);
    if(Number.isNaN(start.getTime())) return Math.min(12, Math.max(1, Number(sub.unlockedMonths||1)));
    const elapsed=Math.max(0, (today.getFullYear()-start.getFullYear())*12 + (today.getMonth()-start.getMonth()) - (today.getDate() < start.getDate() ? 1 : 0));
    // A paid subscription releases exactly two paid courses per subscription month.
    // Do not use a stale unlockedMonths value to grant the whole catalog immediately.
    return Math.min(12, Math.max(1, elapsed + 1, Number(sub.unlockedMonths || 1)));
  },[currentUser?.subscription]);
  const freeCourseIds=useMemo(()=>{
    // Courses explicitly marked as free are available without membership.
    return new Set(courses.filter(c=>c.isFree).map(c=>c.id));
  },[courses]);
  const isCourseUnlocked=(courseOrId:Course|string)=>{
    const c=typeof courseOrId==='string'?courses.find(x=>x.id===courseOrId):courseOrId;if(!c)return false;
    // Courses marked as free are available before membership.
    if(freeCourseIds.has(c.id))return true;
    // After membership, only the courses released by the current subscription month are accessible.
    return subscriptionUnlockedMonths>0 && c.monthUnlock<=subscriptionUnlockedMonths;
  };
  const enrolledCoursesCount=currentUser?.enrolledCourseIds?.filter(id=>courses.some(c=>c.id===id)).length||0;
  const enrolledIds=new Set(currentUser?.enrolledCourseIds||[]);
  const enrolledProgressCourses=courses.filter(c=>enrolledIds.has(c.id));
  const completedIds=new Set([...(currentUser?.completedCourseIds||[]), ...Object.values<StudentCourseProgress>(progressMap).filter(p=>p.isCompleted && p.percent===100).map(p=>p.courseId)]);
  const completedCoursesCount=courses.filter(c=>completedIds.has(c.id)).length;

  // Overall progress is measured against the courses this learner can actually
  // reach right now: the free ones before a subscription, and every unlocked
  // month after it. So 1 of 2 free courses reads 50%, and 1 of 8 unlocked
  // courses reads 13%. A part-finished course counts as its own fraction.
  const unlockedMonths=Number(currentUser?.subscription?.unlockedMonths||0);
  const hasSubscription=!!currentUser?.subscription?.active;
  const accessibleCourses=courses.filter(c=>
    c.isFree || (hasSubscription && Number((c as any).monthUnlock||99)<=Math.max(1,unlockedMonths))
  );
  const progressPool=accessibleCourses.length?accessibleCourses:enrolledProgressCourses;
  const overallProgressPercent=progressPool.length
    ? Math.round(progressPool.reduce((sum,c)=>sum+(completedIds.has(c.id)?100:(progressMap[c.id]?.percent||0)),0)/progressPool.length)
    : 0;
  const totalCoursesCount=courses.length;

  const login=async(email:string,password='')=>{
    try{const r=await api<any>('/auth/login',{method:'POST',body:JSON.stringify({email:email.trim(),password:password.trim()})});if(r.requiresEmailVerification){clearToken();setCurrentUser(null);localStorage.setItem('tah_verify_email',r.email||email.trim().toLowerCase());localStorage.setItem('tah_verify_purpose','registration');localStorage.setItem('tah_verify_started',String(Date.now()));if(r.pendingToken)localStorage.setItem('tah_pending_token',r.pendingToken);setCurrentView('auth-verify');showToast(r.message||'Please verify your email address to continue.');return {success:true,role:'student' as UserRole,message:'Please verify your email.'};}setToken(r.token);setCurrentUser(r.user);setCurrentView(r.user.role==='admin'?'admin-dashboard':'student-dashboard');const boot=r.user.role==='student'?await api<any>('/student/bootstrap'):null;if(boot)applyBootstrap(boot.data);if(r.user.role==='admin'){const [p,c]=await Promise.all([api<any>('/admin/payments'),api<any>('/admin/certificates')]);setPayments(p.payments);setCertificates(c.certificates.map(toCertificate))}showToast(`Welcome back, ${r.user.name}!`);return {success:true,role:r.user.role as UserRole}}catch(e:any){showToast(e.message||'Unable to log in.');return {success:false,message:e.message}}};

  const signInWithGoogle=async(credential:string)=>{try{const r=await api<any>('/auth/google',{method:'POST',body:JSON.stringify({credential})});setToken(r.token);setCurrentUser(r.user);setCurrentView(r.user.role==='admin'?'admin-dashboard':'student-dashboard');if(r.user.role==='student'){const boot=await api<any>('/student/bootstrap');applyBootstrap(boot.data)}showToast(`Welcome, ${r.user.name}!`)}catch(e:any){showToast(e.message||'Google sign-in failed.')}};

  const register=async(name:string,email:string,phone?:string,password?:string)=>{
    try{const r=await api<any>('/auth/register',{method:'POST',body:JSON.stringify({name,email,phone,password})});clearToken();setCurrentUser(null);localStorage.setItem('tah_verify_email',r.email||email.trim().toLowerCase());localStorage.setItem('tah_verify_purpose','registration');localStorage.setItem('tah_verify_started',String(Date.now()));setCurrentView('auth-verify');showToast(r.message||'Account created. Open the verification link we emailed you.')}catch(e:any){showToast(e.message||'Unable to create account.')}}
  const logout=()=>setLogoutConfirmOpen(true);
  const confirmLogout=()=>{setLogoutConfirmOpen(false);clearToken();setCurrentUser(null);localStorage.removeItem('tah_verify_email');localStorage.removeItem('tah_verify_purpose');localStorage.removeItem('tah_verify_started');localStorage.removeItem('tah_pending_token');setProgressMap({});setCertificates([]);setChatThreads([]);setNotifications([]);setPayments([]);setCurrentView('landing');showToast('Logged out successfully.')};
  const cancelLogout=()=>setLogoutConfirmOpen(false);
  const switchToRole=(role:'student'|'admin'|'guest')=>{
  if(role==='guest') logout();
  else if(role==='student' && currentUser?.role==='admin') setCurrentView('student-dashboard');
  else if(role==='admin' && currentUser?.role==='admin') setCurrentView('admin-dashboard');
  else if(role==='admin') void login('admin@ihcdr.org','admin123');
  else void login('student@ihcdr.org','student123');
};

  const requestPasswordReset=async(email:string)=>{
    try{const r=await api<any>('/auth/forgot-password',{method:'POST',body:JSON.stringify({email})});localStorage.setItem('tah_reset_email',email.trim().toLowerCase());localStorage.setItem('tah_verify_purpose','password-reset');showToast(r.message||'Reset instructions sent.');return undefined}catch(e:any){showToast(e.message||'Unable to request reset.');return undefined}
  };
  // Signs this tab in with a session that was just granted after the email was
  // verified, wherever that verification happened.
  const completeVerifiedSession=async(token:string,user:any)=>{
    setToken(token);
    setCurrentUser(user);
    localStorage.removeItem('tah_verify_email');
    localStorage.removeItem('tah_verify_purpose');
    localStorage.removeItem('tah_verify_started');
    localStorage.removeItem('tah_pending_token');
    setCurrentView(user.role==='admin'?'admin-dashboard':'student-dashboard');
    showToast('Email verified. Welcome to ThinkAHead Learning Hub!');
    if(user.role==='student'){try{const boot=await api<any>('/student/bootstrap');applyBootstrap(boot.data)}catch{}}
  };

  const verifyPasswordResetOtp=async(email:string,otp:string)=>{
    try{const r=await api<any>('/auth/verify-password-reset-otp',{method:'POST',body:JSON.stringify({email,otp})});localStorage.setItem('tah_reset_token',r.resetToken);showToast('OTP verified. Set your new password.');return r.resetToken}catch(e:any){showToast(e.message||'Invalid OTP.');return undefined}
  };
  const resendPasswordResetOtp=async(email:string)=>{try{const r=await api<any>('/auth/resend-password-reset-otp',{method:'POST',body:JSON.stringify({email})});showToast(r.message||'New OTP sent.')}catch(e:any){showToast(e.message||'Unable to resend OTP.')}};
  const resetPassword=async(newPassword:string,token?:string)=>{
    try{const email=localStorage.getItem('tah_reset_email')||'';const resetToken=token||localStorage.getItem('tah_reset_token')||new URLSearchParams(window.location.search).get('resetToken')||'';await api('/auth/reset-password',{method:'POST',body:JSON.stringify({email,token:resetToken,newPassword})});localStorage.removeItem('tah_reset_email');localStorage.removeItem('tah_reset_token');localStorage.removeItem('tah_verify_purpose');showToast('Password updated successfully! Please log in.')}catch(e:any){showToast(e.message||'Unable to reset password.')}};
  const resendVerificationEmail=async(email:string)=>{try{const r=await api<any>('/auth/resend-verification',{method:'POST',body:JSON.stringify({email})});showToast(r.message||'Verification email resent.')}catch(e:any){showToast(e.message||'Unable to resend verification email.')}};

  const markLessonComplete=async(courseId:string,lessonId:string)=>{
    try{const r=await api<any>(`/student/progress/${courseId}/lesson/${lessonId}/complete`,{method:'POST'});setProgressMap(p=>({...p,[courseId]:toProgress(r.progress)}));showToast('Lesson marked completed! +50 XP')}catch(e:any){showToast(e.message)}};
  const saveLessonNote=async(courseId:string,lessonId:string,noteText:string)=>{
    try{const r=await api<any>(`/student/progress/${courseId}/note/${lessonId}`,{method:'PATCH',body:JSON.stringify({note:noteText})});setProgressMap(p=>({...p,[courseId]:toProgress(r.progress)}));showToast('Notes saved.')}catch(e:any){showToast(e.message)}};
  const submitAssignment=async(courseId:string,assignmentId:string,text:string,fileName?:string)=>{
    try{const r=await api<any>(`/student/progress/${courseId}/assignments/${assignmentId}`,{method:'POST',body:JSON.stringify({text,fileName})});setProgressMap(p=>({...p,[courseId]:toProgress(r.progress)}));showToast('Assignment submitted successfully! +100 XP')}catch(e:any){showToast(e.message)}};
  const submitQuiz=async(courseId:string,answers:Record<string,number>,phase:'starting'|'final'='final')=>{
    try{const r=await api<any>(`/student/progress/${courseId}/quiz`,{method:'POST',body:JSON.stringify({answers,phase})});setProgressMap(p=>({...p,[courseId]:toProgress(r.progress)}));if(r.user)setCurrentUser(r.user);if(r.certificate)setCertificates(p=>[...p.filter(c=>c.id!==r.certificate.id),toCertificate(r.certificate)]);showToast(r.certificate?`Quiz Passed (${r.result.percentage}%)! Course completed and certificate unlocked.`:r.result.passed?`Quiz Passed (${r.result.percentage}%)! Program marked complete.`:`Score: ${r.result.percentage}%. Try again!`);return r.result}catch(e:any){showToast(e.message);return {passed:false,score:0,total:0,percentage:0}}
  };
  const completeCourse=async(courseId:string)=>{try{const r=await api<any>(`/student/progress/${courseId}/complete`,{method:'POST'});setProgressMap(p=>({...p,[courseId]:toProgress(r.progress)}));if(r.user)setCurrentUser(r.user)}catch(e:any){showToast(e.message)}};
  const enrollInCourse=async(courseId:string)=>{
    if(!currentUser){setCurrentView('auth-register');return}
    if(!isCourseUnlocked(courseId)){setCheckoutModalOpen(true);return}
    const enrolled=currentUser.enrolledCourseIds||[];
    if(!enrolled.includes(courseId)) setCurrentUser({...currentUser,enrolledCourseIds:[...enrolled,courseId]});
    setSelectedCourseId(courseId);
    setCurrentView('student-player');
    try{
      const r=await api<any>(`/student/enroll/${courseId}`,{method:'POST'});
      if(r.user)setCurrentUser(r.user);
    }catch(e:any){
      if(e.status!==402)showToast(e.message||'Course opened. Enrollment sync will retry.');
    }
  };
  const generateCertificateForCourse=(courseId:string)=>certificates.find(c=>c.courseId==='all-22-capabilities-master')||null;

  const openMasterCertificate=async()=>{
    if(totalCoursesCount===0 || completedCoursesCount<totalCoursesCount){showToast(`Certificate locked. Complete all ${totalCoursesCount} courses first.`);return;}
    try{const r=await api<any>('/student/certificates/master');const c=toCertificate(r.certificate);setMasterCertificate(c);setActiveCertificate(c);setViewCertificateModal(true);setCertificates(prev=>[...prev.filter(x=>x.id!==c.id),c])}catch(e:any){showToast(e.message)}};
  const completeAllCoursesForDemo=async()=>{for(const c of courses)await completeCourse(c.id);showToast('All capability programs marked complete.');};

  const upgradeToMonthlyPlan=async(paymentMethod='upi')=>{
    try{
      const orderResponse=await api<any>('/student/subscription/create-order',{method:'POST',body:JSON.stringify({paymentMethod})});
      await new Promise<void>((resolve,reject)=>{
        const finish=async()=>{try{
          const r:any=await api('/student/subscription/verify',{method:'POST',body:JSON.stringify({razorpay_order_id:orderResponse.order.id,razorpay_payment_id:(window as any).__tah_razorpay_payment_id,razorpay_signature:(window as any).__tah_razorpay_signature})});
          setCurrentUser(r.user);setPayments(p=>[r.payment,...p]);setCheckoutModalOpen(false);showToast('Payment verified. Annual Membership activated!');resolve();
        }catch(e){reject(e)}};
        const Razorpay=(window as any).Razorpay;
        if(!Razorpay){reject(new Error('Razorpay checkout is unavailable. Please check your internet connection.'));return;}
        const razorpay=new Razorpay({key:orderResponse.keyId,amount:orderResponse.order.amount,currency:orderResponse.order.currency,name:'ThinkAHead Learning Hub',description:'Annual Membership',order_id:orderResponse.order.id,handler:(response:any)=>{(window as any).__tah_razorpay_payment_id=response.razorpay_payment_id;(window as any).__tah_razorpay_signature=response.razorpay_signature;void finish();},prefill:{name:currentUser?.name,email:currentUser?.email},theme:{color:'#4f46e5'}});
        razorpay.on('payment.failed',(resp:any)=>{
          void api('/student/subscription/failed',{method:'POST',body:JSON.stringify({razorpay_order_id:orderResponse.order.id,reason:resp?.error?.description})}).catch(()=>{});
          reject(new Error('Payment failed. Please try again.'));
        });
        razorpay.open();
      });
    }catch(e:any){showToast(e.message||'Unable to start payment.')}
  };

  const registerLiveSession=async(id:string)=>{try{const r=await api<any>(`/student/live-sessions/${id}/register`,{method:'POST'});setLiveSessions(p=>p.map(s=>s.id===id?r.session:s));showToast('Registered for live masterclass!')}catch(e:any){showToast(e.message)}};
  const addCommunityPost=async(title:string,category:string,content:string)=>{try{const r=await api<any>('/student/community/posts',{method:'POST',body:JSON.stringify({title,category,content})});setCommunityPosts(p=>[normalizePost(r.post),...p]);showToast('Discussion topic posted!')}catch(e:any){showToast(e.message)}};
  const addCommunityReply=async(postId:string,content:string)=>{try{const r=await api<any>(`/student/community/posts/${postId}/replies`,{method:'POST',body:JSON.stringify({content})});setCommunityPosts(p=>p.map(x=>x.id===postId?normalizePost(r.post):x));showToast('Reply added to discussion!')}catch(e:any){showToast(e.message)}};
  const togglePostLike=async(postId:string)=>{try{const r=await api<any>(`/student/community/posts/${postId}/like`,{method:'POST'});setCommunityPosts(p=>p.map(x=>x.id===postId?{...x,likes:r.likes,likedByMe:r.likedByMe}:x))}catch(e:any){showToast(e.message)}};
  const sendMessage=async(threadId:string,text:string)=>{try{const r=await api<any>(`/student/chat/${threadId}/messages`,{method:'POST',body:JSON.stringify({text})});setChatThreads(p=>p.map(x=>x.id===threadId?normalizeThread(r.thread):x))}catch(e:any){showToast(e.message)}};
  const markNotificationAsRead=async(id:string)=>{try{await api(`/student/notifications/${id}/read`,{method:'PATCH'});setNotifications(p=>p.map(n=>n.id===id?{...n,read:true}:n))}catch(e:any){showToast(e.message)}};
  const markAllNotificationsAsRead=async()=>{try{await api('/student/notifications/read-all',{method:'POST'});setNotifications(p=>p.map(n=>({...n,read:true})));showToast('All notifications marked as read.')}catch(e:any){showToast(e.message)}};
  const sendBroadcastNotification=async(category:AppNotification['category'],title:string,message:string)=>{try{await api('/admin/notifications/broadcast',{method:'POST',body:JSON.stringify({category,title,message})});showToast('Broadcast notification sent to all learners!')}catch(e:any){showToast(e.message);throw e}};
  const updatePaymentStatus=async(id:string,status:'Successful'|'Pending'|'Failed')=>{try{const r=await api<any>(`/admin/payments/${id}`,{method:'PATCH',body:JSON.stringify({status})});setPayments(p=>p.map(x=>x.id===id?r.payment:x));showToast(`Payment marked ${status}`)}catch(e:any){showToast(e.message)}};
  const uploadProfilePhoto=async(file:File)=>{try{const r=await uploadFile<any>('/student/profile/photo','photo',file);setCurrentUser(r.user);showToast('Profile photo updated successfully.')}catch(e:any){showToast(e.message||'Unable to upload profile photo.')}};
  const updateProfile=async(data:{name?:string;phone?:string;bio?:string;avatar?:string})=>{try{const r=await api<any>('/student/profile',{method:'PATCH',body:JSON.stringify(data)});setCurrentUser(r.user);showToast('Profile updated successfully.')}catch(e:any){showToast(e.message)}};
  const updateSettings=async(data:{emailNotifications?:boolean})=>{try{const r=await api<any>('/student/settings',{method:'PATCH',body:JSON.stringify(data)});setCurrentUser(r.user);showToast('Account settings updated.')}catch(e:any){showToast(e.message)}};

  const submitContact=async(name:string,email:string,message:string)=>{try{await api('/public/contact',{method:'POST',body:JSON.stringify({name,email,message})});showToast('Message sent successfully! Our team will get back to you shortly.')}catch(e:any){showToast(e.message)}};
  const subscribeNewsletter=async(email:string)=>{try{await api('/public/newsletter',{method:'POST',body:JSON.stringify({email})});showToast('Subscribed to ThinkAHead updates!')}catch(e:any){showToast(e.message)}};

  const value:AppContextType={
    theme,setTheme,toggleTheme,currentView,setCurrentView,searchQuery,setSearchQuery,currentUser,setCurrentUser,switchToRole,login,register,logout,confirmLogout,cancelLogout,logoutConfirmOpen,updateProfile,uploadProfilePhoto,updateSettings,signInWithGoogle,requestPasswordReset,verifyPasswordResetOtp,resendPasswordResetOtp,completeVerifiedSession,resetPassword,resendVerificationEmail,
    courses,selectedCourseId,setSelectedCourseId,activeCourse,isCourseUnlocked,subscriptionUnlockedMonths,
    progressMap,markLessonComplete,saveLessonNote,submitAssignment,submitQuiz,completeCourse,enrollInCourse,
    completedCoursesCount,totalCoursesCount,enrolledCoursesCount,overallProgressPercent,masterCertificate,completeAllCoursesForDemo,openMasterCertificate,certificates,activeCertificate,setActiveCertificate,
    viewCertificateModal,setViewCertificateModal,generateCertificateForCourse,checkoutModalOpen,setCheckoutModalOpen,upgradeToMonthlyPlan,liveSessions,registerLiveSession,
    communityPosts,addCommunityPost,addCommunityReply,togglePostLike,chatThreads,activeChatId,setActiveChatId,sendMessage,notifications,markNotificationAsRead,
    markAllNotificationsAsRead,sendBroadcastNotification,achievements,payments,updatePaymentStatus,submitContact,subscribeNewsletter,toastMessage,showToast
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp=()=>{const context=useContext(AppContext);if(!context)throw new Error('useApp must be used within an AppProvider');return context};
