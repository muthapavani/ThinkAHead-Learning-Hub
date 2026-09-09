import React, { useRef, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  Linkedin,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  Printer
} from 'lucide-react';
import { CertificateRecord } from '../../types';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';

interface CertificateModalProps {
  certificate: CertificateRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  const { showToast } = useApp();
  const certRef = useRef<HTMLDivElement>(null);

  // Close on Escape key and prevent body scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      `https://thinkahead.in/verify/${certificate.certificateNumber}`
    )}`;
    window.open(url, '_blank');
    showToast('LinkedIn Share dialogue opened!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://thinkahead.in/verify/${certificate.certificateNumber}`);
    showToast('Certificate verification link copied to clipboard!');
  };

  return (
    <div
      id="certificate-modal-backdrop"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        id="certificate-modal-container"
        className="relative w-full max-w-5xl bg-[#07111f] border border-cyan-400/20 rounded-[28px] shadow-[0_30px_100px_rgba(0,0,0,0.55)] overflow-hidden text-white flex flex-col my-auto max-h-[94vh]"
      >
        {/* Modal Header Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200 truncate">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <span className="truncate">Digital Certificate</span>
            <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 items-center gap-1 font-mono shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Print</span>
            </button>
            <button
              onClick={handleShareLinkedIn}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-semibold transition-all"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </button>
            <button
              id="close-certificate-modal-btn"
              onClick={onClose}
              aria-label="Close certificate modal"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 transition-all flex items-center gap-1 text-xs font-bold"
            >
              <X className="w-4 h-4" />
              <span className="hidden xs:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Certificate Rendering Sheet (Scrollable on small screens) */}
        <div className="p-4 sm:p-8 flex justify-center bg-[#070b16] overflow-x-auto overflow-y-auto flex-1">
          <div
            id="printable-certificate"
            ref={certRef}
            className="relative w-full max-w-[900px] aspect-[1.414/1] bg-gradient-to-br from-[#fffdf7] via-white to-[#f4f8fb] text-slate-900 p-6 sm:p-10 rounded-[10px] shadow-[0_25px_70px_rgba(15,23,42,0.28)] border-[6px] sm:border-[8px] border-[#b9974b] flex flex-col justify-between select-none overflow-hidden shrink-0 ring-1 ring-[#d7c38a]/70"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <div className="absolute inset-3 sm:inset-5 border border-[#b9974b]/40 pointer-events-none rounded-sm" />
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-cyan-500/5 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-amber-400/10 blur-2xl" />

            {/* Elegant Background Watermark Pattern */}
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none flex items-center justify-center">
              <Logo size="xl" showText={false} />
            </div>

            {/* Certificate Top Header */}
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <Logo size="sm" showText={false} />
                <div className="text-left">
                  <div className="font-extrabold text-xs sm:text-base text-sky-900 tracking-wider uppercase font-serif">
                    The Institute of Human Capability
                  </div>
                  <div className="text-[9px] sm:text-xs font-bold text-amber-700 tracking-widest uppercase">
                    Development and Research (IHCDR)
                  </div>
                </div>
              </div>

              <div className="w-20 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto my-2 sm:my-3" />

              <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-slate-500">
                ThinkAHead Learning Hub
              </h2>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-wide font-serif mt-0.5 sm:mt-1 text-[#b8860b]">
                MASTER DIPLOMA
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 italic mt-0.5 sm:mt-1">THIS CREDENTIAL IS AWARDED TO</p>
            </div>

            {/* Recipient Name */}
            <div className="text-center my-2 sm:my-3 relative z-10">
              <div className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-serif text-sky-950 underline decoration-[#d4af37] decoration-2 underline-offset-4 sm:underline-offset-8">
                {certificate.studentName}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-600 mt-2 sm:mt-4 max-w-lg mx-auto leading-relaxed">
                has successfully completed the full ThinkAHead Human Capability curriculum, demonstrating sustained mastery across the required learning programs and assessments.
              </p>
              <div className="text-sm sm:text-xl font-bold text-slate-900 mt-1 sm:mt-2 text-indigo-900 font-serif">
                {certificate.courseName}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                {/* Score from the programme-wide final assessment sits first, since
                    passing it is what earns the certificate. */}
                {(certificate as any).finalAssessmentScore ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[8px] sm:text-[9px] font-bold text-indigo-800">
                    Final Assessment: {(certificate as any).finalAssessmentScore}%
                  </div>
                ) : null}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[8px] sm:text-[9px] font-bold text-emerald-700">
                  Course Average: {certificate.overallAssessmentScore || 0}%
                </div>
              </div>
              {certificate.assessmentScores?.length ? (
                <div className="mt-2 max-w-2xl mx-auto text-[7px] sm:text-[8px] text-slate-500 leading-relaxed">
                  {certificate.assessmentScores.map((item, index) => (
                    <span key={item.courseId}>
                      {item.courseTitle}: <strong className="text-slate-700">{item.percentage}%</strong>{index < (certificate.assessmentScores?.length || 0) - 1 ? ' • ' : ''}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Certificate Footer / Signatures & QR */}
            <div className="pt-2 sm:pt-3 border-t border-slate-200 grid grid-cols-[1.15fr_0.7fr_1.15fr] items-end text-center relative z-10 gap-1 sm:gap-2">
              {/* Left: Certificate Meta & QR */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-left min-w-0">
                <div className="p-0.5 bg-white border border-slate-300 rounded shadow-sm shrink-0">
                  <img
                    src={certificate.qrCodeUrl || `https://quickchart.io/qr?text=${encodeURIComponent(`https://ihcdr.org/verify/${certificate.certificateNumber}`)}&size=220`}
                    alt="Verification QR"
                    className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                    onError={(e) => {
                      const img = e.currentTarget;
                      const fallback = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://ihcdr.org/verify/${certificate.certificateNumber}`)}`;
                      if (img.src !== fallback) img.src = fallback;
                    }}
                  />
                </div>
                <div className="text-[8px] sm:text-[9px] text-slate-500 font-mono leading-tight">
                  <div className="font-bold text-slate-700">CERTIFICATE ID:</div>
                  <div className="text-indigo-950 font-bold truncate max-w-[76px] sm:max-w-[105px]">{certificate.certificateNumber}</div>
                  <div className="mt-0.5">Date: {certificate.issueDate}</div>
                  <div className="text-emerald-700 font-semibold">Verified Online</div>
                </div>
              </div>

              {/* Center: Golden Seal Badge */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border-2 border-amber-600 shadow-md flex items-center justify-center relative">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-dashed border-amber-900/40 flex flex-col items-center justify-center text-[6px] sm:text-[7px] font-bold text-amber-950 text-center uppercase leading-none">
                    <span>IHCDR</span>
                    <Sparkles className="w-2 h-2 my-0.5 text-amber-900" />
                    <span>SEAL</span>
                  </div>
                </div>
                <span className="text-[8px] sm:text-[9px] font-serif text-slate-500 mt-0.5 uppercase tracking-wider">
                  VERIFIED MASTER CREDENTIAL
                </span>
              </div>

              {/* Right: Signatures */}
              <div className="flex flex-col items-end text-right">
                <div className="font-serif italic text-sm sm:text-xl text-slate-800 font-semibold">
                  G. Satyanarayana
                </div>
                <div className="w-20 sm:w-32 h-px bg-slate-400 mt-0.5 sm:mt-1" />
                <div className="text-[8px] sm:text-[9px] font-bold text-slate-800 mt-0.5">
                  G. Satyanarayana
                </div>
                <div className="text-[7px] sm:text-[8px] text-slate-500">
                  Founder Director, IHCDR
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Recorded on ThinkAHead verification registry.</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopyLink}
              className="hidden xs:flex px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

