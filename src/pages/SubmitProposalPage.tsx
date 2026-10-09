import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const SubmitProposalPage: React.FC = () => {
  const { user, isVerifiedMember, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in as a verified member or admin, direct them to the Member Portal submission tab
  useEffect(() => {
    if (user && (isVerifiedMember || isAdmin)) {
      navigate('/portal');
    }
  }, [user, isVerifiedMember, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-slate-900 selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24 max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 mb-4 shadow-xs">
            <Lock className="w-3.5 h-3.5 text-slate-700" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Verified Member Access Only
            </p>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            Biomedical Project Proposals & Studio Resources
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Project concept submission and equipment allocation are exclusively reserved for verified AAU Biomedical Design Studio members.
          </p>
        </div>

        {/* Member Access Gate Notice */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto border border-slate-200">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">
              Member Account Verification
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
              To utilize the studio's prototyping cleanroom, 3D micro-printers, and faculty guidance, studio members must sign up their account and have it verified by the administrator.
            </p>
          </div>

          {/* Quick steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-slate-200/70 text-xs space-y-1">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <p className="font-bold text-slate-900 pt-1">Sign Up</p>
              <p className="text-slate-500 text-[11px]">Register with your name, ID number (e.g. UGR/1234/12), and email.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-slate-200/70 text-xs space-y-1">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <p className="font-bold text-slate-900 pt-1">Admin Verification</p>
              <p className="text-slate-500 text-[11px]">Studio administrator verifies your member account.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-slate-200/70 text-xs space-y-1">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <p className="font-bold text-slate-900 pt-1">Submit & Track</p>
              <p className="text-slate-500 text-[11px]">Log into member portal, submit concepts & receive feedback.</p>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Member Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/login?tab=register"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Member Sign Up</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitProposalPage;
