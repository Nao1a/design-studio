import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteDataProvider } from './context/SiteDataContext';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MissionVision } from './components/MissionVision';
import { Projects } from './components/Projects';
import { Team } from './components/Team';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

// Code-split pages for instant route transitions and minimal initial bundle size
const NewsPage = React.lazy(() => import('./pages/NewsPage').then((m) => ({ default: m.NewsPage })));
const ArticleDetailPage = React.lazy(() => import('./pages/ArticleDetailPage').then((m) => ({ default: m.ArticleDetailPage })));
const SubmitProposalPage = React.lazy(() => import('./pages/SubmitProposalPage').then((m) => ({ default: m.SubmitProposalPage })));
const AuthPage = React.lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const MemberPortalPage = React.lazy(() => import('./pages/MemberPortalPage').then((m) => ({ default: m.MemberPortalPage })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
    <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading Workspace...</span>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-slate-500/20 selection:text-slate-900 relative">
      <Navbar />
      <main>
        <Hero />
        <MissionVision />
        <Projects />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteDataProvider>
        <BrowserRouter>
          <React.Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<ArticleDetailPage />} />
              <Route path="/submit-proposal" element={<SubmitProposalPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/admin/login" element={<AuthPage />} />
              <Route path="/portal" element={<MemberPortalPage />} />
              <Route path="/member-dashboard" element={<Navigate to="/portal" replace />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </SiteDataProvider>
    </AuthProvider>
  );
};

export default App;
