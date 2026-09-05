const INITIAL_STUDENT_USER = {
  id: 'usr-student-1',
  name: 'Anjali Sharma',
  email: 'anjali.sharma@email.com',
  phone: '+91 98765 43210',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  bio: 'Aspiring Executive & Engineering Graduate passionate about Human Capability Development.',
  enrolledCourseIds: ['course-1', 'course-2'],
  completedCourseIds: [],
  subscription: {
    active: false,
    plan: 'Free Trial',
    startDate: new Date().toISOString().slice(0, 10),
    expiresDate: '',
    unlockedMonths: 1,
    amount: 0
  },
  streakDays: 0,
  totalHours: 0,
  points: 0,
  unlockedBadgeIds: []
};

const INITIAL_ADMIN_USER = {
  id: 'usr-admin-1',
  name: 'G. Satyanarayana',
  email: 'admin@ihcdr.org',
  phone: '+91 70166 28327',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  bio: 'Founder Director - The Institute of Human Capability Development and Research (IHCDR)',
  enrolledCourseIds: [],
  completedCourseIds: [],
  subscription: {
    active: true,
    plan: 'Monthly Premium',
    startDate: '2020-01-01',
    expiresDate: '2030-01-01',
    unlockedMonths: 12,
    amount: 0
  },
  streakDays: 450,
  totalHours: 1800,
  points: 15000,
  unlockedBadgeIds: ['badge-1', 'badge-2', 'badge-3']
};

const MASTER_OVERALL_CERTIFICATE = {
  id: 'master-cert-overall',
  certificateNumber: 'IHCDR-MASTER-2026-HC22-008921',
  studentName: 'Anjali Sharma',
  studentEmail: 'anjali.sharma@email.com',
  courseId: 'all-22-capabilities-master',
  courseName: 'Master Diploma in Human Capability Development (22 Core Capabilities)',
  issueDate: '18 August 2026',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://ihcdr.org/verify/IHCDR-MASTER-2026-HC22-008921',
  directorName: 'Prof. Dr. A. K. Sharma',
  founderName: 'G. Satyanarayana',
  verified: true
};

const INITIAL_CERTIFICATES = [
  MASTER_OVERALL_CERTIFICATE
];

const INITIAL_TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Anjali Sharma',
    role: 'Product Lead & Alum',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    quote: 'The capability programs completely changed my clarity and confidence. The practical lessons helped me secure a fast-track leadership promotion within 6 months.',
    stars: 5,
    courseTaken: 'Leadership Development'
  },
  {
    id: 't-2',
    name: 'Rohit Mehta',
    role: 'Senior Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    quote: 'Academics taught me coding, but ThinkAHead taught me emotional intelligence, communication, and workplace psychology. It made all the difference.',
    stars: 5,
    courseTaken: 'Communication Mastery'
  },
  {
    id: 't-3',
    name: 'Pooja Verma',
    role: 'Operations Consultant',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    quote: 'The ₹1000 annual membership is an unbelievable investment. Unlocking two structured modules every month keeps my learning cadence consistent and high-impact.',
    stars: 5,
    courseTaken: 'Time Management'
  },
  {
    id: 't-4',
    name: 'Karthik Reddy',
    role: 'Founder & Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    quote: 'The Institute’s 200+ years of industrial wisdom shines through every case study. The assignments test real application, not just theoretical book knowledge.',
    stars: 5,
    courseTaken: 'Entrepreneurship Essentials'
  }
];

