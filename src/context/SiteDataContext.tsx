import React, { createContext, useContext, useState, useEffect } from 'react';
import { content as defaultContent, SiteContent, Project, TeamMember } from '../data/content';
import { contentApi, projectsApi, teamApi } from '../services/api';

interface SiteDataContextType {
  siteContent: SiteContent;
  projects: Project[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextType>({
  siteContent: defaultContent,
  projects: defaultContent.projects.items,
  teamMembers: defaultContent.team.members,
  isLoading: false,
  refreshData: async () => {},
});

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);
  const [projects, setProjects] = useState<Project[]>(defaultContent.projects.items);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultContent.team.members);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [fetchedContent, fetchedProjects, fetchedTeam] = await Promise.allSettled([
        contentApi.get(),
        projectsApi.getAll(),
        teamApi.getAll(),
      ]);

      if (fetchedContent.status === 'fulfilled' && fetchedContent.value) {
        setSiteContent((prev) => ({
          ...prev,
          ...fetchedContent.value,
          meta: fetchedContent.value.meta || prev.meta,
          hero: fetchedContent.value.hero || prev.hero,
          missionVision: fetchedContent.value.missionVision || prev.missionVision,
          achievements: fetchedContent.value.achievements || prev.achievements,
          contact: fetchedContent.value.contact || prev.contact,
          footer: fetchedContent.value.footer || prev.footer,
        }));
      }

      if (fetchedProjects.status === 'fulfilled' && Array.isArray(fetchedProjects.value) && fetchedProjects.value.length > 0) {
        // Map MongoDB projects into frontend Project format if needed
        const mappedProjects: Project[] = fetchedProjects.value.map((p: any) => ({
          id: p._id || p.id,
          title: p.title,
          category: p.category,
          tagline: p.tagline || '',
          description: p.description,
          extendedDescription: p.extendedDescription || p.description,
          tags: p.tags || [],
          metrics: p.metrics || [],
          status: p.status,
          imagePlaceholder: p.imagePlaceholder || '',
          gradient: p.gradient || 'from-sky-500/10 via-blue-500/5 to-transparent',
          patentId: p.patentId,
          leadInvestigator: p.leadInvestigator || '',
        }));
        setProjects(mappedProjects);
      }

      if (fetchedTeam.status === 'fulfilled' && Array.isArray(fetchedTeam.value) && fetchedTeam.value.length > 0) {
        const mappedTeam: TeamMember[] = fetchedTeam.value.map((m: any) => ({
          id: m._id || m.id,
          name: m.name,
          role: m.role,
          title: m.title,
          bio: m.bio || '',
          specialties: m.specialties || [],
          isFounder: !!m.isFounder,
          avatar: m.avatar || '',
        }));
        setTeamMembers(mappedTeam);
      }
    } catch (err) {
      console.warn('[SiteData] Using default static content fallback due to connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SiteDataContext.Provider
      value={{
        siteContent,
        projects,
        teamMembers,
        isLoading,
        refreshData: fetchData,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => useContext(SiteDataContext);
