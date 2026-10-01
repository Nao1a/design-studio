import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MissionVision } from './components/MissionVision';
import { Projects } from './components/Projects';
import { Achievements } from './components/Achievements';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fbfcfd] text-slate-900 selection:bg-sky-500/20 selection:text-sky-900 relative">
      {/* Sticky Minimal Navigation */}
      <Navbar />

      <main>
        {/* Section 1: Hero with 3D Background */}
        <Hero />

        {/* Section 2: Mission & Vision */}
        <MissionVision />

        {/* Section 3: What We're Working On (Projects) */}
        <Projects />

        {/* Section 4: Achievements & Timeline */}
        <Achievements />

        {/* Section 5: Contact & Inquiries */}
        <Contact />
      </main>

      {/* Minimal Footer */}
      <Footer />
    </div>
  );
};

export default App;
