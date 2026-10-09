import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Newspaper, UserCheck, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import { useAuth } from '../context/AuthContext';

import studioLogo from '../assets/logo.jpeg';

export const Navbar: React.FC = () => {
  const { siteContent } = useSiteData();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (isHomePage) {
        const sections = ['hero', 'mission-vision', 'projects', 'team', 'contact'];
        const scrollPosition = window.scrollY + 180;

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
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    setActiveSection(targetId);

    if (!isHomePage) {
      navigate(`/#${targetId}`);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 70;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3.5'
          : 'bg-white/60 backdrop-blur-sm py-4 border-b border-slate-100/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Studio Identifier */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-none"
            aria-label="AAU Biomedical Design Studio Home"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <img
                src={studioLogo}
                alt="AAU Biomedical Design Studio Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-slate-900 block leading-tight">
                {siteContent?.meta?.studioName?.replace('AAU ', '') || 'Biomedical'}
              </span>
              <p className="text-[12px] font-medium text-slate-500 tracking-wide">
                AAU Design Studio
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-full border border-slate-200/60 shadow-inner">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none ${
                isHomePage && activeSection === 'hero'
                  ? 'text-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {isHomePage && activeSection === 'hero' && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full border border-slate-200/80 shadow-xs"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Overview</span>
            </a>

            <a
              href="#mission-vision"
              onClick={(e) => handleNavClick(e, '#mission-vision')}
              className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none ${
                isHomePage && activeSection === 'mission-vision'
                  ? 'text-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {isHomePage && activeSection === 'mission-vision' && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full border border-slate-200/80 shadow-xs"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Mission</span>
            </a>

            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, '#projects')}
              className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none ${
                isHomePage && activeSection === 'projects'
                  ? 'text-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {isHomePage && activeSection === 'projects' && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full border border-slate-200/80 shadow-xs"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Projects</span>
            </a>

            <a
              href="#team"
              onClick={(e) => handleNavClick(e, '#team')}
              className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none ${
                isHomePage && activeSection === 'team'
                  ? 'text-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {isHomePage && activeSection === 'team' && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full border border-slate-200/80 shadow-xs"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Team</span>
            </a>

            {/* News Route Link */}
            <Link
              to="/news"
              className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none ${
                location.pathname.startsWith('/news')
                  ? 'text-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {location.pathname.startsWith('/news') && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full border border-slate-200/80 shadow-xs"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
                <Newspaper className="w-3 h-3" />
                News & Dispatches
              </span>
            </Link>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none ${
                isHomePage && activeSection === 'contact'
                  ? 'text-slate-950 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {isHomePage && activeSection === 'contact' && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full border border-slate-200/80 shadow-xs"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Contact</span>
            </a>
          </nav>

          {/* Action CTAs: Member Portal, Submit Idea & Admin */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/portal"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAdmin ? 'Member Workspace' : `Workspace (${user.name.split(' ')[0]})`}</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200/80 transition-all shadow-xs"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-600" />
                    <span>Admin CMS</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs"
                >
                  <User className="w-3.5 h-3.5 text-slate-300" />
                  <span>Member Sign In</span>
                </Link>

                <Link
                  to="/login?tab=admin"
                  className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Studio Admin CMS"
                >
                  <Shield className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to={user ? "/portal" : "/login"}
              className="p-2 rounded-lg bg-slate-900 text-white"
              title="Member Portal"
            >
              {user ? <UserCheck className="w-4 h-4 text-emerald-400" /> : <User className="w-4 h-4 text-slate-300" />}
            </Link>
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
              <a
                href="#hero"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, '#hero');
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Overview
              </a>
              <a
                href="#mission-vision"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, '#mission-vision');
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Mission & Vision
              </a>
              <a
                href="#projects"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, '#projects');
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Projects
              </a>
              <a
                href="#team"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, '#team');
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Team & Founders
              </a>
              <Link
                to="/news"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-sky-700 bg-sky-50 flex items-center justify-between"
              >
                <span>News & Dispatches</span>
                <Newspaper className="w-4 h-4" />
              </Link>
              <Link
                to={user ? "/portal" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50 flex items-center justify-between"
              >
                <span>{user ? `Member Portal (${user.name.split(' ')[0]})` : 'Member Sign In / Join'}</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </Link>
              <a
                href="#contact"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, '#contact');
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Contact
              </a>
              <Link
                to={isAdmin ? "/admin" : "/login?tab=admin"}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-bold text-white bg-slate-900 flex items-center justify-between mt-2"
              >
                <span>Admin CMS Portal</span>
                <Shield className="w-4 h-4 text-sky-400" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
