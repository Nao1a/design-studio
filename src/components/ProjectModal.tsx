import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, FileText } from 'lucide-react';
import { Project } from '../data/content';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
        >
          {/* Header Image / Pattern Area */}
          <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
            <img
              src={project.imagePlaceholder}
              alt={project.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md transition-colors"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category & Status Badges */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-sky-500/90 text-white font-semibold shadow-xs">
                {project.category}
              </span>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-white/20 text-white backdrop-blur-md font-medium border border-white/30">
                {project.status}
              </span>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
              {project.title}
            </h3>
            <p className="text-sm font-medium text-sky-700 mb-6">
              {project.tagline}
            </p>

            <div className="mb-6">
              <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                Clinical Overview
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {project.description}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {project.extendedDescription}
              </p>
            </div>

            {/* Engineering Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6">
              {project.metrics.map((m, i) => (
                <div key={i} className="text-center">
                  <span className="block font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                    {m.label}
                  </span>
                  <span className="block font-display font-bold text-sm sm:text-base text-slate-900 mt-0.5">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Meta & Tags */}
            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center text-slate-600">
                <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <span className="font-medium">Lead: {project.leadInvestigator}</span>
              </div>
              {project.patentId && (
                <div className="flex items-center text-slate-600">
                  <FileText className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <span className="font-mono font-medium">Patent / Filing: {project.patentId}</span>
                </div>
              )}
            </div>

            {/* Tag Chips */}
            <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-slate-100">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Close action */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-sky-600 text-white text-xs font-semibold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
