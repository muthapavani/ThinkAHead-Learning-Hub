export type { AppView } from '../context/AppContext';

export type ThemeMode = 'dark' | 'light';

export type UserRole = 'student' | 'admin' | 'guest';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  subscription: {
    active: boolean;
    plan: 'Annual Premium' | 'Monthly Premium' | 'Free Trial';
    startDate: string;
    expiresDate: string;
    unlockedMonths: number;
    amount: number;
  };
  streakDays: number;
  totalHours: number;
  points: number;
  unlockedBadgeIds: string[];
  emailVerified?: boolean;
  emailNotifications?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CourseQuiz {
  id: string;
  title: string;
  durationMinutes: number;
  passingScorePercentage: number;
  questions: QuizQuestion[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  videoUrl: string;
  videoUrls?: string[];
  description: string;
  keyPoints: string[];
  order: number;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseResource {
  id: string;
  title: string;
  type: 'pdf' | 'notes' | 'worksheet';
  fileName: string;
  fileSize: string;
  category: string;
  downloadUrl?: string;
  contentSummary?: string;
  published?: boolean;
}

export interface CourseAssignment {
  id: string;
  title: string;
  dueDate: string;
  points: number;
  description: string;
  guidelines: string[];
  status?: 'pending' | 'submitted' | 'graded';
  submittedFile?: string;
  submittedText?: string;
  grade?: number;
  feedback?: string;
}

export interface Course {
  id: string;
  courseNumber?: number;
  title: string;
  slug: string;
  category: 'Personal Growth' | 'Professional Skills' | 'Leadership' | 'Future Skills';
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  bannerImage: string;
  totalDuration: string;
  lessonsCount: number;
  isFree: boolean; // Courses marked true are free
  monthUnlock: number; // 1, 2, 3...
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewsCount: number;
  instructor: {
    name: string;
    title: string;
    avatar: string;
    experience: string;
  };
  modules: CourseModule[];
  resources: CourseResource[];
  assignments: CourseAssignment[];
  quiz: CourseQuiz;
  learningOutcomes: string[];
}

export interface StudentCourseProgress {
  courseId: string;
  percent: number;
  completedLessonIds: string[];
  currentLessonId: string;
  notes: Record<string, string>; // lessonId -> noteContent
  assignmentSubmissions: Record<string, {
    submittedAt: string;
    fileContent?: string;
    fileName?: string;
    textResponse?: string;
    status: 'submitted' | 'graded';
    score?: number;
    feedback?: string;
  }>;
  quizResult?: {
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    takenAt: string;
  };
  startingQuizResult?: {
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    takenAt: string;
  };
  isCompleted: boolean;
  completedDate?: string;
  certificateEarned: boolean;
  certificateId?: string;
}

export interface CertificateRecord {
  id: string;
  certificateNumber: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  qrCodeUrl: string;
  directorName: string;
  founderName: string;
  verified: boolean;
  overallAssessmentScore?: number;
  assessmentScores?: Array<{ courseId: string; courseTitle: string; score: number; total: number; percentage: number }>;
}

export interface LiveSession {
  id: string;
  title: string;
  speaker: {
    name: string;
    title: string;
    avatar: string;
  };
  category: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'recorded';
  joinUrl: string;
  replayUrl?: string;
  registeredCount: number;
  description: string;
}

export interface ForumPost {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  title: string;
  category: string;
  content: string;
  createdAt: string;
  likes: number;
  likedByMe?: boolean;
  replies: {
    id: string;
    author: {
      name: string;
      role: string;
      avatar: string;
    };
    content: string;
    createdAt: string;
    likes: number;
  }[];
}

export interface ChatThread {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    online: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: {
    id: string;
    senderId: string;
    text: string;
    time: string;
    isSender: boolean;
  }[];
}

export interface AppNotification {
  id: string;
  category: 'Course Updates' | 'Assignments' | 'Quiz Reminders' | 'Live Sessions' | 'Community' | 'System Notifications' | 'Membership' | 'Certificates' | 'Platform News' | 'Quiz & Assessments';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Course' | 'Streak' | 'Quiz' | 'Community';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  studentName: string;
  studentEmail: string;
  plan: string;
  amount: number;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed';
  paymentMethod: string;
}