const INITIAL_LIVE_SESSIONS = [
  {
    id: 'live-1',
    title: 'Building Confidence & Executive Presence in High-Stakes Meetings',
    speaker: {
      name: 'G. Satyanarayana',
      title: 'Founder Director, IHCDR',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    category: 'Leadership Masterclass',
    date: 'Tomorrow, 7:00 PM IST',
    time: '7:00 PM - 8:30 PM',
    duration: '90 Mins',
    status: 'upcoming',
    joinUrl: 'https://zoom.us/j/thinkahead-live-session-1',
    registeredCount: 420,
    description: 'Interactive workshop on overcoming workplace impostor syndrome, projecting vocal authority, and leading cross-functional reviews.'
  },
  {
    id: 'live-2',
    title: 'Leadership in Action: Crisis Management & Resolving Deadlocks',
    speaker: {
      name: 'Dr. Rahul Verma',
      title: 'Senior Executive Trainer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    },
    category: 'Executive Strategy',
    date: '24 Aug 2026, 6:00 PM IST',
    time: '6:00 PM - 7:30 PM',
    duration: '90 Mins',
    status: 'upcoming',
    joinUrl: 'https://zoom.us/j/thinkahead-live-session-2',
    registeredCount: 310,
    description: 'Real-time case dissection of industrial operational disruptions and how decisive leadership averted catastrophic losses.'
  },
  {
    id: 'live-3',
    title: 'Effective Communication Techniques in the Hybrid Workplace',
    speaker: {
      name: 'Dr. Ananya Roy',
      title: 'Organizational Psychologist',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80'
    },
    category: 'Communication',
    date: 'Completed 12 Aug 2026',
    time: '1h 24m Recording',
    duration: '84 Mins',
    status: 'recorded',
    joinUrl: '',
    replayUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    registeredCount: 580,
    description: 'Full replay available with slide downloads and Q&A chat transcript.'
  },
  {
    id: 'live-4',
    title: 'Goal Setting & Habit Architecture for High Performers',
    speaker: {
      name: 'Vikramaditya Shah',
      title: 'Innovation Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    category: 'Productivity',
    date: 'Completed 05 Aug 2026',
    time: '1h 15m Recording',
    duration: '75 Mins',
    status: 'recorded',
    joinUrl: '',
    replayUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    registeredCount: 640,
    description: 'Systematic frameworks to transition from vague new year resolutions to automated daily execution habits.'
  }
];

const INITIAL_ACHIEVEMENTS = [
  { id: 'badge-1', title: 'First Step', description: 'Enrolled in your first capability course', icon: '🚀', category: 'Course', unlocked: true, unlockedAt: '15 Jan 2024' },
  { id: 'badge-2', title: 'Fast Learner', description: 'Completed 5 lessons in a single day', icon: '⚡', category: 'Streak', unlocked: true, unlockedAt: '18 Jan 2024' },
  { id: 'badge-3', title: 'Master Mind', description: 'Scored 100% on a certification quiz', icon: '🧠', category: 'Quiz', unlocked: true, unlockedAt: '20 May 2024' },
  { id: 'badge-4', title: 'Leadership Pioneer', description: 'Finished the entire Leadership Development track', icon: '👑', category: 'Course', unlocked: true, unlockedAt: '20 May 2024' },
  { id: 'badge-5', title: 'Streak Champion', description: 'Maintained a 10-day consecutive study streak', icon: '🔥', category: 'Streak', unlocked: true, unlockedAt: '12 Aug 2024' },
  { id: 'badge-6', title: 'Communicator', description: 'Completed all communication assignments', icon: '🎙️', category: 'Course', unlocked: true, unlockedAt: '15 Aug 2024' },
  { id: 'badge-7', title: 'Curious Mind', description: 'Downloaded 10+ resource handbooks', icon: '📚', category: 'Course', unlocked: true, unlockedAt: '01 Sep 2024' },
  { id: 'badge-8', title: 'Community Pillar', description: 'Contributed 5 insightful answers in forum', icon: '💬', category: 'Community', unlocked: true, unlockedAt: '05 Sep 2024' },
  { id: 'badge-9', title: 'Problem Solver', description: 'Resolved 3 industrial case studies', icon: '🧩', category: 'Quiz', unlocked: true, unlockedAt: '28 Oct 2024' },
  { id: 'badge-10', title: 'Night Owl', description: 'Completed study session after 10 PM', icon: '🦉', category: 'Streak', unlocked: true, unlockedAt: '02 Nov 2024' },
  { id: 'badge-11', title: 'Deep Thinker', description: 'Wrote 10+ personalized lesson notes', icon: '✍️', category: 'Course', unlocked: true, unlockedAt: '10 Nov 2024' },
  { id: 'badge-12', title: 'Certified Pro', description: 'Earned 5 industry certificates', icon: '📜', category: 'Course', unlocked: true, unlockedAt: '15 Nov 2024' },
  { id: 'badge-13', title: 'Live Attendee', description: 'Attended 3 live interactive masterclasses', icon: '🎥', category: 'Community', unlocked: true, unlockedAt: '20 Nov 2024' },
  { id: 'badge-14', title: 'Resilience Star', description: 'Completed the Mindset & Emotional Intelligence track', icon: '⭐', category: 'Course', unlocked: true, unlockedAt: '01 Dec 2024' },
  { id: 'badge-15', title: 'Century Club', description: 'Logged 100+ total hours of capability development', icon: '🏆', category: 'Streak', unlocked: true, unlockedAt: '15 Dec 2024' }
];

const INITIAL_COMMUNITY_POSTS = [
  {
    id: 'post-1',
    author: {
      name: 'Anjali Sharma',
      role: 'Student Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    title: 'How do you handle micro-management while maintaining emotional composure?',
    category: 'Leadership & EQ',
    content: 'In Module 3 of Leadership Development, Mr. Satyanarayana discussed setting boundaries with extreme ownership. Has anyone applied the 6-second pause protocol in real workplace reviews with demanding clients?',
    createdAt: '2 hours ago',
    likes: 24,
    likedByMe: true,
    replies: [
      {
        id: 'rep-1',
        author: {
          name: 'G. Satyanarayana',
          role: 'Founder Director (Mentor)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
        },
        content: 'Excellent observation Anjali. The key is to provide proactive daily status dashboards before the manager even asks. It replaces anxiety with verified confidence.',
        createdAt: '1 hour ago',
        likes: 18
      },
      {
        id: 'rep-2',
        author: {
          name: 'Rohit Mehta',
          role: 'Student Member',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
        },
        content: 'I used the exact scripts from the Communication Mastery cheat sheet during last week sprint retrospective. It de-escalated tension immediately!',
        createdAt: '45 mins ago',
        likes: 7
      }
    ]
  },
  {
    id: 'post-2',
    author: {
      name: 'Karthik Reddy',
      role: 'Student Member',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
    },
    title: 'Study Group: Monthly Unlock 3 - Entrepreneurship & Financial Literacy',
    category: 'Study Groups',
    content: 'Looking for 3 study partners to collaborate on the Business Model Canvas assignment and review each other’s investment allocation spreadsheets this weekend.',
    createdAt: '5 hours ago',
    likes: 15,
    replies: []
  }
];

const INITIAL_CHAT_THREADS = [
  {
    id: 'chat-1',
    user: {
      id: 'usr-mentor-1',
      name: 'Dr. Rahul Verma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      role: 'Mentor & Communication Coach',
      online: true
    },
    lastMessage: 'Great job on your executive pitch assignment! I left detailed feedback on your vocal pitch and pause cadence.',
    lastMessageTime: '10:35 AM',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: 'usr-student-1', text: 'Hello Dr. Verma, I submitted my 2-minute elevator pitch video for review.', time: '09:15 AM', isSender: true },
      { id: 'm2', senderId: 'usr-mentor-1', text: 'Hello Anjali! I watched the recording. Your opening hook in the first 15 seconds is remarkably compelling.', time: '10:30 AM', isSender: false },
      { id: 'm3', senderId: 'usr-mentor-1', text: 'Great job on your executive pitch assignment! I left detailed feedback on your vocal pitch and pause cadence.', time: '10:35 AM', isSender: false }
    ]
  },
  {
    id: 'chat-2',
    user: {
      id: 'usr-mentor-2',
      name: 'Support Team (IHCDR)',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
      role: 'Student Helpdesk',
      online: true
    },
    lastMessage: 'Your annual membership verification is complete. Certificate export is enabled.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm4', senderId: 'usr-student-1', text: 'Hi, can I download my verified PDF certificates for LinkedIn?', time: 'Yesterday 2:00 PM', isSender: true },
      { id: 'm5', senderId: 'usr-mentor-2', text: 'Your annual membership verification is complete. Certificate export is enabled.', time: 'Yesterday 2:10 PM', isSender: false }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n-1',
    category: 'Assignments',
    title: 'New Assignment Graded',
    message: 'Your submission for "Leadership Case Study Analysis" scored 95/100.',
    time: '10 mins ago',
    read: false,
    actionUrl: '/student/assignments'
  },
  {
    id: 'n-2',
    category: 'Live Sessions',
    title: 'Live Workshop Reminder',
    message: 'Upcoming: "Building Confidence & Executive Presence" begins tomorrow at 7:00 PM IST.',
    time: '2 hours ago',
    read: false,
    actionUrl: '/student/live-sessions'
  },
  {
    id: 'n-3',
    category: 'Course Updates',
    title: 'Month 3 Courses Unlocked!',
    message: 'Entrepreneurship Essentials and Financial Literacy are now active in your portal.',
    time: '1 day ago',
    read: true,
    actionUrl: '/student/all-courses'
  },
  {
    id: 'n-4',
    category: 'Quiz Reminders',
    title: 'Quiz Passed',
    message: 'Congratulations! You achieved 100% on the Leadership Certification Exam.',
    time: '3 days ago',
    read: true,
    actionUrl: '/student/certificates'
  }
];

const INITIAL_PAYMENTS = [
  { id: 'pay-1', transactionId: 'TXN_98412891', studentName: 'Anjali Sharma', studentEmail: 'anjali.sharma@email.com', plan: 'Annual Membership', amount: 1000, date: '2024-01-15', status: 'Successful', paymentMethod: 'UPI / Razorpay' },
  { id: 'pay-2', transactionId: 'TXN_98412892', studentName: 'Rohit Mehta', studentEmail: 'rohit.mehta@email.com', plan: 'Annual Membership', amount: 1000, date: '2024-02-10', status: 'Successful', paymentMethod: 'Credit Card' },
  { id: 'pay-3', transactionId: 'TXN_98412893', studentName: 'Pooja Verma', studentEmail: 'pooja.verma@email.com', plan: 'Annual Membership', amount: 1000, date: '2024-03-01', status: 'Successful', paymentMethod: 'Net Banking' },
  { id: 'pay-4', transactionId: 'TXN_98412894', studentName: 'Karthik Reddy', studentEmail: 'karthik.r@email.com', plan: 'Annual Membership', amount: 1000, date: '2024-03-18', status: 'Successful', paymentMethod: 'UPI' },
  { id: 'pay-5', transactionId: 'TXN_98412895', studentName: 'Sneha Patel', studentEmail: 'sneha.p@email.com', plan: 'Annual Membership', amount: 1000, date: '2024-04-02', status: 'Successful', paymentMethod: 'Debit Card' }
];

const INITIAL_FAQS = [
  {
    q: 'What is ThinkAHead Learning Hub and IHCDR?',
    a: 'The Institute of Human Capability Development and Research (IHCDR) is a collective of senior industrial professionals with over 200 years of combined industry experience. ThinkAHead Learning Hub is our online platform offering 22 essential life, leadership, and workplace capability courses.'
  },
  {
    q: 'Who can join the capability development programs?',
    a: 'Our programs are designed for students, fresh graduates, junior executives, and working professionals seeking to bridge the gap between academic theory and real-world industrial employability.'
  },
  {
    q: 'Are the four foundation courses completely free?',
    a: 'Yes! The four foundation courses (Leadership Development, Communication Mastery, DISC Profiling and Team Building) are 100% free with full access to video lessons, resources and quizzes.'
  },
  {
    q: 'How does the Annual Membership and monthly unlock work?',
    a: 'For a nominal annual fee of ₹1000/year, members unlock the entire ecosystem. Two new structured courses are systematically unlocked each month, providing a structured, non-overwhelming 12-month transformation journey.'
  },
  {
    q: 'Will I receive an industry-recognized certificate?',
    a: 'Yes. Upon completing all video lessons, submitting assignments, and passing the module quiz with 70% or higher, you receive a digitally verified certificate featuring unique ID, QR verification, and signatures from our Director and Founder.'
  },
  {
    q: 'Can I download study notes and resources offline?',
    a: 'Absolutely. Every course includes downloadable PDF handbooks, templates, checklists, and printable worksheets.'
  }
];

module.exports = {
INITIAL_STUDENT_USER,
INITIAL_ADMIN_USER,
MASTER_OVERALL_CERTIFICATE,
INITIAL_CERTIFICATES,
INITIAL_TESTIMONIALS,
INITIAL_LIVE_SESSIONS,
INITIAL_ACHIEVEMENTS,
INITIAL_COMMUNITY_POSTS,
INITIAL_CHAT_THREADS,
INITIAL_NOTIFICATIONS,
INITIAL_PAYMENTS,
INITIAL_FAQS
};
