import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, FileText, CheckCircle2 } from 'lucide-react';
import { Project } from '../data/content';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Lock body scroll when modal is open and handle ESC key
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.08 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto grid grid-cols-1 md:grid-cols-12 max-h-[90vh]"
        >
          {/* Left Column: Image & Highlights (md: 5 cols) */}
          <div className="relative md:col-span-5 bg-slate-900 flex flex-col min-h-[220px] md:min-h-[460px]">
            {/* Project Image */}
            <img
              src={project.imagePlaceholder}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/10 pointer-events-none" />

            {/* Top Badges */}
            <div className="relative z-10 p-5 flex items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500 text-white font-semibold shadow-sm">
                {project.category}
              </span>
              <span className="font-mono text-xs px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md border border-white/25 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {project.status}
              </span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Meta Overlay on Image */}
            <div className="relative z-10 p-5 pt-0 space-y-2 text-white/90">
              <div className="flex items-center text-xs">
                <User className="w-3.5 h-3.5 text-sky-400 mr-2 shrink-0" />
                <span className="font-medium text-slate-200">
                  <span className="text-white/60">Lead: </span>
                  {project.leadInvestigator}
                </span>
              </div>
              {project.patentId && (
                <div className="flex items-center text-xs">
                  <FileText className="w-3.5 h-3.5 text-sky-400 mr-2 shrink-0" />
                  <span className="font-mono text-slate-200">
                    <span className="text-white/60">Patent: </span>
                    {project.patentId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details & Metrics (md: 7 cols) */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col overflow-y-auto max-h-[60vh] md:max-h-[85vh]">
            {/* Header row with Close button */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
                  Biomedical Project Spec
                </p>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-snug">
                  {project.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tagline */}
            <p className="text-sm font-medium text-slate-700 mb-5 leading-relaxed bg-sky-50/70 border border-sky-100 rounded-lg p-3">
              {project.tagline}
            </p>

            {/* Clinical Overview */}
            <div className="mb-5 space-y-2.5">
              <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Clinical & Engineering Overview
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {project.description}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {project.extendedDescription}
              </p>
            </div>

            {/* Engineering Metrics Grid */}
            <div className="mb-5">
              <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2.5">
                Key Performance Metrics
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                {project.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center"
                  >
                    <span className="block font-mono text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider">
                      {m.label}
                    </span>
                    <span className="block font-display font-bold text-sm sm:text-base text-slate-900 mt-0.5">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Close */}
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                Close Project
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
