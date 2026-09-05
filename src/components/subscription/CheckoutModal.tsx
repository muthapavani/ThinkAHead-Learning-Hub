import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    checkoutModalOpen,
    setCheckoutModalOpen,
    upgradeToMonthlyPlan,
    theme
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  // Close on Escape key and lock body scroll
  useEffect(() => {
    if (!checkoutModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCheckoutModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [checkoutModalOpen, setCheckoutModalOpen]);

  if (!checkoutModalOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await upgradeToMonthlyPlan(paymentMethod);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="checkout-modal-backdrop"
      onClick={e => {
        if (e.target === e.currentTarget) {
          setCheckoutModalOpen(false);
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        id="checkout-modal-container"
        className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border transition-all my-auto max-h-[92vh] flex flex-col ${
          theme === 'dark'
            ? 'bg-[#0f172a] border-indigo-500/30 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">ThinkAHead Annual Membership</h3>
              <p className="text-xs text-slate-400">Unlock the complete Human Capability curriculum for one year</p>
            </div>
          </div>
          <button
            onClick={() => setCheckoutModalOpen(false)}
            aria-label="Close modal"
            className="p-2 rounded-xl hover:bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Plan Summary Card */}
          <div
            className={`p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900/80 border-slate-700/80' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Annual Plan</span>
                <h4 className="text-lg font-extrabold mt-0.5">Annual access • complete curriculum</h4>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">₹1,000</span>
                <span className="text-xs text-slate-400"> / Year</span>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Full capability curriculum access for the membership year</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Digitally verified certificates with QR verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Downloadable course handbooks, notes & worksheets</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Live interactive masterclasses with senior industry mentors</span>
              </li>
            </ul>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-md shadow-indigo-600/20'
                    : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                  paymentMethod === 'card'
                    ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-md shadow-indigo-600/20'
                    : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-400" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-md shadow-indigo-600/20'
                    : 'border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* Secure Gateway Checkout */}
          <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-indigo-950/30 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold">Secure Razorpay Checkout</div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Your card, UPI or net-banking details are entered securely in Razorpay's hosted checkout. ThinkAHead never stores your card number or CVV.
                </p>
              </div>
            </div>
          </div>

          {/* Guarantee & Security */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>30-Day Money Back Guarantee</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCheckoutModalOpen(false)}
              className="px-4 py-3 rounded-2xl font-bold text-xs border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹1,000 & Activate</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

