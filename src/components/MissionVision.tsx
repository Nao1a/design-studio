import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { content } from '../data/content';
import { DNADualCanvas } from './DNACanvas';

export const MissionVision: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '200px' });

  return (
    <section ref={sectionRef} id="mission-vision" className="relative py-20 lg:py-28 bg-[#FAFAFA]">
      {/* DNA models — rendered symmetrically with zero-lag frameloop throttling */}
      <div
        className={`hidden xl:block absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isInView ? 'opacity-70' : 'opacity-0'
        }`}
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        <DNADualCanvas active={isInView} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-base font-medium text-sky-600 mb-3">
            {content.missionVision.badge}
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">
            {content.missionVision.headline}
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            {content.missionVision.subheadline}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-8 lg:p-10 bg-white border border-slate-200/80 shadow-xs"
          >
            <h3 className="font-display font-bold text-2xl lg:text-3xl text-slate-900 mb-2">
              {content.missionVision.mission.title}
            </h3>
            <p className="text-base text-slate-500 mb-5">
              {content.missionVision.mission.subtitle}
            </p>
            <p className="text-base text-slate-600 leading-relaxed mb-6">
              {content.missionVision.mission.description}
            </p>
            <div className="space-y-3 pt-5 border-t border-slate-200/60">
              {content.missionVision.mission.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                  <span className="text-base text-slate-700">{pt}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-8 lg:p-10 bg-white border border-slate-200/80 shadow-xs"
          >
            <h3 className="font-display font-bold text-2xl lg:text-3xl text-slate-900 mb-2">
              {content.missionVision.vision.title}
            </h3>
            <p className="text-base text-slate-500 mb-5">
              {content.missionVision.vision.subtitle}
            </p>
            <p className="text-base text-slate-600 leading-relaxed mb-6">
              {content.missionVision.vision.description}
            </p>
            <div className="space-y-3 pt-5 border-t border-slate-200/60">
              {content.missionVision.vision.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                  <span className="text-base text-slate-700">{pt}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

