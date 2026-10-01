import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, BookOpen, Handshake, FileCheck, Award } from 'lucide-react';
import { content, TimelineItem, AchievementStat } from '../data/content';

const AnimatedCounter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 1600;
    const incrementTime = 25;
    const steps = duration / incrementTime;
    const stepValue = end / steps;
    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, incrementTime);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-display font-bold text-5xl sm:text-6xl text-slate-900">
      {count}{suffix}
    </span>
  );
};

const categoryIconMap: Record<string, React.FC<{ className?: string }>> = {
  Award: Trophy,
  Patent: FileCheck,
  Publication: BookOpen,
  Partnership: Handshake,
};

export const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="relative py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-base font-medium text-sky-600 mb-3">
            {content.achievements.badge}
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            {content.achievements.headline}
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            {content.achievements.subheadline}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {content.achievements.stats.map((stat: AchievementStat, idx: number) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-7 rounded-2xl bg-[#f8fafc] border border-slate-200/80"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <h3 className="font-display font-semibold text-lg text-slate-800 mt-3">
                {stat.label}
              </h3>
              <p className="text-base text-slate-500 mt-2">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <h3 className="font-display font-bold text-2xl lg:text-3xl text-slate-900 mb-10">
            Awards, Patents, Publications & Partnerships
          </h3>

          <div className="relative border-l-2 border-slate-200 pl-8 space-y-7 ml-3">
            {content.achievements.timeline.map((item: TimelineItem, idx: number) => {
              const IconComp = categoryIconMap[item.category] || Award;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="relative"
                >
                  <div className="absolute -left-[37px] top-2.5 w-3 h-3 rounded-full bg-sky-600 border-2 border-white" />
                  <div className="p-6 rounded-xl bg-[#f8fafc] border border-slate-200/80">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-base font-semibold text-slate-900">{item.year}</span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-sm text-slate-500">
                        <IconComp className="w-3.5 h-3.5" />
                        {item.category}
                      </span>
                    </div>
                    <h4 className="font-display font-semibold text-xl text-slate-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-base text-slate-500 leading-relaxed mb-1.5">
                      {item.description}
                    </p>
                    <p className="text-sm text-slate-400">{item.venueOrPartner}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
