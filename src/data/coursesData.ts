import { Course } from '../types';

export const COURSES_DATA: Course[] = [
  {
    id: 'course-1',
    title: 'Leadership Development',
    slug: 'leadership-development',
    category: 'Leadership',
    shortDescription: 'Unleash your hidden potential, define high-impact vision, passion and master executive leadership principles.',
    fullDescription: 'Ground-breaking course crafted from 200+ collective years of industrial executive leadership experience. Learn how to discover your core strengths, articulate strategic visions, align personal purpose with organizational missions, and command genuine respect as a transformative modern leader.',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '12h 45m',
    lessonsCount: 24,
    isFree: false,
    monthUnlock: 1,
    level: 'Beginner',
    rating: 4.9,
    reviewsCount: 1420,
    instructor: {
      name: 'G. Satyanarayana',
      title: 'Founder Director, IHCDR',
      avatar: '/assets/images/founder-photo.png',
      experience: '35+ Years Senior Industrial Leadership'
    },
    learningOutcomes: [
      'Unleash latent cognitive and executive leadership potential',
      'Formulate actionable personal & organizational visions',
      'Overcome imposter syndrome and cultivate executive presence',
      'Direct multidisciplinary teams towards high-performance goals'
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Self Awareness & Potential Discovery',
        lessons: [
          {
            id: 'les-1-1',
            title: '1. Introduction: Unleash Your True Potential',
            duration: '18m 30s',
            durationSeconds: 1110,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Deconstruct the subconscious barriers holding you back from recognizing your true capacity in industrial and professional environments.',
            keyPoints: [
              'Human capability is abundant, not scarce',
              'Recognizing self-imposed cognitive bottlenecks',
              'The formula for converting raw aptitude into industry impact'
            ],
            order: 1
          },
          {
            id: 'les-1-2',
            title: '2. Vision, Passion and Purpose Alignment',
            duration: '22m 15s',
            durationSeconds: 1335,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'How to build an internal compass that drives unwavering motivation through adversity and market shifts.',
            keyPoints: [
              'Distinguishing between temporary goals and deep purpose',
              'Aligning personal values with corporate mission',
              'The 3 pillars of sustained professional passion'
            ],
            order: 2
          },
          {
            id: 'les-1-3',
            title: '3. Executive Mindset & Behavioral Traits',
            duration: '25m 40s',
            durationSeconds: 1540,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            description: 'Mastering the behavioural traits expected by senior industry leaders: integrity, responsibility, and emotional maturity.',
            keyPoints: [
              'Moving from victim mentality to extreme ownership',
              'Embodying ethical decision making under pressure',
              'Creating a culture of transparency and trust'
            ],
            order: 3
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Strategic Vision & Execution',
        lessons: [
          {
            id: 'les-1-4',
            title: '4. Decision Making Under High Uncertainty',
            duration: '24m 10s',
            durationSeconds: 1450,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            description: 'A structured model for risk assessment, rapid hypothesis testing, and decisive leadership during enterprise crises.',
            keyPoints: [
              'The 80/20 decision rule in business operations',
              'Navigating cognitive biases in managerial choices',
              'Communicating direction clearly in volatile situations'
            ],
            order: 4
          },
          {
            id: 'les-1-5',
            title: '5. Leading Teams with Empathy and Rigor',
            duration: '28m 00s',
            durationSeconds: 1680,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            description: 'How exceptional leaders balance psychological safety with uncompromising performance benchmarks.',
            keyPoints: [
              'Creating high-trust psychological safety containers',
              'Setting clear KPIs without micromanagement',
              'Conflict resolution frameworks for high-stakes teams'
            ],
            order: 5
          }
        ]
      }
    ],
    resources: [
      {
        id: 'res-1',
        title: 'Leadership Framework & Strategy Blueprint',
        type: 'pdf',
        fileName: 'Leadership_Framework_Guide.pdf',
        fileSize: '4.8 MB',
        category: 'Leadership Handbook',
        contentSummary: 'Complete 45-page executive summary covering strategic alignment, decision matrices, and stakeholder management.'
      },
      {
        id: 'res-2',
        title: 'Personal Potential Audit & Goal Matrix',
        type: 'worksheet',
        fileName: 'Potential_Audit_Template.xlsx',
        fileSize: '1.2 MB',
        category: 'Action Worksheet',
        contentSummary: 'Self-assessment workbook to evaluate current capability against industrial competency standards.'
      }
    ],
    assignments: [
      {
        id: 'asg-1',
        title: 'Leadership Case Study Analysis: Turnaround Scenario',
        dueDate: 'Due in 7 Days',
        points: 100,
        description: 'Read the simulated corporate restructuring crisis and produce a 500-word Strategic Intervention Plan addressing morale, resource constraints, and market delivery.',
        guidelines: [
          'Identify at least three critical operational vulnerabilities',
          'Propose clear communication scripts for executive and junior staff',
          'Include 3-month milestone metrics'
        ]
      }
    ],
    quiz: {
      id: 'quiz-1',
      title: 'Leadership & Vision Mastery Certification Exam',
      durationMinutes: 20,
      passingScorePercentage: 70,
      questions: [
        {
          id: 'q1-1',
          question: 'According to industry surveys cited by IHCDR, which critical factor forms 15% of employer hiring expectations?',
          options: ['Integrity & Values', 'Office Presence', 'Programming Speed', 'Typing Velocity'],
          correctAnswer: 0,
          explanation: 'Integrity & Values is heavily weighted at 15% in employer evaluations, as noted in the India Skills CII study.'
        },
        {
          id: 'q1-2',
          question: 'What is the primary difference between a manager and a transformative leader?',
          options: [
            'Managers focus strictly on processes; leaders inspire vision and unlock human capability',
            'Managers earn higher salaries',
            'Leaders only work on financial spreadsheets',
            'There is no functional distinction'
          ],
          correctAnswer: 0,
          explanation: 'Transformational leaders elevate individuals by imparting vision and tapping latent human capability beyond mere transactional task management.'
        },
        {
          id: 'q1-3',
          question: 'When facing extreme ambiguity in project execution, what should a leader do first?',
          options: [
            'Panic and assign blame',
            'Clarify core objectives, assess known data, and communicate transparently with stakeholders',
            'Wait for upper management to decide everything',
            'Cancel all ongoing initiatives'
          ],
          correctAnswer: 1,
          explanation: 'Clarity of core objectives coupled with authentic transparency calms team anxiety and establishes an operational path forward.'
        }
      ]
    }
  },
  {
    id: 'course-2',
    title: 'Communication Mastery',
    slug: 'communication-mastery',
    category: 'Professional Skills',
    shortDescription: 'Master verbal, non-verbal, persuasive, and empathetic communication techniques for professional and interpersonal excellence.',
    fullDescription: 'Communication accounts for 14% of core workplace hiring weightage. Learn the science of articulation, active listening, non-verbal posture, executive presentations, and conflict resolution from seasoned corporate trainers.',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '10h 30m',
    lessonsCount: 18,
    isFree: false,
    monthUnlock: 1,
    level: 'Beginner',
    rating: 4.8,
    reviewsCount: 1210,
    instructor: {
      name: 'Dr. Rahul Verma',
      title: 'Senior Executive Trainer & Academician',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      experience: '20+ Years Corporate Communication'
    },
    learningOutcomes: [
      'Deliver persuasive presentations with crystal clarity',
      'Deploy active listening to de-escalate tension and build rapport',
      'Master professional body language and vocal modulation',
      'Draft concise, influential written business communications'
    ],
    modules: [
      {
        id: 'mod-2-1',
        title: 'Module 1: The Foundations of Impactful Communication',
        lessons: [
          {
            id: 'les-2-1',
            title: '1. The Anatomy of Modern Communication',
            duration: '16m 40s',
            durationSeconds: 1000,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Why 75% of technical graduates fail interviews due to articulation gaps and how to remedy it immediately.',
            keyPoints: [
              'The 7 Cs of professional communication',
              'Eliminating filler words and verbal ticks',
              'Framing ideas tailored to your listeners context'
            ],
            order: 1
          },
          {
            id: 'les-2-2',
            title: '2. Active Listening & Empathetic Response',
            duration: '21m 10s',
            durationSeconds: 1270,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            description: 'Deep listening as a superpower for negotiation, mentorship, and building unwavering client trust.',
            keyPoints: [
              'Levels of listening: Passive, Active, Empathetic',
              'Mirroring and validating counterpart perspectives',
              'Asking high-value open-ended diagnostic questions'
            ],
            order: 2
          }
        ]
      }
    ],
    resources: [
      {
        id: 'res-2-1',
        title: 'Effective Communication Techniques & Cheat Sheet',
        type: 'pdf',
        fileName: 'Communication_Techniques_PDF.pdf',
        fileSize: '3.4 MB',
        category: 'Communication Handbook',
        contentSummary: 'Comprehensive reference of speech structures, elevator pitches, and negotiation scripts.'
      }
    ],
    assignments: [
      {
        id: 'asg-2-1',
        title: 'Record a 2-Minute Executive Pitch',
        dueDate: 'Due in 5 Days',
        points: 100,
        description: 'Prepare a 120-second elevator pitch presenting an innovative solution to an existing workplace inefficiency.',
        guidelines: [
          'Hook within the first 15 seconds',
          'Clear problem statement and value metric',
          'Crisp, actionable call to action'
        ]
      }
    ],
    quiz: {
      id: 'quiz-2',
      title: 'Communication Skills Assessment',
      durationMinutes: 15,
      passingScorePercentage: 70,
      questions: [
        {
          id: 'q2-1',
          question: 'Which element represents the most impactful aspect of active listening?',
          options: [
            'Waiting impatiently for your turn to speak',
            'Focusing entirely on the speaker, reflecting emotions, and asking clarifying questions',
            'Interrupting frequently to display domain knowledge',
            'Checking your smartphone'
          ],
          correctAnswer: 1,
          explanation: 'Active listening demands undivided cognitive presence, emotional attunement, and validating reflection.'
        }
      ]
    }
  },
  {
    id: 'course-3',
    title: 'Emotional Intelligence & Self Management',
    slug: 'emotional-intelligence',
    category: 'Personal Growth',
    shortDescription: 'Master emotional regulation, self-awareness, stress management, and empathetic workplace dynamics.',
    fullDescription: 'Cultivate high EQ to navigate workplace stress, manage interpersonal conflict, foster resilience, and maintain emotional equilibrium during difficult transitions.',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '9h 15m',
    lessonsCount: 16,
    isFree: false,
    monthUnlock: 1,
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 890,
    instructor: {
      name: 'Dr. Ananya Roy',
      title: 'Executive Psychologist & EQ Consultant',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
      experience: '18+ Years Organizational Psychology'
    },
    learningOutcomes: [
      'Identify emotional triggers and regulate stress responses in real-time',
      'Cultivate authentic empathy across diverse cultural teams',
      'Build internal resilience against professional setbacks'
    ],
    modules: [
      {
        id: 'mod-3-1',
        title: 'Module 1: Emotional Architecture & Self Regulation',
        lessons: [
          {
            id: 'les-3-1',
            title: '1. The Neuroscience of Emotional Intelligence',
            duration: '20m 10s',
            durationSeconds: 1210,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Understand the amygdala hijack mechanism and train the prefrontal cortex to respond deliberately rather than react impulsively.',
            keyPoints: ['Amygdala hijack vs Prefrontal deliberation', 'The 6-second pause protocol', 'Mapping your somatic trigger points'],
            order: 1
          }
        ]
      }
    ],
    resources: [
      {
        id: 'res-3-1',
        title: 'Emotional Intelligence Workbook',
        type: 'pdf',
        fileName: 'EQ_Workbook.pdf',
        fileSize: '5.1 MB',
        category: 'EQ Guides'
      }
    ],
    assignments: [
      {
        id: 'asg-3-1',
        title: '7-Day Emotional Trigger Audit',
        dueDate: 'Due in 7 Days',
        points: 100,
        description: 'Track and document 5 high-stress moments over one week. Analyze your initial biological response and your corrective cognitive reframing.',
        guidelines: ['Describe the trigger context', 'Document physical sensations', 'Reflect on alternate empathetic interpretations']
      }
    ],
    quiz: {
      id: 'quiz-3',
      title: 'Emotional Intelligence Competency Test',
      durationMinutes: 15,
      passingScorePercentage: 70,
      questions: [
        {
          id: 'q3-1',
          question: 'What is the primary indicator of high emotional self-regulation in a crisis?',
          options: [
            'Suppressing all emotions until you explode',
            'Recognizing emotional activation and choosing a calm, proportional response',
            'Blaming peers for inducing stress',
            'Leaving the meeting abruptly'
          ],
          correctAnswer: 1,
          explanation: 'Self-regulation is the cognitive discipline to pause, observe emotions without judgment, and choose constructive actions.'
        }
      ]
    }
  },
  {
    id: 'course-4',
    title: 'Time Management & Peak Productivity',
    slug: 'time-management-productivity',
    category: 'Personal Growth',
    shortDescription: 'Engineer elite daily workflows, overcome procrastination, prioritize high-leverage activities, and maximize output.',
    fullDescription: 'Time is the ultimate non-renewable asset. Discover proven frameworks used by top industrial executives to manage relentless workloads, eliminate cognitive distractions, and achieve deep flow states.',
    thumbnail: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '8h 20m',
    lessonsCount: 14,
    isFree: false,
    monthUnlock: 1,
    level: 'Beginner',
    rating: 4.8,
    reviewsCount: 760,
    instructor: {
      name: 'G. Satyanarayana',
      title: 'Founder Director, IHCDR',
      avatar: '/assets/images/founder-photo.png',
      experience: '35+ Years Senior Industrial Leadership'
    },
    learningOutcomes: [
      'Apply Eisenhower and Pareto principles to everyday tasks',
      'Protect attention spans and access uninterrupted deep work states',
      'Design sustainable daily systems that prevent burnout'
    ],
    modules: [
      {
        id: 'mod-4-1',
        title: 'Module 1: Systematic Prioritization',
        lessons: [
          {
            id: 'les-4-1',
            title: '1. High Leverage vs Low Leverage Work',
            duration: '17m 45s',
            durationSeconds: 1065,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Why being busy is not the same as being effective. Master the art of delegating, automating, and eliminating.',
            keyPoints: ['The 80/20 leverage law', 'Batching micro-tasks', 'Defending calendar boundaries'],
            order: 1
          }
        ]
      }
    ],
    resources: [
      {
        id: 'res-4-1',
        title: 'Daily Productivity Planner & Time Blocking Template',
        type: 'worksheet',
        fileName: 'Productivity_Planner.pdf',
        fileSize: '2.8 MB',
        category: 'Worksheet'
      }
    ],
    assignments: [
      {
        id: 'asg-4-1',
        title: 'Design Your Weekly Time-Block Matrix',
        dueDate: 'Due in 3 Days',
        points: 100,
        description: 'Map out 168 hours of your week into focused blocks for Deep Work, Health, Rest, and Administrative upkeep.',
        guidelines: ['Highlight at least 15 hours of uninterrupted deep focus', 'Include buffer zones for urgent surprises']
      }
    ],
    quiz: {
      id: 'quiz-4',
      title: 'Productivity Mastery Quiz',
      durationMinutes: 15,
      passingScorePercentage: 70,
      questions: [
        {
          id: 'q4-1',
          question: 'According to the Eisenhower Matrix, which quadrant should high-performing leaders prioritize?',
          options: [
            'Urgent and Not Important',
            'Not Urgent but Highly Important (Strategic planning & capability development)',
            'Urgent and Unimportant interruptions',
            'Neither Urgent nor Important'
          ],
          correctAnswer: 1,
          explanation: 'Quadrant 2 (Not Urgent but Important) prevents future crises and produces exponential long-term capability growth.'
        }
      ]
    }
  },
  {
    id: 'course-5',
    title: 'Imagination, Creativity & Innovation',
    slug: 'creativity-innovation',
    category: 'Future Skills',
    shortDescription: 'Break rigid thought patterns, foster breakthrough creative problem solving, and engineer transformative innovations.',
    fullDescription: 'Modern employers value learning agility and lateral thinking above mechanical rote memory. Explore ideation methodologies, design thinking protocols, and creative risk taking to solve real-world industrial dilemmas.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '11h 10m',
    lessonsCount: 20,
    isFree: false,
    monthUnlock: 2,
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 650,
    instructor: {
      name: 'Vikramaditya Shah',
      title: 'Innovation Architect & Patent Holder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      experience: '22+ Years R&D and Industrial Innovation'
    },
    learningOutcomes: [
      'Master First-Principles thinking to dismantle complex problems',
      'Run rapid brainstorming sprints and prototyping iterations',
      'Transform abstract insights into commercially viable solutions'
    ],
    modules: [
      {
        id: 'mod-5-1',
        title: 'Module 1: Lateral Thinking & Brainstorming',
        lessons: [
          {
            id: 'les-5-1',
            title: '1. Overcoming Cognitive Fixation',
            duration: '22m 30s',
            durationSeconds: 1350,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Why standard education conditions linear thinking and how to unlock boundless creative intuition.',
            keyPoints: ['First principles reduction', 'Cross-pollinating diverse domain insights', 'Embracing productive failure'],
            order: 1
          }
        ]
      }
    ],
    resources: [
      {
        id: 'res-5-1',
        title: 'Design Thinking Toolkit & Ideation Canvas',
        type: 'pdf',
        fileName: 'Innovation_Canvas.pdf',
        fileSize: '4.2 MB',
        category: 'Innovation Handbook'
      }
    ],
    assignments: [
      {
        id: 'asg-5-1',
        title: 'Dismantle an Inefficient Industrial Workflow',
        dueDate: 'Due in 6 Days',
        points: 100,
        description: 'Pick an outdated process in your domain and propose an unconventional innovation using First Principles thinking.',
        guidelines: ['Break problem down to fundamental truths', 'Construct new solution from bottom up']
      }
    ],
    quiz: {
      id: 'quiz-5',
      title: 'Innovation & Creative Thinking Assessment',
      durationMinutes: 15,
      passingScorePercentage: 70,
      questions: [
        {
          id: 'q5-1',
          question: 'What is First Principles thinking?',
          options: [
            'Copying what competitors are doing',
            'Boiling a problem down to its most fundamental truths and reasoning up from there',
            'Accepting initial assumptions without scrutiny',
            'Following bureaucratic checklists blindly'
          ],
          correctAnswer: 1,
          explanation: 'First Principles thinking questions all assumptions to discover novel, uncontaminated solutions from foundational truths.'
        }
      ]
    }
  },
  {
    id: 'course-6',
    title: 'Financial Literacy & Wealth Mindset',
    slug: 'financial-literacy',
    category: 'Professional Skills',
    shortDescription: 'Master personal budgeting, investments, corporate financials, risk hedging, and wealth creation principles.',
    fullDescription: 'Develop total financial confidence. Learn how money moves in global markets, master budgeting discipline, understand cash flow dynamics, and build long-term economic sovereignty.',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '10h 00m',
    lessonsCount: 16,
    isFree: false,
    monthUnlock: 2,
    level: 'Beginner',
    rating: 4.9,
    reviewsCount: 920,
    instructor: {
      name: 'CA Rajeshwari Rao',
      title: 'Financial Strategist & Wealth Advisor',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      experience: '16+ Years Corporate Finance'
    },
    learningOutcomes: [
      'Understand balance sheets, P&L statements, and cash flows',
      'Build personal financial freedom through disciplined compounding',
      'Manage risk, inflation, and investment allocations strategically'
    ],
    modules: [
      {
        id: 'mod-6-1',
        title: 'Module 1: Principles of Capital Allocation',
        lessons: [
          {
            id: 'les-6-1',
            title: '1. The Psychology of Money & Compounding',
            duration: '21m 00s',
            durationSeconds: 1260,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Why behaviour and emotional discipline dictate wealth generation far more than mathematical genius.',
            keyPoints: ['The miracle of compound interest', 'Controlling lifestyle inflation', 'Assets vs Liabilities in the 21st Century'],
            order: 1
          }
        ]
      }
    ],
    resources: [
      {
        id: 'res-6-1',
        title: 'Personal Finance & Investment Master Spreadsheet',
        type: 'worksheet',
        fileName: 'Wealth_Planner.xlsx',
        fileSize: '2.1 MB',
        category: 'Finance Template'
      }
    ],
    assignments: [
      {
        id: 'asg-6-1',
        title: 'Create a 5-Year Financial Independence Model',
        dueDate: 'Due in 7 Days',
        points: 100,
        description: 'Formulate a comprehensive roadmap with income targets, emergency reserves, SIP allocations, and tax optimization tactics.',
        guidelines: ['Define 6-month emergency buffer', 'Calculate target retirement corpus with inflation factor']
      }
    ],
    quiz: {
      id: 'quiz-6',
      title: 'Financial Literacy & Capital Test',
      durationMinutes: 15,
      passingScorePercentage: 70,
      questions: [
        {
          id: 'q6-1',
          question: 'What is the primary factor that drives the exponential curve of compound interest over time?',
          options: [
            'Frequent day-trading',
            'Time duration and consistent reinvestment of gains without premature withdrawal',
            'Holding all money in physical cash underneath a mattress',
            'Taking high-risk uncalculated gambles'
          ],
          correctAnswer: 1,
          explanation: 'Time horizon coupled with consistent reinvestment of returns fuels the exponential power of compounding.'
        }
      ]
    }
  },
  // Courses 7-22 matching the full list of 22 essential capabilities
  {
    id: 'course-7',
    title: 'Physical & Mental Health for Peak Performance',
    slug: 'physical-mental-health',
    category: 'Personal Growth',
    shortDescription: 'Master sleep architecture, nutrition, stress resilience, and somatic vigor for high-pressure corporate environments.',
    fullDescription: 'Sustained industrial achievement requires robust physiological and mental foundations. Learn evidence-based protocols to optimize cognitive endurance, regulate cortisol, and maintain vitality throughout a demanding career.',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '8h 50m',
    lessonsCount: 15,
    isFree: false,
    monthUnlock: 3,
    level: 'Beginner',
    rating: 4.8,
    reviewsCount: 540,
    instructor: {
      name: 'Dr. Suresh Nair',
      title: 'Holistic Health & Sports Medicine Specialist',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      experience: '20+ Years Health & Wellness'
    },
    learningOutcomes: [
      'Master circadian rhythms and sleep recovery',
      'Adopt nutritional guidelines for sustained mental focus',
      'Incorporate desk ergonomics and breathwork techniques'
    ],
    modules: [
      {
        id: 'mod-7-1',
        title: 'Module 1: Mind-Body Optimization',
        lessons: [
          {
            id: 'les-7-1',
            title: '1. The Biology of Corporate Burnout',
            duration: '19m 20s',
            durationSeconds: 1160,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            description: 'Identify early physical warning signs of exhaustion and reset your autonomic nervous system.',
            keyPoints: ['Cortisol curves', 'Micro-breaks for mental clarity', 'Heart Rate Variability fundamentals'],
            order: 1
          }
        ]
      }
    ],
    resources: [{ id: 'res-7-1', title: 'Health Optimization Protocol Guide', type: 'pdf', fileName: 'Health_Guide.pdf', fileSize: '3.6 MB', category: 'Health' }],
    assignments: [{ id: 'asg-7-1', title: 'Design Your Energy Management Protocol', dueDate: 'Due in 5 Days', points: 100, description: 'Audit your daily energy peaks and troughs. Build a tailored routine of nutrition, movement, and sleep hygiene.', guidelines: ['Track morning sunlight exposure', 'Plan screen curfew schedule'] }],
    quiz: { id: 'quiz-7', title: 'Wellness & Stamina Evaluation', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q7-1', question: 'Which physiological marker best reflects overall autonomic nervous system recovery?', options: ['Resting heart rate & Heart Rate Variability (HRV)', 'Number of emails sent', 'Caloric deficit', 'Desk chair height'], correctAnswer: 0, explanation: 'HRV and resting heart rate accurately measure how balanced your parasympathetic and sympathetic systems are.' }] }
  },
  {
    id: 'course-8',
    title: 'Curiosity & Continuous Learning Agility',
    slug: 'curiosity-learning-agility',
    category: 'Future Skills',
    shortDescription: 'Cultivate rapid skill acquisition protocols, unlearn obsolete ideas, and remain irreplaceable in AI era.',
    fullDescription: 'Learning Agility carries a 13% weightage in employer expectations. Master meta-learning, Feynman technique, rapid synthesis of academic and industrial literature, and maintain an insatiable intellectual hunger.',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '7h 45m',
    lessonsCount: 12,
    isFree: false,
    monthUnlock: 3,
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 480,
    instructor: {
      name: 'Dr. Rahul Verma',
      title: 'Senior Executive Trainer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      experience: '20+ Years Corporate Communication'
    },
    learningOutcomes: ['Accelerate skill acquisition by 3x using meta-learning', 'Synthesize unfamiliar domain knowledge in days', 'Overcome cognitive rigidity and unlearn bad habits'],
    modules: [{ id: 'mod-8-1', title: 'Module 1: The Meta-Learning Framework', lessons: [{ id: 'les-8-1', title: '1. How the Brain Acquires Complex Skills', duration: '18m 10s', durationSeconds: 1090, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Deconstructing expertise into micro-competencies for rapid compounding.', keyPoints: ['Feynman Technique', 'Spaced repetition', 'Deliberate practice with feedback loops'], order: 1 }] }],
    resources: [{ id: 'res-8-1', title: 'Meta-Learning Roadmap & Synthesis Guide', type: 'pdf', fileName: 'Learning_Agility.pdf', fileSize: '2.9 MB', category: 'Learning Guide' }],
    assignments: [{ id: 'asg-8-1', title: 'Learn and Teach a Complex Domain in 48 Hours', dueDate: 'Due in 4 Days', points: 100, description: 'Pick a completely unfamiliar subject, learn its fundamentals, and write a simple 300-word explanation that a 10-year-old can comprehend.', guidelines: ['No jargon allowed', 'Use relatable real-world analogies'] }],
    quiz: { id: 'quiz-8', title: 'Learning Agility Examination', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q8-1', question: 'What is the core mechanic of the Feynman Technique?', options: ['Memorizing complex terms without understanding', 'Explaining concepts in plain language as if teaching a beginner to reveal knowledge gaps', 'Copying textbook diagrams', 'Reading silently without testing recall'], correctAnswer: 1, explanation: 'The Feynman technique forces you to clarify concepts in straightforward, intuitive language.' }] }
  },
  {
    id: 'course-9',
    title: 'Positive Attitude & Mental Resilience',
    slug: 'positive-attitude',
    category: 'Personal Growth',
    shortDescription: 'Transform obstacles into catalysts, eradicate victim mentality, and build an unshakable growth mindset.',
    fullDescription: 'A positive attitude is an active choice in the face of industrial adversity. Discover cognitive reframing techniques, learned optimism, and stoic principles to stay composed during organizational turbulence.',
    thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '8h 15m',
    lessonsCount: 14,
    isFree: false,
    monthUnlock: 4,
    level: 'Beginner',
    rating: 4.9,
    reviewsCount: 620,
    instructor: {
      name: 'G. Satyanarayana',
      title: 'Founder Director, IHCDR',
      avatar: '/assets/images/founder-photo.png',
      experience: '35+ Years Senior Industrial Leadership'
    },
    learningOutcomes: ['Reframe acute failure into long-term strategic advantage', 'Cultivate relentless solution-oriented focus', 'Inspire positive optimism within demoralized teams'],
    modules: [{ id: 'mod-9-1', title: 'Module 1: Cognitive Reframing', lessons: [{ id: 'les-9-1', title: '1. The Architecture of Optimism', duration: '20m 45s', durationSeconds: 1245, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Why high performers interpret setbacks as temporary, specific, and actionable rather than personal and permanent.', keyPoints: ['Learned optimism vs Blind positivity', 'The Dichotomy of Control', 'Turning friction into momentum'], order: 1 }] }],
    resources: [{ id: 'res-9-1', title: 'Resilience & Mental Toughness Guide', type: 'pdf', fileName: 'Mental_Resilience.pdf', fileSize: '3.1 MB', category: 'Mindset' }],
    assignments: [{ id: 'asg-9-1', title: 'Reframe a Major Career Setback', dueDate: 'Due in 5 Days', points: 100, description: 'Document a painful past failure. Identify the hidden advantages, skills acquired, and character traits developed as a direct result.', guidelines: ['List 3 permanent lessons gained', 'Explain how it shaped your present capability'] }],
    quiz: { id: 'quiz-9', title: 'Mindset & Resilience Test', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q9-1', question: 'How does a growth mindset differ from a fixed mindset when encountering criticism?', options: ['Growth mindset views criticism as instructive feedback to improve capability', 'Growth mindset gets offended and defensive', 'Fixed mindset takes immediate corrective action', 'Both react identically'], correctAnswer: 0, explanation: 'Growth mindset welcomes criticism as invaluable diagnostics to refine skills.' }] }
  },
  {
    id: 'course-10',
    title: 'Data, Information, Knowledge & Wisdom (DIKW)',
    slug: 'data-knowledge-wisdom',
    category: 'Future Skills',
    shortDescription: 'Navigate the DIKW hierarchy to turn raw operational data into strategic insight and enlightened wisdom.',
    fullDescription: 'In an era of information overload, the real competitive edge lies in extracting actionable wisdom. Master data synthesis, critical thinking filters, signal-to-noise ratio optimization, and sound philosophical discernment.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '9h 30m',
    lessonsCount: 16,
    isFree: false,
    monthUnlock: 4,
    level: 'Advanced',
    rating: 4.9,
    reviewsCount: 410,
    instructor: {
      name: 'Dr. Rahul Verma',
      title: 'Senior Executive Trainer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      experience: '20+ Years Corporate Communication'
    },
    learningOutcomes: ['Filter signal from high-velocity industrial noise', 'Synthesize cross-departmental data into executive wisdom', 'Make ethically sound, long-term strategic projections'],
    modules: [{ id: 'mod-10-1', title: 'Module 1: The DIKW Pyramid in Industry', lessons: [{ id: 'les-10-1', title: '1. From Raw Data to Executive Wisdom', duration: '24m 00s', durationSeconds: 1440, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Deconstruct how unprocessed telemetry transforms into actionable operational wisdom.', keyPoints: ['Definitions across the DIKW hierarchy', 'Avoiding analysis paralysis', 'Applying timeless wisdom to rapid tech disruptions'], order: 1 }] }],
    resources: [{ id: 'res-10-1', title: 'DIKW Strategic Synthesis Framework', type: 'pdf', fileName: 'DIKW_Framework.pdf', fileSize: '4.5 MB', category: 'Analytics' }],
    assignments: [{ id: 'asg-10-1', title: 'Synthesize a Raw Industry Dataset into Executive Wisdom', dueDate: 'Due in 6 Days', points: 100, description: 'Take a sample 100-row business metric sheet and distill it into a 1-page C-Suite Brief with clear strategic implications.', guidelines: ['Highlight underlying root causes', 'Recommend 2 high-impact interventions'] }],
    quiz: { id: 'quiz-10', title: 'DIKW Pyramid Assessment', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q10-1', question: 'What characterizes the "Wisdom" layer in the DIKW hierarchy?', options: ['Storing millions of unindexed records', 'The ability to apply values, ethics, and future context to make sound human judgments', 'Writing complex SQL queries', 'Memorizing encyclopedia pages'], correctAnswer: 1, explanation: 'Wisdom incorporates ethical discernment and long-term consequences into decision-making.' }] }
  },
  {
    id: 'course-11',
    title: 'Logical Reasoning & Problem Solving',
    slug: 'logical-reasoning-problem-solving',
    category: 'Future Skills',
    shortDescription: 'Master deductive, inductive, and abductive reasoning, root-cause diagnostics, and structured problem solving.',
    fullDescription: 'Numerical and logical ability holds a critical 10% weightage in employer assessments. Learn 5-Whys root cause analysis, Ishikawa diagrams, decision trees, and probabilistic thinking.',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '10h 40m',
    lessonsCount: 18,
    isFree: false,
    monthUnlock: 5,
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 780,
    instructor: {
      name: 'Vikramaditya Shah',
      title: 'Innovation Architect & Patent Holder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      experience: '22+ Years R&D and Industrial Innovation'
    },
    learningOutcomes: ['Identify cognitive fallacies and flawed reasoning in meetings', 'Conduct rigorous 5-Why root cause investigations', 'Construct robust quantitative decision matrices'],
    modules: [{ id: 'mod-11-1', title: 'Module 1: Structured Problem Solving', lessons: [{ id: 'les-11-1', title: '1. The 5-Whys and Fishbone Methodologies', duration: '22m 15s', durationSeconds: 1335, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'How industrial leaders isolate systemic causes rather than treating superficial symptoms.', keyPoints: ['Symptom vs Root Cause', 'Constructing Ishikawa Diagrams', 'Validating hypothesis with statistical rigor'], order: 1 }] }],
    resources: [{ id: 'res-11-1', title: 'Root Cause Analysis & Logic Workbook', type: 'pdf', fileName: 'Logic_Workbook.pdf', fileSize: '3.8 MB', category: 'Problem Solving' }],
    assignments: [{ id: 'asg-11-1', title: 'Conduct an Ishikawa Fishbone Analysis', dueDate: 'Due in 5 Days', points: 100, description: 'Analyze a simulated manufacturing breakdown and trace it to 4 major contributory root causes.', guidelines: ['Include People, Process, Equipment, and Material branches', 'Propose permanent preventive controls'] }],
    quiz: { id: 'quiz-11', title: 'Logical Reasoning Certification Test', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q11-1', question: 'What is the primary objective of asking the "5 Whys"?', options: ['To interrogate and intimidate employees', 'To drill down past superficial symptoms to uncover the root cause of a failure', 'To extend meeting duration', 'To assign financial blame'], correctAnswer: 1, explanation: 'The 5-Whys technique methodically uncovers the fundamental organizational or process breakdown.' }] }
  },
  {
    id: 'course-12',
    title: 'Virtue of Living in Present & Mindfulness',
    slug: 'virtue-of-living-in-present',
    category: 'Personal Growth',
    shortDescription: 'Harness situational awareness, mindful focus, stress detachment, and flow in demanding careers.',
    fullDescription: 'Anxiety lives in the future, regret lives in the past. Discover how grounded presence and mindful attention enhance tactical decision making, listening fidelity, and deep workplace contentment.',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '7h 30m',
    lessonsCount: 12,
    isFree: false,
    monthUnlock: 5,
    level: 'Beginner',
    rating: 4.8,
    reviewsCount: 390,
    instructor: {
      name: 'Dr. Suresh Nair',
      title: 'Holistic Health & Wellness',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      experience: '20+ Years Health & Wellness'
    },
    learningOutcomes: ['Anchor attention in high-stress negotiations', 'Dissolve catastrophic ruminations and chronic anxiety', 'Enter deep psychological flow on demand'],
    modules: [{ id: 'mod-12-1', title: 'Module 1: Mindful Presence', lessons: [{ id: 'les-12-1', title: '1. Grounding in the Now', duration: '18m 00s', durationSeconds: 1080, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Techniques for real-time focus calibration in chaotic corporate settings.', keyPoints: ['Sensory grounding protocols', 'Non-judgmental observation', 'Preserving attentional bandwidth'], order: 1 }] }],
    resources: [{ id: 'res-12-1', title: 'Mindfulness & Presence Handbook', type: 'pdf', fileName: 'Mindfulness_Guide.pdf', fileSize: '2.5 MB', category: 'Mindfulness' }],
    assignments: [{ id: 'asg-12-1', title: '3-Day Digital Detachment & Presence Log', dueDate: 'Due in 4 Days', points: 100, description: 'Practice 30 minutes of screen-free mindful observation daily and record shifts in attention span and mental clarity.', guidelines: ['Log heart rate and anxiety levels', 'Note improvements in conversational presence'] }],
    quiz: { id: 'quiz-12', title: 'Mindfulness & Grounded Focus Exam', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q12-1', question: 'How does present-moment awareness improve managerial effectiveness?', options: ['It allows the manager to catch subtle non-verbal cues and assess situations without bias', 'It makes meetings take twice as long', 'It ignores long term planning', 'It has no measurable benefit'], correctAnswer: 0, explanation: 'Being fully present sharpens observational acuity and prevents reactive emotional judgments.' }] }
  },
  {
    id: 'course-13',
    title: 'Generosity, Selflessness & Servant Leadership',
    slug: 'generosity-selflessness',
    category: 'Leadership',
    shortDescription: 'Lead by uplifting others, building high-loyalty teams, and cultivating philanthropic industrial citizenship.',
    fullDescription: 'True leadership is measured not by how many serve you, but by how many you empower. Explore the economics of generosity, mentoring the next generation, and creating lasting corporate legacies.',
    thumbnail: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '8h 00m',
    lessonsCount: 14,
    isFree: false,
    monthUnlock: 6,
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 350,
    instructor: {
      name: 'G. Satyanarayana',
      title: 'Founder Director, IHCDR',
      avatar: '/assets/images/founder-photo.png',
      experience: '35+ Years Senior Industrial Leadership'
    },
    learningOutcomes: ['Inspire fierce loyalty through selfless mentorship', 'Build inclusive cultures where every team member thrives', 'Structure corporate social responsibility initiatives with measurable impact'],
    modules: [{ id: 'mod-13-1', title: 'Module 1: Principles of Servant Leadership', lessons: [{ id: 'les-13-1', title: '1. The Multiplier Effect of Mentorship', duration: '21m 30s', durationSeconds: 1290, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'How selfless investment in young subordinates creates an unbreakable foundation for organizational success.', keyPoints: ['The Giver vs Taker paradigm', 'Creating upward mobility for junior engineers', 'The karmic law of professional goodwill'], order: 1 }] }],
    resources: [{ id: 'res-13-1', title: 'Servant Leadership & Mentorship Playbook', type: 'pdf', fileName: 'Servant_Leadership.pdf', fileSize: '3.2 MB', category: 'Leadership' }],
    assignments: [{ id: 'asg-13-1', title: 'Develop a Mentorship Blueprint for a Junior Peer', dueDate: 'Due in 6 Days', points: 100, description: 'Structure a 90-day onboarding and capability-building roadmap for a fresh graduate entering your domain.', guidelines: ['Include 3 specific technical milestones', 'Include weekly check-in agendas'] }],
    quiz: { id: 'quiz-13', title: 'Servant Leadership Certification', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q13-1', question: 'What is the primary benchmark of a servant leader?', options: ['Personal accumulation of accolades', 'The growth, autonomy, and capability development of their team members', 'Strict authoritarian compliance', 'Micromanaging every minute'], correctAnswer: 1, explanation: 'Servant leaders measure their success by the empowerment and growth of those they serve.' }] }
  },
  {
    id: 'course-14',
    title: 'Perfection, Excellence & Kaizen Mastery',
    slug: 'perfection-excellence',
    category: 'Professional Skills',
    shortDescription: 'Bridge the gap between good and world-class through relentless Kaizen continuous improvement.',
    fullDescription: 'Excellence is not an isolated act, but a deeply ingrained habit. Learn Total Quality Management (TQM), Six Sigma philosophies, error-proofing (Poka-Yoke), and how to set world-class standards.',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '9h 10m',
    lessonsCount: 15,
    isFree: false,
    monthUnlock: 6,
    level: 'Advanced',
    rating: 4.9,
    reviewsCount: 510,
    instructor: {
      name: 'Vikramaditya Shah',
      title: 'Innovation Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      experience: '22+ Years R&D and Industrial Innovation'
    },
    learningOutcomes: ['Implement 5S and Kaizen cycles in daily workflows', 'Establish zero-defect quality benchmarks', 'Eliminate wasteful industrial friction (Muda)'],
    modules: [{ id: 'mod-14-1', title: 'Module 1: The Kaizen Mindset', lessons: [{ id: 'les-14-1', title: '1. 1% Marginal Gains in Industrial Systems', duration: '23m 15s', durationSeconds: 1395, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'How small daily optimizations compound into unassailable industry market dominance.', keyPoints: ['The aggregation of marginal gains', 'Identifying Muda, Muri, and Mura', 'Building an organizational culture of craft'], order: 1 }] }],
    resources: [{ id: 'res-14-1', title: 'Kaizen & Quality Excellence Manual', type: 'pdf', fileName: 'Kaizen_Manual.pdf', fileSize: '4.1 MB', category: 'Quality' }],
    assignments: [{ id: 'asg-14-1', title: 'Execute a 5S Audit on Your Workspace or Project', dueDate: 'Due in 5 Days', points: 100, description: 'Apply Sort, Set in order, Shine, Standardize, and Sustain to an operational project. Document before/after efficiency gains.', guidelines: ['Include photographic evidence or workflow diagrams', 'Quantify time saved per iteration'] }],
    quiz: { id: 'quiz-14', title: 'Excellence & Continuous Improvement Test', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q14-1', question: 'What does the Japanese principle of "Kaizen" literally translate to?', options: ['Quick profit', 'Continuous improvement for the better', 'Rigid hierarchy', 'Cost reduction only'], correctAnswer: 1, explanation: 'Kaizen represents an ongoing, lifelong pursuit of incremental and holistic improvement.' }] }
  },
  {
    id: 'course-15',
    title: 'Change Management & Adaptive Agility',
    slug: 'change-management',
    category: 'Leadership',
    shortDescription: 'Lead organizations through disruptive digital and economic transformations without loss of momentum.',
    fullDescription: 'Adaptability constitutes 6% of core workplace readiness. Master Kotter’s 8-step change model, overcome organizational inertia, guide psychological transitions, and turn change into competitive edge.',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '8h 40m',
    lessonsCount: 15,
    isFree: false,
    monthUnlock: 7,
    level: 'Intermediate',
    rating: 4.8,
    reviewsCount: 430,
    instructor: {
      name: 'Dr. Ananya Roy',
      title: 'Organizational Psychologist',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
      experience: '18+ Years Organizational Psychology'
    },
    learningOutcomes: ['Overcome employee resistance to new technologies', 'Deploy Kotter’s 8-Step change framework', 'Maintain high team morale during corporate reorganizations'],
    modules: [{ id: 'mod-15-1', title: 'Module 1: Navigating Corporate Disruption', lessons: [{ id: 'les-15-1', title: '1. The Psychology of Resistance to Change', duration: '20m 30s', durationSeconds: 1230, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Why human beings fear uncertainty and how compassionate leaders build bridgeheads of clarity.', keyPoints: ['The Change Curve: Shock, Denial, Exploration, Commitment', 'Communicating urgency with empathy', 'Celebrating quick early wins'], order: 1 }] }],
    resources: [{ id: 'res-15-1', title: 'Change Management Playbook & Toolkit', type: 'pdf', fileName: 'Change_Management.pdf', fileSize: '3.7 MB', category: 'Management' }],
    assignments: [{ id: 'asg-15-1', title: 'Draft a Change Communication Plan for an AI Rollout', dueDate: 'Due in 6 Days', points: 100, description: 'Write an executive memo and town-hall speech reassuring employees during an automated tooling transition.', guidelines: ['Address job security concerns honestly', 'Outline upskilling pathways provided by the company'] }],
    quiz: { id: 'quiz-15', title: 'Change Management Assessment', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q15-1', question: 'What is the first step in John Kotter’s 8-Step Change Model?', options: ['Firing resistant staff', 'Creating a sense of urgency', 'Rewriting the company handbook', 'Declaring victory immediately'], correctAnswer: 1, explanation: 'Establishing genuine, data-backed urgency is foundational to awakening collective motivation for change.' }] }
  },
  {
    id: 'course-16',
    title: 'There is a Price for Everything: Accountability & Trade-offs',
    slug: 'price-for-everything-accountability',
    category: 'Personal Growth',
    shortDescription: 'Embrace the cost of mastery, make disciplined trade-offs, and master the law of cause and consequence.',
    fullDescription: 'Nothing meaningful comes without sacrifice. Understand opportunity cost, the price of excellence, delayed gratification, and the moral weight of professional consequences.',
    thumbnail: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '7h 20m',
    lessonsCount: 12,
    isFree: false,
    monthUnlock: 7,
    level: 'Beginner',
    rating: 4.9,
    reviewsCount: 390,
    instructor: {
      name: 'G. Satyanarayana',
      title: 'Founder Director, IHCDR',
      avatar: '/assets/images/founder-photo.png',
      experience: '35+ Years Senior Industrial Leadership'
    },
    learningOutcomes: ['Calculate true opportunity costs in career milestones', 'Practice disciplined delayed gratification', 'Accept radical accountability for personal outcomes'],
    modules: [{ id: 'mod-16-1', title: 'Module 1: The Economics of Sacrifice', lessons: [{ id: 'les-16-1', title: '1. Opportunity Cost and Career Trajectories', duration: '19m 50s', durationSeconds: 1190, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Every "yes" to distraction is an implicit "no" to your grandest career aspirations.', keyPoints: ['The Hidden Price of Inaction', 'Saying strategic "No" to good opportunities for great ones', 'The Compound Cost of Procrastination'], order: 1 }] }],
    resources: [{ id: 'res-16-1', title: 'Accountability & Opportunity Cost Ledger', type: 'worksheet', fileName: 'Accountability_Ledger.pdf', fileSize: '1.9 MB', category: 'Worksheet' }],
    assignments: [{ id: 'asg-16-1', title: 'Audit Your Career Trade-offs Matrix', dueDate: 'Due in 4 Days', points: 100, description: 'Identify 3 comfort habits you must willingly trade away to achieve your primary 3-year professional milestone.', guidelines: ['Specify time reclaimed each week', 'Identify replacement high-leverage activities'] }],
    quiz: { id: 'quiz-16', title: 'Accountability & Trade-offs Test', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q16-1', question: 'What is "opportunity cost" in decision making?', options: ['The price tag on an invoice', 'The value of the next best alternative that is forgone when a choice is made', 'The cost of opening a bank account', 'A discount voucher'], correctAnswer: 1, explanation: 'Opportunity cost represents the lost benefits from alternative paths you chose not to pursue.' }] }
  },
  {
    id: 'course-17',
    title: 'Interpersonal Dynamics & Conflict Resolution',
    slug: 'interpersonal-skills',
    category: 'Professional Skills',
    shortDescription: 'Navigate difficult stakeholders, de-escalate toxic conflicts, and forge unbreakable professional alliances.',
    fullDescription: 'Interpersonal skills and cultural fitment constitute 14% of hiring evaluations. Learn non-violent communication, interest-based negotiation (Harvard model), and diplomatic mediation.',
    thumbnail: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '9h 50m',
    lessonsCount: 16,
    isFree: false,
    monthUnlock: 8,
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 580,
    instructor: {
      name: 'Dr. Rahul Verma',
      title: 'Senior Executive Trainer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      experience: '20+ Years Corporate Communication'
    },
    learningOutcomes: ['Resolve interpersonal friction using interest-based negotiation', 'Foster cross-functional collaboration across silos', 'Deliver sensitive corrective feedback without provoking defensiveness'],
    modules: [{ id: 'mod-17-1', title: 'Module 1: Conflict De-escalation', lessons: [{ id: 'les-17-1', title: '1. Separate the People from the Problem', duration: '22m 40s', durationSeconds: 1360, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Deconstruct hostile interactions and focus on shared underlying objectives.', keyPoints: ['Thomas-Kilmann Conflict Mode Instrument', 'Focusing on interests, not rigid positions', 'Inventing options for mutual gain'], order: 1 }] }],
    resources: [{ id: 'res-17-1', title: 'Negotiation & Conflict Resolution Scripts', type: 'pdf', fileName: 'Conflict_Resolution.pdf', fileSize: '3.5 MB', category: 'Interpersonal' }],
    assignments: [{ id: 'asg-17-1', title: 'Simulated Stakeholder Conflict Mediation', dueDate: 'Due in 5 Days', points: 100, description: 'Analyze a dispute between an aggressive product manager and an overworked lead engineer. Write a mediation script producing a win-win outcome.', guidelines: ['Identify hidden underlying fears of both parties', 'Propose an objective testing criterion'] }],
    quiz: { id: 'quiz-17', title: 'Interpersonal Mastery Evaluation', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q17-1', question: 'In the Harvard Negotiation model, what does BATNA stand for?', options: ['Best Alternative To a Negotiated Agreement', 'Basic Action Tactics for Neutral Agents', 'Business Alignment Through Network Access', 'Behavioral Assessment for Target Needs'], correctAnswer: 0, explanation: 'BATNA provides your strongest leverage point by clarifying your fallback if negotiations fail.' }] }
  },
  {
    id: 'course-18',
    title: 'Integrity, Values & Ethical Governance',
    slug: 'integrity-values',
    category: 'Leadership',
    shortDescription: 'Build unassailable ethical reputation, lead corporate governance, and uphold timeless moral integrity.',
    fullDescription: 'Integrity & Values is awarded a towering 15% weight in employer preference. Learn how ethical consistency builds profound trust, protects corporate longevity, and defines true human dignity.',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '8h 30m',
    lessonsCount: 14,
    isFree: false,
    monthUnlock: 8,
    level: 'Beginner',
    rating: 5.0,
    reviewsCount: 680,
    instructor: {
      name: 'G. Satyanarayana',
      title: 'Founder Director, IHCDR',
      avatar: '/assets/images/founder-photo.png',
      experience: '35+ Years Senior Industrial Leadership'
    },
    learningOutcomes: ['Navigate grey ethical dilemmas in high-stakes commerce', 'Establish transparent accounting and moral safeguards', 'Command authentic moral authority as an industry leader'],
    modules: [{ id: 'mod-18-1', title: 'Module 1: The Foundations of Uncompromising Integrity', lessons: [{ id: 'les-18-1', title: '1. Why Reputations Take 20 Years to Build and 5 Minutes to Ruin', duration: '25m 00s', durationSeconds: 1500, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Examining real-world industrial corporate collapses resulting from micro ethical compromises.', keyPoints: ['The slippery slope of rationalized dishonesty', 'Standing firm when short-term profits tempt compromise', 'The compound premium on verified trust'], order: 1 }] }],
    resources: [{ id: 'res-18-1', title: 'Ethical Governance & Values Codebook', type: 'pdf', fileName: 'Ethics_Codebook.pdf', fileSize: '4.0 MB', category: 'Governance' }],
    assignments: [{ id: 'asg-18-1', title: 'Analyze an Industrial Whistleblower Dilemma', dueDate: 'Due in 6 Days', points: 100, description: 'Evaluate a scenario where discovering a safety compliance flaw threatens a major company contract. Outline a principled escalation pathway.', guidelines: ['Prioritize public safety and legal compliance', 'Propose an ethical remediation timeline for management'] }],
    quiz: { id: 'quiz-18', title: 'Ethics & Values Certification Exam', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q18-1', question: 'What is the true test of moral integrity?', options: ['Doing what is right only when senior executives are watching', 'Doing what is right even when nobody is watching and it costs you personally', 'Following the easiest path to short-term revenue', 'Blaming others for systemic oversights'], correctAnswer: 1, explanation: 'Integrity is defined by adhering to righteous principles regardless of surveillance or personal cost.' }] }
  },
  {
    id: 'course-19',
    title: 'Public Speaking, Persuasion & Storytelling',
    slug: 'public-speaking-persuasion',
    category: 'Professional Skills',
    shortDescription: 'Command stages, master Aristotle’s Rhetoric, deliver captivating keynotes, and persuade massive audiences.',
    fullDescription: 'Become an unforgettable communicator. Learn vocal projection, stage presence, narrative arc design, and how to rally teams and investors behind audacious initiatives.',
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '10h 15m',
    lessonsCount: 18,
    isFree: false,
    monthUnlock: 9,
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 710,
    instructor: {
      name: 'Dr. Rahul Verma',
      title: 'Senior Executive Trainer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      experience: '20+ Years Corporate Communication'
    },
    learningOutcomes: ['Conquer stage fright through somatic grounding', 'Structure speeches using Ethos, Pathos, and Logos', 'Use vocal pitch, pauses, and cadence for hypnotic engagement'],
    modules: [{ id: 'mod-19-1', title: 'Module 1: The Art of Keynote Delivery', lessons: [{ id: 'les-19-1', title: '1. Structuring the Unforgettable Narrative Arc', duration: '23m 30s', durationSeconds: 1410, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'How Steve Jobs and world leaders designed speeches that altered market consciousness.', keyPoints: ['The Hero’s Journey in Corporate Keynotes', 'Mastering the dramatic pause', 'Designing slides that amplify rather than distract'], order: 1 }] }],
    resources: [{ id: 'res-19-1', title: 'Keynote Presentation Mastery Guide', type: 'pdf', fileName: 'Public_Speaking.pdf', fileSize: '4.8 MB', category: 'Speaking' }],
    assignments: [{ id: 'asg-19-1', title: 'Submit a 3-Minute Persuasive Video Keynote', dueDate: 'Due in 7 Days', points: 100, description: 'Deliver a persuasive presentation advocating for a major change in industry education standards.', guidelines: ['Demonstrate Ethos, Pathos, and Logos', 'Maintain strong eye contact with the camera'] }],
    quiz: { id: 'quiz-19', title: 'Public Speaking & Rhetoric Test', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q19-1', question: 'Which classical rhetorical appeal appeals primarily to emotions and shared values?', options: ['Ethos', 'Pathos', 'Logos', 'Chronos'], correctAnswer: 1, explanation: 'Pathos establishes emotional connection and empathetic resonance with the audience.' }] }
  },
  {
    id: 'course-20',
    title: 'Entrepreneurship Essentials & Venture Building',
    slug: 'entrepreneurship-essentials',
    category: 'Future Skills',
    shortDescription: 'Build scalable business models, validate product-market fit, secure initial customers, and scale sustainably.',
    fullDescription: 'Bridging academic insight with commercial execution. Master lean startup methodologies, unit economics, customer discovery interviews, pricing strategies, and investor pitch decks.',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '11h 45m',
    lessonsCount: 22,
    isFree: false,
    monthUnlock: 9,
    level: 'Advanced',
    rating: 4.9,
    reviewsCount: 840,
    instructor: {
      name: 'Vikramaditya Shah',
      title: 'Innovation Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      experience: '22+ Years R&D and Industrial Innovation'
    },
    learningOutcomes: ['Formulate Lean Business Model Canvas', 'Calculate Customer Acquisition Cost (CAC) and Lifetime Value (LTV)', 'Execute rapid customer validation interviews before building code'],
    modules: [{ id: 'mod-20-1', title: 'Module 1: The Lean Venture Creation Model', lessons: [{ id: 'les-20-1', title: '1. Finding Hair-on-Fire Problems', duration: '26m 10s', durationSeconds: 1570, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Why 90% of startups fail by building solutions nobody wants, and how to identify true acute market demand.', keyPoints: ['The Mom Test for user interviews', 'Minimum Viable Products vs Polish', 'Unit economics and margin safety'], order: 1 }] }],
    resources: [{ id: 'res-20-1', title: 'Lean Canvas & Pitch Deck Master Template', type: 'worksheet', fileName: 'Venture_Template.pdf', fileSize: '5.2 MB', category: 'Venture' }],
    assignments: [{ id: 'asg-20-1', title: 'Complete a Business Model Canvas for a New Venture', dueDate: 'Due in 7 Days', points: 100, description: 'Fill out the 9 blocks of the Lean Canvas for a novel SaaS or capability development startup.', guidelines: ['Clearly specify Unique Value Proposition', 'Detail revenue streams and cost structure'] }],
    quiz: { id: 'quiz-20', title: 'Venture Building & Entrepreneurship Test', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q20-1', question: 'What is the primary indicator of Product-Market Fit (PMF)?', options: ['Having a fancy website logo', 'Strong organic retention and customers becoming passionate evangelists', 'Spending large sums on paid ads with high churn', 'Writing 100 pages of code'], correctAnswer: 1, explanation: 'True PMF occurs when customers organically pull the product and retain at high cohorts.' }] }
  },
  {
    id: 'course-21',
    title: 'Self Management & Habits Engineering',
    slug: 'self-management',
    category: 'Personal Growth',
    shortDescription: 'Rewire unconscious behavioral loops, build atomic daily disciplines, and conquer self-sabotage.',
    fullDescription: 'You do not rise to the level of your goals; you fall to the level of your systems. Master habit cues, habit stacking, friction manipulation, and psychological identity shift.',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '8h 20m',
    lessonsCount: 14,
    isFree: false,
    monthUnlock: 10,
    level: 'Beginner',
    rating: 4.9,
    reviewsCount: 520,
    instructor: {
      name: 'Dr. Ananya Roy',
      title: 'Organizational Psychologist',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
      experience: '18+ Years Organizational Psychology'
    },
    learningOutcomes: ['Design automated habit triggers that eliminate decision fatigue', 'Dismantle destructive dopamine addiction loops', 'Build identity-based self-discipline that lasts decades'],
    modules: [{ id: 'mod-21-1', title: 'Module 1: The Habit Loop', lessons: [{ id: 'les-21-1', title: '1. Cue, Craving, Response, Reward', duration: '21m 00s', durationSeconds: 1260, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Deconstructing the neurological basis of habitual behaviors.', keyPoints: ['Environment design over willpower', 'The 2-minute rule', 'Tracking systems that provide instant dopamine'], order: 1 }] }],
    resources: [{ id: 'res-21-1', title: 'Habits Engineering Tracker & Workbook', type: 'worksheet', fileName: 'Habits_Tracker.pdf', fileSize: '2.4 MB', category: 'Habits' }],
    assignments: [{ id: 'asg-21-1', title: 'Design a 30-Day Keystone Habit Loop', dueDate: 'Due in 4 Days', points: 100, description: 'Select one keystone habit (e.g. 60-min daily reading or morning physical vigor). Document the exact environment cues and friction removal steps.', guidelines: ['Implement habit stacking with an existing routine', 'Prepare for disruption failure triggers'] }],
    quiz: { id: 'quiz-21', title: 'Self-Management & Habits Exam', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q21-1', question: 'Why does environment design outperform raw willpower for sustained habit formation?', options: ['Willpower is an exhaustible cognitive resource; environment creates automatic friction or ease', 'Willpower is an illusion', 'Environment cannot be changed', 'No difference exists'], correctAnswer: 0, explanation: 'Structuring your environment makes good habits frictionless and bad habits difficult, conserving mental energy.' }] }
  },
  {
    id: 'course-22',
    title: 'Aham Brahmasmi: The Pinnacle of Human Consciousness',
    slug: 'aham-brahmasmi',
    category: 'Leadership',
    shortDescription: 'Realize the infinite depth of human consciousness, universal interconnectedness, and ultimate purpose.',
    fullDescription: 'The culminating mastery module of the Institute of Human Capability Development and Research. Transcend limiting ego boundaries, understand non-dual consciousness (Aham Brahmasmi - I am the Infinite), and align your life’s work with the highest universal good.',
    thumbnail: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    totalDuration: '12h 00m',
    lessonsCount: 20,
    isFree: false,
    monthUnlock: 10,
    level: 'Advanced',
    rating: 5.0,
    reviewsCount: 1100,
    instructor: {
      name: 'G. Satyanarayana',
      title: 'Founder Director, IHCDR',
      avatar: '/assets/images/founder-photo.png',
      experience: '35+ Years Senior Industrial Leadership'
    },
    learningOutcomes: ['Experience the boundless nature of human potential and creative capability', 'Live and lead without fear from an unshakeable inner center of consciousness', 'Unite worldly industrial excellence with profound spiritual self-realization'],
    modules: [{ id: 'mod-22-1', title: 'Module 1: The Infinite Capability Within', lessons: [{ id: 'les-22-1', title: '1. Transcending the Illusions of Limitation', duration: '28m 00s', durationSeconds: 1680, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'The grand synthesis of ancient wisdom and modern scientific understanding of human mind and universal potential.', keyPoints: ['The meaning of Aham Brahmasmi in daily action', 'Living beyond fear and pettiness', 'Serving humanity as an expression of infinite consciousness'], order: 1 }] }],
    resources: [{ id: 'res-22-1', title: 'Aham Brahmasmi Philosophical Treatise & Commentary', type: 'pdf', fileName: 'Aham_Brahmasmi_Treatise.pdf', fileSize: '6.4 MB', category: 'Philosophy' }],
    assignments: [{ id: 'asg-22-1', title: 'The Ultimate Capstone: Life Purpose Manifesto', dueDate: 'Due in 14 Days', points: 100, description: 'Synthesize everything learned across the 22 capabilities into a 1000-word Life Purpose Manifesto guiding your next 20 years of contribution to society.', guidelines: ['Address personal, professional, and universal service dimensions', 'Outline your non-negotiable guiding values'] }],
    quiz: { id: 'quiz-22', title: 'Grand Capstone Consciousness & Capability Exam', durationMinutes: 30, passingScorePercentage: 70, questions: [{ id: 'q22-1', question: 'What is the ultimate realization of "Aham Brahmasmi" when translated into human capability in the world?', options: ['Arrogant superiority over others', 'Recognizing that infinite potential resides within every human being and expressing it through selfless excellence and service', 'Retiring to a cave and doing nothing', 'Ignoring all worldly duties'], correctAnswer: 1, explanation: 'It represents the pinnacle of self-realization: recognizing that divine creative potential resides within, manifested through noble action.' }] }
  },
  {
    id: 'course-23',
    title: 'DISC Profiling',
    slug: 'disc-profiling',
    category: 'Personal Growth',
    shortDescription: 'Understand personality styles, communication preferences and behavioural patterns using DISC profiling.',
    fullDescription: 'Learn the DISC behavioural model, identify your natural style, adapt communication and build stronger workplace relationships.',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    totalDuration: '8h 20m',
    lessonsCount: 14,
    isFree: true,
    monthUnlock: 1,
    level: 'Beginner',
    rating: 4.9,
    reviewsCount: 520,
    instructor: {
      name: 'Dr. Ananya Roy',
      title: 'Organizational Psychologist',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
      experience: '18+ Years Organizational Psychology'
    },
    learningOutcomes: ['Design automated habit triggers that eliminate decision fatigue', 'Dismantle destructive dopamine addiction loops', 'Build identity-based self-discipline that lasts decades'],
    modules: [{ id: 'mod-21-1', title: 'Module 1: The Habit Loop', lessons: [{ id: 'les-21-1', title: '1. Cue, Craving, Response, Reward', duration: '21m 00s', durationSeconds: 1260, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Deconstructing the neurological basis of habitual behaviors.', keyPoints: ['Environment design over willpower', 'The 2-minute rule', 'Tracking systems that provide instant dopamine'], order: 1 }] }],
    resources: [{ id: 'res-21-1', title: 'Habits Engineering Tracker & Workbook', type: 'worksheet', fileName: 'Habits_Tracker.pdf', fileSize: '2.4 MB', category: 'Habits' }],
    assignments: [{ id: 'asg-21-1', title: 'Design a 30-Day Keystone Habit Loop', dueDate: 'Due in 4 Days', points: 100, description: 'Select one keystone habit (e.g. 60-min daily reading or morning physical vigor). Document the exact environment cues and friction removal steps.', guidelines: ['Implement habit stacking with an existing routine', 'Prepare for disruption failure triggers'] }],
    quiz: { id: 'quiz-21', title: 'Self-Management & Habits Exam', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q21-1', question: 'Why does environment design outperform raw willpower for sustained habit formation?', options: ['Willpower is an exhaustible cognitive resource; environment creates automatic friction or ease', 'Willpower is an illusion', 'Environment cannot be changed', 'No difference exists'], correctAnswer: 0, explanation: 'Structuring your environment makes good habits frictionless and bad habits difficult, conserving mental energy.' }] }
  },
  {
    id: 'course-24',
    title: 'Team Building',
    slug: 'team-building',
    category: 'Professional Skills',
    shortDescription: 'Build collaborative, high-performing teams through trust, communication, role clarity and shared goals.',
    fullDescription: 'Develop practical team-building skills to create trust, improve collaboration, handle differences and achieve shared performance goals.',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    totalDuration: '9h 50m',
    lessonsCount: 16,
    isFree: true,
    monthUnlock: 1,
    level: 'Intermediate',
    rating: 4.9,
    reviewsCount: 580,
    instructor: {
      name: 'Dr. Rahul Verma',
      title: 'Senior Executive Trainer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      experience: '20+ Years Corporate Communication'
    },
    learningOutcomes: ['Resolve interpersonal friction using interest-based negotiation', 'Foster cross-functional collaboration across silos', 'Deliver sensitive corrective feedback without provoking defensiveness'],
    modules: [{ id: 'mod-17-1', title: 'Module 1: Conflict De-escalation', lessons: [{ id: 'les-17-1', title: '1. Separate the People from the Problem', duration: '22m 40s', durationSeconds: 1360, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Deconstruct hostile interactions and focus on shared underlying objectives.', keyPoints: ['Thomas-Kilmann Conflict Mode Instrument', 'Focusing on interests, not rigid positions', 'Inventing options for mutual gain'], order: 1 }] }],
    resources: [{ id: 'res-17-1', title: 'Negotiation & Conflict Resolution Scripts', type: 'pdf', fileName: 'Conflict_Resolution.pdf', fileSize: '3.5 MB', category: 'Interpersonal' }],
    assignments: [{ id: 'asg-17-1', title: 'Simulated Stakeholder Conflict Mediation', dueDate: 'Due in 5 Days', points: 100, description: 'Analyze a dispute between an aggressive product manager and an overworked lead engineer. Write a mediation script producing a win-win outcome.', guidelines: ['Identify hidden underlying fears of both parties', 'Propose an objective testing criterion'] }],
    quiz: { id: 'quiz-17', title: 'Interpersonal Mastery Evaluation', durationMinutes: 15, passingScorePercentage: 70, questions: [{ id: 'q17-1', question: 'In the Harvard Negotiation model, what does BATNA stand for?', options: ['Best Alternative To a Negotiated Agreement', 'Basic Action Tactics for Neutral Agents', 'Business Alignment Through Network Access', 'Behavioral Assessment for Target Needs'], correctAnswer: 0, explanation: 'BATNA provides your strongest leverage point by clarifying your fallback if negotiations fail.' }] }
  },
];
