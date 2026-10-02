import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { content, Project } from '../data/content';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const projects = content.projects.items;

  return (
    <section id="projects" className="relative py-20 lg:py-28 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-base font-medium text-sky-600 mb-3">
            {content.projects.badge}
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            {content.projects.headline}
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            {content.projects.subheadline}
          </p>
        </div>

        {/* Cards */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          <AnimatePresence>
            {projects.map((project, idx) => (
              <motion.article
                layout
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                onClick={() => setActiveModalProject(project)}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 transition-all hover:shadow-lg cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={project.imagePlaceholder}
                    alt={project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-sky-600">{project.category}</span>
                    <span className="text-sm text-slate-400">{project.status}</span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-sky-700 transition-colors mb-2">
                    {project.title}
                  </h3>

                  <p className="text-slate-500 text-base line-clamp-2 leading-relaxed mb-5 flex-1">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-sm px-3 py-1 rounded-md bg-slate-100 text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectModal project={activeModalProject} onClose={() => setActiveModalProject(null)} />
    </section>
  );
};
