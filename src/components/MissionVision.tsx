import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';
import { content } from '../data/content';

const iconMap = {
  ShieldCheck,
  Cpu,
  HeartPulse,
  Sparkles,
};

export const MissionVision: React.FC = () => {
  return (
    <section id="mission-vision" className="relative py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
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
            className="rounded-2xl p-8 lg:p-10 bg-[#f8fafc] border border-slate-200/80"
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
            className="rounded-2xl p-8 lg:p-10 bg-[#f8fafc] border border-slate-200/80"
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

        {/* Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.missionVision.coreValues.map((val, idx) => {
            const IconComponent = iconMap[val.icon] || ShieldCheck;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="p-6 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h4 className="font-display font-semibold text-lg text-slate-900 mb-2">
                  {val.title}
                </h4>
                <p className="text-base text-slate-500 leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
