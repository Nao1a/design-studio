import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { content } from '../data/content';

import studioLogo from '../assets/logo.jpeg';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scrollspy calculation
      const sections = ['hero', 'mission-vision', 'projects', 'achievements', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-subtle py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Studio Identifier */}
          <a
            href="#hero"
            className="flex items-center space-x-3 group focus:outline-none"
            aria-label="AAU Biomedical Design Studio Home"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <img
                src={studioLogo}
                alt="AAU Biomedical Design Studio Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-slate-900 block leading-tight">
                AAU Biomedical
              </span>
              <p className="text-[12px] font-medium text-slate-500 tracking-wide">
                Design Studio
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-full border border-slate-200/60 shadow-inner">
            {content.navigation.links.map((link) => {
              const targetId = link.href.replace('#', '');
              const isActive = activeSection === targetId;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-white rounded-full border border-slate-200/80 shadow-xs"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="#contact"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-sky-600 transition-colors shadow-sm focus:ring-2 focus:ring-sky-500"
            >
              <span>{content.navigation.ctaLabel}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 pt-2 pb-6 shadow-xl"
          >
            <div className="flex flex-col space-y-2 pt-2">
              {content.navigation.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50/50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-sky-600 transition-colors"
                >
                  <span>{content.navigation.ctaLabel}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
