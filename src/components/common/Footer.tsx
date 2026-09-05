import React, { useState } from 'react';
import { Send, Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const { theme, setCurrentView, showToast, subscribeNewsletter } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    void subscribeNewsletter(newsletterEmail.trim()).then(() => setNewsletterEmail(''));
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="main-footer"
      className={`border-t transition-colors duration-300 text-slate-400 ${
        theme === 'dark'
          ? 'bg-[#060912] border-slate-800/80'
          : 'bg-[#0b1220] border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* 6 Column Layout matching Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 text-xs">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="group inline-block transition-transform duration-300 hover:scale-110 hover:-translate-y-0.5"><Logo size="md" theme="dark" /></div>
            <p className="text-[11px] leading-relaxed text-slate-200 max-w-xs">
              Empowering individuals through Human Capability Development to unlock their true potential and create a better tomorrow.
            </p>
            <ul className="space-y-2 text-[11px] pt-1">
              <li className="flex items-center gap-2 text-slate-200">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>hello@thinkahead.in</span>
              </li>
              <li className="flex items-center gap-2 text-slate-200">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+91 90000 00000</span>
              </li>
              <li className="flex items-start gap-2 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Institute of Human Capability Development &amp; Research, Hyderabad, India</span>
              </li>
            </ul>
          </div>

          {/* Col 2: QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => scrollTo('hero-section')} className="hover:text-blue-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('about-section')} className="hover:text-blue-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('programs-section')} className="hover:text-blue-400 transition-colors">
                  Programs
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('journey-section')} className="hover:text-blue-400 transition-colors">
                  Learning Journey
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('testimonials-section')} className="hover:text-blue-400 transition-colors">
                  Membership
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contact-section')} className="hover:text-blue-400 transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: PROGRAMS */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              PROGRAMS
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => scrollTo('programs-section')} className="hover:text-blue-400 transition-colors text-left">
                  Leadership Development
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('programs-section')} className="hover:text-blue-400 transition-colors text-left">
                  Communication Skills
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('programs-section')} className="hover:text-blue-400 transition-colors text-left">
                  Emotional Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('programs-section')} className="hover:text-blue-400 transition-colors text-left">
                  Financial Literacy
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('programs-section')} className="hover:text-blue-400 transition-colors text-left">
                  Innovation & Creativity
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('programs-section')} className="text-blue-400 hover:underline font-semibold">
                  View All Programs →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: RESOURCES */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              RESOURCES
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => scrollTo('programs-section')} className="hover:text-blue-400 transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('hero-section')} className="hover:text-blue-400 transition-colors">
                  Workshops
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('programs-section')} className="hover:text-blue-400 transition-colors">
                  Free Resources
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('certificate-section')} className="hover:text-blue-400 transition-colors">
                  Downloads
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('testimonials-section')} className="hover:text-blue-400 transition-colors">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5 & 6: SUPPORT & NEWSLETTER */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                SUPPORT
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li><button className="hover:text-blue-400 transition-colors">Help Center</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Terms & Conditions</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Refund Policy</button></li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                NEWSLETTER
              </h4>
              <p className="text-[10px] text-slate-300">Subscribe to get updates and latest programs.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1.5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-[11px] border border-slate-700/60 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 text-white flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Social Icons */}
              <div className="flex items-center gap-2 pt-2 text-slate-500">
                <a href="#facebook" className="hover:text-blue-400 transition-colors"><Facebook className="w-3.5 h-3.5" /></a>
                <a href="#instagram" className="hover:text-pink-500 transition-colors"><Instagram className="w-3.5 h-3.5" /></a>
                <a href="#linkedin" className="hover:text-blue-400 transition-colors"><Linkedin className="w-3.5 h-3.5" /></a>
                <a href="#youtube" className="hover:text-red-500 transition-colors"><Youtube className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright matching Image 1 */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-200 text-center sm:text-left">
          <p>© {new Date().getFullYear()} ThinkAHead Learning Hub. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button className="hover:text-white">Privacy Policy</button>
            <button className="hover:text-white">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
