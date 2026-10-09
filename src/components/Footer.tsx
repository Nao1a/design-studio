import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import studioLogo from '../assets/logo.jpeg';

export const Footer: React.FC = () => {
  const { siteContent } = useSiteData();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-white border-t border-slate-200/80 py-14">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center shrink-0">
                <img
                  src={studioLogo}
                  alt="AAU Biomedical Design Studio"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-lg text-slate-900">
                {siteContent.meta?.studioName}
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm">
              {siteContent.footer?.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-600">
            {siteContent.navigation?.links?.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-sky-600 transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-sky-600 p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
            aria-label="Back to top"
          >
            Top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <span>{siteContent.footer?.copyright}</span>
          <span>{siteContent.footer?.affiliation}</span>
        </div>
      </div>
    </footer>
  );
};
