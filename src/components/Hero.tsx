import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { content } from '../data/content';
import { HeroCanvas } from './HeroCanvas';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-24 lg:pt-0"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 w-full py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Studio Subtitle */}
            <p className="text-sm font-semibold tracking-wider uppercase text-sky-600 mb-4">
              {content.meta.studioName}
            </p>

            {/* Headline */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-[1.12] mb-6">
              {content.hero.headlineStart}{' '}
              <span className="text-gradient">{content.hero.headlineHighlight}</span>{' '}
              {content.hero.headlineEnd}
            </h1>

            {/* Intro */}
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
              {content.hero.intro}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-slate-900 text-white font-medium text-base hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:translate-y-0"
              >
                {content.hero.primaryCta}
                <ChevronRight className="w-4 h-4 opacity-60" />
              </a>
              <a
                href="#mission-vision"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-slate-700 font-medium text-base border border-slate-300 hover:border-slate-400 hover:bg-white transition-all"
              >
                {content.hero.secondaryCta}
              </a>
            </div>
          </motion.div>

          {/* Right Column: 3D Model Interactive Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 w-full h-[460px] sm:h-[540px] lg:h-[620px] relative flex items-center justify-center"
          >
            <HeroCanvas />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
