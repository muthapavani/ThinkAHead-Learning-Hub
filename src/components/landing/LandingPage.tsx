import React, { useState } from 'react';
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Users,
  MessageSquare,
  TrendingUp,
  Lightbulb,
  Clock,
  Laptop,
  Compass,
  Briefcase,
  Mic,
  Award,
  Rocket,
  Star,
  Send,
  Sparkles,
  BookOpen,
  Target,
  Heart,
  Eye,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { Logo } from '../common/Logo';
import { COURSES_DATA } from '../../data/coursesData';

export const LandingPage: React.FC = () => {
  const {
    theme,
    setCurrentView,
    setSelectedCourseId,
    setCheckoutModalOpen,
    setActiveCertificate,
    certificates,
    setViewCertificateModal,
    showToast,
    submitContact
  } = useApp();

  // Testimonial carousel state
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  // All capability programs are available on the landing page.

  // Live clock for the "real-time" certificate preview
  const [liveNow, setLiveNow] = useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setLiveNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Smooth scroll-reveal animations for the landing page. Elements animate only
  // when they enter the viewport, then stay visible; reduced-motion users are
  // handled by the CSS media query in index.css.
  React.useEffect(() => {
    const root = document.querySelector('[data-landing-page]');
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const sections = Array.from(root.querySelectorAll('section:not(#hero-section)'));
    const revealTargets: Element[] = [];

    sections.forEach((section) => {
      const firstLevel = Array.from(section.children).filter((el) => el instanceof HTMLElement);
      firstLevel.forEach((el) => {
        el.classList.add('scroll-reveal');
        revealTargets.push(el);

        // Stagger cards in grids without requiring changes to every card's JSX.
        el.querySelectorAll(':scope .grid').forEach((grid) => {
          Array.from(grid.children).forEach((child) => {
            if (child instanceof HTMLElement) {
              child.classList.add('scroll-reveal-item');
              revealTargets.push(child);
            }
          });
        });
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // "Unlock Your ___" cycling gradient headline — rotates through each trait over time
  const potentialWords = [
    'True Potential',
    'Confidence',
    'Leadership',
    'Communication',
    'Creativity',
    'Success',
    'Innovation'
  ];
  const [potentialWordIdx, setPotentialWordIdx] = useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setPotentialWordIdx(i => (i + 1) % potentialWords.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) {
      showToast('Please fill in all fields.');
      return;
    }
    void submitContact(contactName.trim(), contactEmail.trim(), contactMsg.trim()).then(() => {
      setContactName('');
      setContactEmail('');
      setContactMsg('');
    });
  };

  // All capability programs are sourced from the same catalog used by the student dashboard.
  const programIcons = [
    Users, MessageSquare, Heart, TrendingUp, Lightbulb, Clock, Laptop, Compass,
    Briefcase, BookOpen, Target, Sparkles, ShieldCheck, Award, Rocket, CheckCircle2,
    Users, ShieldCheck, Mic, Rocket, Target, Sparkles
  ];
  const capabilityPrograms = COURSES_DATA.map((course, index) => {
    const Icon = programIcons[index % programIcons.length];
    return {
      id: course.id,
      title: course.title,
      desc: course.shortDescription,
      icon: <Icon className="w-5 h-5 text-blue-500" />,
      tag: course.category
    };
  });

  // Testimonials matching Image 1
  const testimonials = [
    {
      name: 'Anjali Sharma',
      role: 'Student',
      text: 'ThinkAHead programs changed the way I think, communicate and lead.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      rating: 5
    },
    {
      name: 'Rohit Mehta',
      role: 'Young Professional',
      text: 'The the content is practical and highly useful.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      rating: 5
    },
    {
      name: 'Pooja Verma',
      role: 'Entrepreneur',
      text: 'Practical, inspiring and life changing. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      rating: 5
    },
    {
      name: 'Karthik Reddy',
      role: 'Working Professional',
      text: 'The best platform to build skills for personal and professional success.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      rating: 5
    }
  ];

  return (
    <div
      data-landing-page
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#060a14] text-slate-100' : 'bg-white text-slate-900'
      }`}
    >
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (MATCHING IMAGE 1) */}
      {/* ========================================================================= */}
      <section
        id="hero-section"
        className="relative overflow-hidden border-b border-slate-900/60 pt-[72px] sm:pt-[80px]"
      >
        {/* Real photo, fixed/parallax background attachment */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('/assets/images/hero-brain-hands.png')"
          }}
          aria-hidden="true"
        />
        {/* Dark image → overlay stays dark in both themes, tinted per theme for identity */}
        <div
          className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-[#050a16]/85 via-[#050a16]/72 to-[#050a16]/90'
              : 'bg-gradient-to-b from-[#0a1428]/80 via-[#0a1428]/68 to-[#0a1428]/88'
          }`}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-12 lg:pb-24">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="text-xs sm:text-sm font-semibold text-cyan-400">
              Welcome to
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              <span className="text-white">ThinkAHead</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent mt-1 pb-1">
                Learning Hub
              </span>
            </h1>

            <p className="text-base sm:text-lg font-bold text-slate-100 leading-snug max-w-2xl">
              Empowering Minds. Building Capabilities. Transforming Futures.
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              A premium learning platform dedicated to Human Capability Development. 20+ Capability Programs designed to help you grow, lead and make a meaningful impact in life and society.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                id="hero-start-journey-btn"
                onClick={() => setCurrentView('auth-register')}
                className="w-full sm:w-auto px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-explore-btn"
                onClick={() => {
                  const el = document.getElementById('programs-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white"
              >
                <PlayCircle className="w-4 h-4 text-cyan-300" />
                <span>Explore Programs</span>
              </button>
            </div>

            {/* Stats Bar directly under Hero */}
            <div className="pt-6 w-full flex justify-center">
              <div className="p-3 sm:p-4 rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md flex flex-wrap items-center justify-center gap-4 max-w-2xl text-slate-100">
                <div className="flex items-center gap-2 text-xs">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="font-black text-sm text-white">20+</span>
                    <span className="text-[11px] text-slate-300 ml-1">Programs</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-black text-sm text-white">5000+</span>
                    <span className="text-[11px] text-slate-300 ml-1">Learners</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="font-black text-sm text-white">100+</span>
                    <span className="text-[11px] text-slate-300 ml-1">Learning Resources</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-black text-sm text-white">10+</span>
                    <span className="text-[11px] text-slate-300 ml-1">Workshops</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-black text-sm text-white">100%</span>
                    <span className="text-[11px] text-slate-300 ml-1">Satisfaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. UNLOCK YOUR TRUE POTENTIAL (MATCHING IMAGE 1) */}
      {/* ========================================================================= */}
      <section
        className={`relative py-20 border-b overflow-hidden ${
          theme === 'dark' ? 'bg-[#080d1a] border-slate-800/80' : 'bg-white border-slate-200'
        }`}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left: Heading as a side panel */}
            <div className="lg:col-span-4 text-center lg:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-500">
                UNLOCK YOUR
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight min-h-[1.2em]">
                <span
                  key={potentialWordIdx}
                  className="inline-block bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent animate-fade-in-up"
                >
                  {potentialWords[potentialWordIdx]}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed max-w-sm mx-auto lg:mx-0">
                Discover your strengths. Build powerful skills. Develop to achieve your dreams and create a meaningful impact.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('programs-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hidden lg:inline-flex mt-6 px-6 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 shadow-md shadow-blue-600/30 transition-all items-center gap-2"
              >
                <span>See How</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: Connected Matrix: 3 Left Pills + 3D Glowing Synaptic Brain + 3 Right Pills */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left 3 Pills */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-3.5 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-purple-900/20 bg-gradient-to-r from-purple-600 to-fuchsia-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/20">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">Confidence</span>
                    </div>
                    <div className="hidden sm:block w-8 border-b-2 border-dashed border-white/40" />
                  </div>

                  <div className="p-3.5 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-indigo-900/20 bg-gradient-to-r from-indigo-600 to-blue-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/20">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">Leadership</span>
                    </div>
                    <div className="hidden sm:block w-8 border-b-2 border-dashed border-white/40" />
                  </div>

                  <div className="p-3.5 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-blue-900/20 bg-gradient-to-r from-blue-600 to-cyan-400">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/20">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold">Communication</span>
                    </div>
                    <div className="hidden sm:block w-8 border-b-2 border-dashed border-white/40" />
                  </div>
                </div>

                {/* Center 3D Wireframe Glowing Synaptic Brain */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-4">
                  <div className="relative w-60 h-60 rounded-full bg-white dark:bg-slate-900/80 flex items-center justify-center p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] border border-cyan-500/30 overflow-hidden">
                    <Logo
                      size="xl"
                      showText={false}
                      theme={theme}
                      className="scale-[2.2] animate-logo-pulse"
                    />
                  </div>
                </div>

                {/* Right 3 Pills */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-3.5 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-emerald-900/20 bg-gradient-to-r from-emerald-500 to-teal-400">
                    <div className="hidden sm:block w-8 border-b-2 border-dashed border-white/40" />
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">Creativity</span>
                      <div className="p-2 rounded-xl bg-white/20">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-amber-900/20 bg-gradient-to-r from-amber-500 to-orange-400">
                    <div className="hidden sm:block w-8 border-b-2 border-dashed border-white/40" />
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">Success</span>
                      <div className="p-2 rounded-xl bg-white/20">
                        <Target className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-rose-900/20 bg-gradient-to-r from-rose-500 to-pink-500">
                    <div className="hidden sm:block w-8 border-b-2 border-dashed border-white/40" />
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">Innovation</span>
                      <div className="p-2 rounded-xl bg-white/20">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABOUT INSTITUTE (MATCHING IMAGE 1) */}
      {/* ========================================================================= */}
      <section
        id="about-section"
        className={`py-20 border-b ${
          theme === 'dark' ? 'bg-[#060a14] border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Campus Photo Collage */}
            <div className="lg:col-span-6">
              <div className="relative">
                <div
                  className={`relative rounded-3xl overflow-hidden shadow-2xl border ${
                    theme === 'dark' ? 'border-slate-700/60' : 'border-white'
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1758270704226-db897b180243?w=900&auto=format&fit=crop&q=80"
                    alt="ThinkAHead Learning Hub learning environment"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                </div>

                {/* Overlapping accent photo */}
                <div
                  className={`hidden sm:block absolute -bottom-8 -right-6 w-40 lg:w-48 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 ${
                    theme === 'dark' ? 'border-[#060a14]' : 'border-slate-50'
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1758270705518-b61b40527e76?w=500&auto=format&fit=crop&q=80"
                    alt="Learner-focused learning environment"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Accreditation chip */}
                <div
                  className={`absolute -top-4 -right-4 px-3 py-2 rounded-2xl border shadow-lg backdrop-blur-md flex items-center gap-2 ${
                    theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/95 border-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-bold">IHCDR Accredited</span>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-500">
                ABOUT INSTITUTE
              </span>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                <span>Building Capabilities.</span><br />
                <span className="text-blue-600 dark:text-blue-400">Transforming Lives.</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                ThinkAHead Learning Hub is the flagship initiative of the Institute of Human Capability Development & Research (IHCDR). We are committed to designing research-driven programs that help people grow in every dimension of life.
              </p>

              <div className="space-y-2.5 pt-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>20+ professionally designed Capability Programs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Structured, practical and result-oriented learning</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Practical, applicable & result-oriented learning</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>For students, professionals, entrepreneurs and leaders</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar below About Institute */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                : 'bg-white border-slate-200 text-slate-800 shadow-sm'
            }`}
          >
            <div>
              <div className="text-xl sm:text-2xl font-black text-blue-500">5000+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Learners</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-cyan-500">20+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Programs</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-indigo-500">100+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Learning Resources</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-500">10+</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Workshops</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-500">100%</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3B. WHY THINKAHEAD — FEATURE HIGHLIGHTS WITH IMAGERY */}
      {/* ========================================================================= */}
      <section
        className={`py-20 border-b ${
          theme === 'dark' ? 'bg-[#080d1a] border-slate-800/80' : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-500">
              WHY THINKAHEAD
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
              Learning Designed for the Future
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
              A holistic approach that blends mindful growth, creativity and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: AI-Powered Learning */}
            <div
              className={`group rounded-3xl overflow-hidden border transition-all hover:-translate-y-1.5 ${
                theme === 'dark'
                  ? 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/50'
                  : 'bg-slate-50 border-slate-200 shadow-sm hover:shadow-xl'
              }`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src="/assets/images/ai-connection.png"
                  alt="AI-powered personalized learning connecting technology and people"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  AI-Powered Personalization
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Smart, adaptive learning paths that connect you with the right programs for your goals.
                </p>
              </div>
            </div>

            {/* Feature 2: Holistic & Sustainable Growth */}
            <div
              className={`group rounded-3xl overflow-hidden border transition-all hover:-translate-y-1.5 ${
                theme === 'dark'
                  ? 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/50'
                  : 'bg-slate-50 border-slate-200 shadow-sm hover:shadow-xl'
              }`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src="/assets/images/eco-globe.png"
                  alt="Holistic and sustainable personal growth"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <img src="/assets/images/ihcdr-logo.png" alt="IHCDR logo" className="w-5 h-5 rounded-full object-contain bg-white" />
                  Holistic, Sustainable Growth
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  We nurture the whole person — mind, purpose and wellbeing — for growth that truly lasts.
                </p>
              </div>
            </div>

            {/* Feature 3: Creative & Critical Thinking */}
            <div
              className={`group rounded-3xl overflow-hidden border transition-all hover:-translate-y-1.5 ${
                theme === 'dark'
                  ? 'bg-slate-900/70 border-slate-800 hover:border-rose-500/50'
                  : 'bg-slate-50 border-slate-200 shadow-sm hover:shadow-xl'
              }`}
            >
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src="/assets/images/creative-brain.png"
                  alt="Creative and critical thinking capability"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-rose-500" />
                  Creative &amp; Critical Thinking
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Programs designed to unlock original thinking and confident, real-world problem solving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. OUR CAPABILITY PROGRAMS */}
      {/* ========================================================================= */}
      <section
        id="programs-section"
        className={`py-20 sm:py-24 border-b ${
          theme === 'dark' ? 'bg-[#080d1a] border-slate-800/80' : 'bg-slate-50/70 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-blue-500">
              <span className="w-7 h-px bg-blue-500/50" />
              OUR CAPABILITY PROGRAMS
              <span className="w-7 h-px bg-blue-500/50" />
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-3 tracking-tight">
              20+ Programs. Endless Possibilities.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Practical capability programs designed to strengthen leadership, communication, mindset, strategic thinking and real-world performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {capabilityPrograms.slice(0, showAllPrograms ? capabilityPrograms.length : 8).map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedCourseId(item.id);
                  setCurrentView('auth-login');
                }}
                className={`group text-left min-h-[205px] p-5 sm:p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900'
                    : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-blue-500/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-emerald-500/10 flex items-center justify-center ring-1 ring-blue-500/10 group-hover:scale-105 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-300 whitespace-nowrap">
                    {item.tag}
                  </span>
                </div>
                <h4 className="mt-5 text-base font-extrabold leading-snug group-hover:text-blue-500 transition-colors">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore program <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center mt-10 sm:mt-12">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {showAllPrograms ? 'Showing the complete capability catalog' : 'Explore a few of our most popular capability areas'}
            </p>
            <button
              type="button"
              onClick={() => setShowAllPrograms(prev => !prev)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              <span>{showAllPrograms ? 'Show Less' : 'View More Programs'}</span>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showAllPrograms ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4B. PARALLAX IMPACT BANNER (REAL PHOTO, FIXED BACKGROUND ATTACHMENT) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden py-24 sm:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: "url('/assets/images/growth-analytics.png')"
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/88 via-slate-950/80 to-slate-950/92" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
            Your Growth Starts Today
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-2 leading-tight">
            Real Skills. Real Transformation.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
            Join a community of learners who chose to invest in themselves. Every program is built by practitioners and designed for real-world impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentView('auth-register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 shadow-lg shadow-blue-600/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('programs-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm text-white border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Browse Programs</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. YOUR LEARNING JOURNEY (5 STEPS MATCHING IMAGE 1) */}
      {/* ========================================================================= */}
      <section
        id="journey-section"
        className={`py-20 border-b ${
          theme === 'dark' ? 'bg-[#060a14] border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-500">
              YOUR LEARNING JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
              A Simple Path to Your Growth
            </h2>
          </div>

          {/* 5 Connected Steps with arrows on sides */}
          <div className="flex items-center justify-between gap-2 max-w-6xl mx-auto">
            <button className="p-2 rounded-full border border-slate-700/60 text-slate-400 hover:text-white hidden md:block">
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full">
              {/* Step 1 */}
              <div
                className={`p-4 rounded-2xl border text-center relative ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/15 text-blue-500 flex items-center justify-center mx-auto mb-3 font-black text-sm">
                  1
                </div>
                <h4 className="text-xs sm:text-sm font-bold">Register</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                  Create your account and join the community.
                </p>
              </div>

              {/* Step 2 */}
              <div
                className={`p-4 rounded-2xl border text-center relative ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-cyan-500/15 text-cyan-500 flex items-center justify-center mx-auto mb-3 font-black text-sm">
                  2
                </div>
                <h4 className="text-xs sm:text-sm font-bold">Explore Free Courses</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                  Start with 2 free courses and explore programs.
                </p>
              </div>

              {/* Step 3 */}
              <div
                className={`p-4 rounded-2xl border text-center relative ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500/15 text-indigo-500 flex items-center justify-center mx-auto mb-3 font-black text-sm">
                  3
                </div>
                <h4 className="text-xs sm:text-sm font-bold">Subscribe & Unlock</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                  Choose membership and unlock premium programs.
                </p>
              </div>

              {/* Step 4 */}
              <div
                className={`p-4 rounded-2xl border text-center relative ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-3 font-black text-sm">
                  4
                </div>
                <h4 className="text-xs sm:text-sm font-bold">Learn & Grow</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                  Gain knowledge, skills and real-world insights.
                </p>
              </div>

              {/* Step 5 */}
              <div
                className={`p-4 rounded-2xl border text-center relative ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto mb-3 font-black text-sm">
                  5
                </div>
                <h4 className="text-xs sm:text-sm font-bold">Get Certified</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                  Complete programs and earn your certificate.
                </p>
              </div>
            </div>

            <button className="p-2 rounded-full border border-slate-700/60 text-slate-400 hover:text-white hidden md:block">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5B. MEMBERSHIP / PRICING SECTION */}
      {/* ========================================================================= */}
      <section
        id="pricing-section"
        className={`py-20 border-b ${
          theme === 'dark' ? 'bg-[#080d1a] border-slate-800/80' : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-500">
              MEMBERSHIP
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
              Simple, Honest Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
              Start free. Upgrade anytime to unlock every Capability Program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border flex flex-col ${
                theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Starter
              </span>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl sm:text-4xl font-black">Free</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Explore the platform, no card required.
              </p>

              <div className="space-y-2.5 mt-6 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>DISC Profiling</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Team Building</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic progress tracking</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('auth-register')}
                className={`mt-6 w-full py-2.5 rounded-full text-xs font-bold border transition-all ${
                  theme === 'dark'
                    ? 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                }`}
              >
                Start for Free
              </button>
            </div>

            {/* Annual Premium Plan */}
            <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden flex flex-col text-white bg-gradient-to-br from-blue-700 via-cyan-600 to-emerald-600 shadow-2xl shadow-blue-900/30">
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                Most Popular
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-white/80">
                Annual Premium
              </span>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-3xl sm:text-4xl font-black">₹1,000</span>
                <span className="text-xs font-semibold text-white/70 mb-1">/ year</span>
              </div>
              <p className="text-xs text-white/80 mt-1">
                Full access, billed once a year.
              </p>

              <div className="space-y-2.5 mt-6 text-xs sm:text-sm font-medium flex-1">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Access all 20+ Capability Programs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>20+ Capability Programs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Verifiable Digital Certificates</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="mt-6 w-full py-2.5 rounded-full text-xs font-bold text-blue-700 bg-white hover:bg-slate-100 shadow-md transition-all"
              >
                Become a Member
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHAT LEARNERS SAY & WHY BECOME A MEMBER + CONTACT (MATCHING IMAGE 1) */}
      {/* ========================================================================= */}
      <section
        id="testimonials-section"
        className={`py-20 border-b ${
          theme === 'dark' ? 'bg-[#080d1a] border-slate-800/80' : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Top Testimonials Carousel */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-500">
                WHAT LEARNERS SAY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">
                Real Stories. Real Impact.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                      "{t.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-700/40">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-8 h-8 rounded-full object-cover border border-blue-500/40"
                    />
                    <div>
                      <div className="text-xs font-bold">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Split: WHY BECOME A MEMBER? + Contact Form */}
          <div id="contact-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
            {/* Left: Why Become a Member Card */}
            <div className="lg:col-span-6">
              <div
                className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border space-y-4 ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
                }`}
              >
                <img
                  src="/assets/images/rainbow-mind.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute -right-10 -bottom-10 w-52 -z-10 opacity-10 dark:opacity-15 pointer-events-none select-none"
                />
                <span className="relative text-xs font-extrabold uppercase tracking-widest text-blue-500">
                  WHY BECOME A MEMBER?
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Unlock Your Unlimited Capability Potential
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Join thousands of learners transforming their personal, professional and leadership journey. Get full access to 24 capability programs and verified certificates.
                </p>

                <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Access all 20+ Capability Programs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>20+ Capability Programs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Verifiable Digital Certificates & LinkedIn Badges</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form matching Image 1 */}
            <div className="lg:col-span-6">
              <div
                className={`p-6 sm:p-8 rounded-3xl border ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <h4 className="text-base font-bold mb-4">Send Us a Message</h4>
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      rows={3}
                      value={contactMsg}
                      onChange={e => setContactMsg(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Send Message</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. EARN AN INDUSTRY-RECOGNIZED CERTIFICATE (MATCHING IMAGE 1) */}
      {/* ========================================================================= */}
      <section
        id="certificate-section"
        className={`py-20 border-b ${
          theme === 'dark' ? 'bg-[#060a14] border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Realistic Framed Certificate Preview Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Stacked shadow card behind for a tangible, real-paper feel */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-slate-900/10 dark:bg-black/40 rotate-2" />
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl bg-slate-900/10 dark:bg-black/30 rotate-1" />

                <div
                  onClick={() => {
                    setActiveCertificate(certificates[0]);
                    setViewCertificateModal(true);
                  }}
                  className="relative aspect-[1.414/1] rounded-2xl overflow-hidden border-[6px] border-double border-[#d4af37] bg-[#fffdf9] text-slate-900 p-5 sm:p-7 shadow-2xl flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-[0_25px_60px_-15px_rgba(180,140,20,0.5)] transition-all select-none"
                >
                  {/* Watermark */}
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center">
                    <Logo size="xl" showText={false} />
                  </div>

                  <div className="text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Logo size="sm" showText={false} />
                      <div className="text-left leading-tight">
                        <div className="font-extrabold text-[9px] sm:text-[10px] text-sky-900 tracking-wider uppercase font-serif">
                          Institute of Human Capability
                        </div>
                        <div className="text-[7px] sm:text-[8px] font-bold text-amber-700 tracking-widest uppercase">
                          Development &amp; Research
                        </div>
                      </div>
                    </div>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto my-1.5" />
                    <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      ThinkAHead Learning Hub
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-[#b8860b] font-serif mt-0.5">
                      CERTIFICATE OF COMPLETION
                    </div>
                    <div className="text-[9px] text-slate-400 italic mt-1">This is to certify that</div>
                    <div className="text-xl sm:text-2xl font-black text-sky-950 font-serif underline decoration-amber-400 underline-offset-4 mt-1">
                      Anjali Sharma
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-600 mt-1.5 max-w-xs mx-auto leading-relaxed">
                      has successfully completed the <strong>Leadership Development Program</strong>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[8px] sm:text-[9px] font-bold text-emerald-700">
                      Sample Final Test Score: 92%
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-2 border-t border-slate-200 text-[7px] sm:text-[8px] text-slate-500 relative z-10">
                    <div className="text-left">
                      <div className="font-bold text-slate-700">
                        CERT ID: THA-{liveNow.getFullYear()}-8841
                      </div>
                      <div>
                        Date: {liveNow.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border-2 border-amber-600 shadow-md flex flex-col items-center justify-center text-[6px] font-bold text-amber-950 uppercase leading-none">
                      <span>IHCDR</span>
                      <Sparkles className="w-2.5 h-2.5 my-0.5" />
                      <span>SEAL</span>
                    </div>
                    <div className="text-right">
                      <div className="font-serif italic text-xs sm:text-sm text-slate-700">G. Satyanarayana</div>
                      <div className="w-16 h-px bg-slate-400 mt-0.5 ml-auto" />
                      <div>Founder Director</div>
                    </div>
                  </div>
                </div>

                {/* Verified ribbon badge */}
                <div className="absolute -top-3 -right-3 sm:-right-5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-lg shadow-emerald-500/40 flex items-center gap-1.5 rotate-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </div>

                {/* Live Preview badge */}
                <div className="absolute -top-3 -left-3 sm:-left-5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-lg flex items-center gap-1.5 -rotate-3 border border-slate-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Live Preview
                </div>

                <button
                  onClick={() => {
                    setActiveCertificate(certificates[0]);
                    setViewCertificateModal(true);
                  }}
                  className="mt-6 mx-auto flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to view full certificate</span>
                </button>
              </div>
            </div>

            {/* Right: Content & Action */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-500">
                EARN AN INDUSTRY-RECOGNIZED CERTIFICATE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Showcase your skills and achievements with a certificate that adds value to your career.
              </h2>

              <div className="space-y-2.5 pt-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Complete all required programs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Complete the final tests</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Earn verifiable digital certificate</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Share on LinkedIn and your resume</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={() => {
                    setActiveCertificate(certificates[0]);
                    setViewCertificateModal(true);
                  }}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold border transition-all ${
                    theme === 'dark'
                      ? 'border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200'
                      : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
                  }`}
                >
                  View Sample Certificate
                </button>

                <button
                  onClick={() => setCurrentView('auth-register')}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER (MATCHING IMAGE 1) */}
      {/* ========================================================================= */}
      <Footer />
    </div>
  );
};
