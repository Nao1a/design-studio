import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X } from 'lucide-react';
import { TeamMember } from '../data/content';
import { useSiteData } from '../context/SiteDataContext';

/** Get initials from a name */
const getInitials = (name: string) => {
  const parts = name.replace(/^(Eng\.|Dr\.|Prof\.) /, '').split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

/** Founder card — clean, premium */
const FounderCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100"
    >
      <div className="flex items-start gap-4">
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-white tracking-wide">{getInitials(member.name)}</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-[15px] text-slate-900 leading-tight">{member.name}</h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">{member.role}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{member.title}</p>
        </div>
      </div>
      {member.bio && (
        <p className="text-[13px] text-slate-500 leading-relaxed mt-4 line-clamp-2">{member.bio}</p>
      )}
      <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-sky-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  );
};

/** Expanded member detail overlay */
const MemberDetail: React.FC<{ member: TeamMember; onClose: () => void }> = ({ member, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 relative"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-4">
        {member.avatar ? (
          <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center">
            <User className="w-6 h-6 text-slate-400" />
          </div>
        )}
        <div>
          <h4 className="font-display font-bold text-lg text-slate-900">{member.name}</h4>
          <p className="text-sm text-slate-500">{member.role}</p>
          <p className="text-xs text-slate-400 mt-0.5">{member.title}</p>
        </div>
      </div>

      {member.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {member.specialties.map((s) => (
            <span key={s} className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100/80">
              {s}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const Team: React.FC = () => {
  const { siteContent, teamMembers } = useSiteData();
  const founders = teamMembers.filter((m) => m.isFounder);
  const members = teamMembers.filter((m) => !m.isFounder);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedMember = members.find((m) => m.id === selectedId) || null;

  return (
    <section id="team" className="relative py-20 lg:py-28 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 mb-4 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              {siteContent.team?.badge || 'The People Behind the Innovation'}
            </p>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.04 }}
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4"
          >
            {siteContent.team?.headline || 'Meet the Team & Founders'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            {siteContent.team?.subheadline || 'A multidisciplinary collective of biomedical engineers.'}
          </motion.p>
        </div>

        {/* Founders — 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {founders.map((member, idx) => (
            <FounderCard key={member.id} member={member} index={idx} />
          ))}
        </div>

        {/* Student Members — just names */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h3 className="font-display font-semibold text-base text-slate-700">Student Members</h3>
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-medium text-slate-400">{members.length}</span>
          </div>

          <div className="flex flex-wrap gap-x-1 gap-y-0.5">
            {members.map((member, idx) => {
              const isSelected = selectedId === member.id;
              return (
                <motion.button
                  key={member.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  onClick={() => setSelectedId(isSelected ? null : member.id)}
                  className={`text-sm font-medium px-2 py-1 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'text-slate-900 bg-slate-100'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {member.name}{idx < members.length - 1 ? ',' : ''}
                </motion.button>
              );
            })}
          </div>

          {/* Expanded detail */}
          <AnimatePresence mode="wait">
            {selectedMember && (
              <MemberDetail
                key={selectedMember.id}
                member={selectedMember}
                onClose={() => setSelectedId(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
