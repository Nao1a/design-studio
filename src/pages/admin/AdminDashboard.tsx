import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSiteData } from '../../context/SiteDataContext';
import {
  contentApi,
  projectsApi,
  teamApi,
  newsApi,
  contactApi,
  proposalApi,
  uploadApi,
  authApi,
} from '../../services/api';
import {
  LayoutDashboard,
  FileEdit,
  FolderKanban,
  Users,
  Newspaper,
  Inbox,
  Lightbulb,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Download,
  Mail,
  Box,
  FileText,
  Eye,
  RefreshCw,
  Upload,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const { refreshData: refreshSiteContext } = useSiteData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'content' | 'projects' | 'team' | 'news' | 'inquiries' | 'proposals' | 'members'
  >('overview');

  // Notification toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data states
  const [siteContent, setSiteContent] = useState<any>(null);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [teamList, setTeamList] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);
  const [proposalsList, setProposalsList] = useState<any[]>([]);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [proposalFilter, setProposalFilter] = useState<'pending' | 'reviewed' | 'all'>('pending');
  const [memberFilter, setMemberFilter] = useState<'pending' | 'reviewed' | 'all'>('pending');
  const [loadingData, setLoadingData] = useState(true);

  // Content Editor Active Subtab
  const [contentSubTab, setContentSubTab] = useState<'hero' | 'missionVision' | 'contact' | 'meta'>('hero');

  // Modals state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  // Form states for project
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Implants',
    tagline: '',
    description: '',
    extendedDescription: '',
    tags: '',
    status: 'Prototyping',
    leadInvestigator: '',
    patentId: '',
    imagePlaceholder: '',
  });

  // Form states for team member
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    title: '',
    bio: '',
    specialties: '',
    isFounder: false,
    avatar: '',
  });

  // Form states for news article
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Studio News',
    excerpt: '',
    content: '',
    tags: '',
    coverImage: '',
    isPublished: true,
  });

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [authLoading, isAdmin, navigate]);

  // Load all data
  const loadAllData = async () => {
    try {
      setLoadingData(true);
      const [
        contentRes,
        projRes,
        tmRes,
        nwsRes,
        inqRes,
        propRes,
        memRes,
      ] = await Promise.allSettled([
        contentApi.get(),
        projectsApi.getAll(),
        teamApi.getAll(),
        newsApi.getAllAdmin(),
        contactApi.getAll(),
        proposalApi.getAllAdmin(),
        authApi.getMembers(),
      ]);

      if (contentRes.status === 'fulfilled') setSiteContent(contentRes.value);
      if (projRes.status === 'fulfilled') setProjectsList(projRes.value || []);
      if (tmRes.status === 'fulfilled') setTeamList(tmRes.value || []);
      if (nwsRes.status === 'fulfilled') setNewsList(nwsRes.value || []);
      if (inqRes.status === 'fulfilled') setInquiriesList(inqRes.value || []);
      if (propRes.status === 'fulfilled') setProposalsList(propRes.value || []);
      if (memRes.status === 'fulfilled') setMembersList(memRes.value || []);
    } catch (err: any) {
      console.error('Error fetching admin data', err);
      showNotification('error', 'Failed to load dashboard data.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3500);
  };

  // Save Site Content
  const handleSaveContent = async () => {
    try {
      await contentApi.update(siteContent);
      await refreshSiteContext();
      showNotification('success', 'Homepage content updated successfully');
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to save content');
    }
  };

  // Project Handlers
  const handleOpenProjectModal = (proj: any = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        title: proj.title || '',
        category: proj.category || 'Implants',
        tagline: proj.tagline || '',
        description: proj.description || '',
        extendedDescription: proj.extendedDescription || '',
        tags: proj.tags ? proj.tags.join(', ') : '',
        status: proj.status || 'Prototyping',
        leadInvestigator: proj.leadInvestigator || '',
        patentId: proj.patentId || '',
        imagePlaceholder: proj.imagePlaceholder || '',
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: '',
        category: 'Implants',
        tagline: '',
        description: '',
        extendedDescription: '',
        tags: '',
        status: 'Prototyping',
        leadInvestigator: '',
        patentId: '',
        imagePlaceholder: '',
      });
    }
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...projectForm,
        tags: projectForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingProject) {
        await projectsApi.update(editingProject._id, payload);
        showNotification('success', 'Project updated successfully');
      } else {
        await projectsApi.create(payload);
        showNotification('success', 'New project created successfully');
      }
      setProjectModalOpen(false);
      const updated = await projectsApi.getAll();
      setProjectsList(updated);
      await refreshSiteContext();
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to save project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectsApi.delete(id);
      showNotification('success', 'Project deleted');
      setProjectsList((prev) => prev.filter((p) => p._id !== id));
      await refreshSiteContext();
    } catch (err: any) {
      showNotification('error', 'Failed to delete project');
    }
  };

  // Team Handlers
  const handleOpenTeamModal = (member: any = null) => {
    if (member) {
      setEditingMember(member);
      setTeamForm({
        name: member.name || '',
        role: member.role || '',
        title: member.title || '',
        bio: member.bio || '',
        specialties: member.specialties ? member.specialties.join(', ') : '',
        isFounder: !!member.isFounder,
        avatar: member.avatar || '',
      });
    } else {
      setEditingMember(null);
      setTeamForm({
        name: '',
        role: '',
        title: '',
        bio: '',
        specialties: '',
        isFounder: false,
        avatar: '',
      });
    }
    setTeamModalOpen(true);
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...teamForm,
        specialties: teamForm.specialties.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingMember) {
        await teamApi.update(editingMember._id, payload);
        showNotification('success', 'Team member updated');
      } else {
        await teamApi.create(payload);
        showNotification('success', 'Team member added');
      }
      setTeamModalOpen(false);
      const updated = await teamApi.getAll();
      setTeamList(updated);
      await refreshSiteContext();
    } catch (err: any) {
      showNotification('error', 'Failed to save member');
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;
    try {
      await teamApi.delete(id);
      showNotification('success', 'Member deleted');
      setTeamList((prev) => prev.filter((m) => m._id !== id));
      await refreshSiteContext();
    } catch (err: any) {
      showNotification('error', 'Failed to delete member');
    }
  };

  // News Handlers
  const handleOpenNewsModal = (article: any = null) => {
    if (article) {
      setEditingArticle(article);
      setNewsForm({
        title: article.title || '',
        category: article.category || 'Studio News',
        excerpt: article.excerpt || '',
        content: article.content || '',
        tags: article.tags ? article.tags.join(', ') : '',
        coverImage: article.coverImage || '',
        isPublished: article.isPublished !== false,
      });
    } else {
      setEditingArticle(null);
      setNewsForm({
        title: '',
        category: 'Studio News',
        excerpt: '',
        content: '',
        tags: '',
        coverImage: '',
        isPublished: true,
      });
    }
    setNewsModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newsForm,
        tags: newsForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingArticle) {
        await newsApi.update(editingArticle._id, payload);
        showNotification('success', 'Article updated');
      } else {
        await newsApi.create(payload);
        showNotification('success', 'Article published');
      }
      setNewsModalOpen(false);
      const updated = await newsApi.getAllAdmin();
      setNewsList(updated);
    } catch (err: any) {
      showNotification('error', 'Failed to save article');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await newsApi.delete(id);
      showNotification('success', 'Article removed');
      setNewsList((prev) => prev.filter((n) => n._id !== id));
    } catch (err: any) {
      showNotification('error', 'Failed to delete article');
    }
  };

  // Contact Inquiries Handlers
  const handleMarkInquiryRead = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'replied';
    try {
      await contactApi.updateStatus(id, { status: nextStatus });
      setInquiriesList((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: nextStatus } : m))
      );
      showNotification('success', `Marked as ${nextStatus}`);
    } catch (err: any) {
      showNotification('error', 'Failed to update inquiry status');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry message?')) return;
    try {
      await contactApi.delete(id);
      setInquiriesList((prev) => prev.filter((m) => m._id !== id));
      showNotification('success', 'Message deleted');
    } catch (err: any) {
      showNotification('error', 'Failed to delete message');
    }
  };

  // Proposal Status Update
  const handleUpdateProposalStatus = async (id: string, status: string, feedback: string) => {
    try {
      await proposalApi.updateStatus(id, { status, adminFeedback: feedback });
      setProposalsList((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status, adminFeedback: feedback } : p))
      );
      showNotification('success', `Proposal status updated to "${status}"`);
    } catch (err: any) {
      showNotification('error', 'Failed to update proposal status');
    }
  };

  // Member Handlers
  const handleVerifyMember = async (id: string, status: 'verified' | 'rejected' | 'pending') => {
    try {
      await authApi.verifyMember(id, { status });
      setMembersList((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status } : m))
      );
      showNotification('success', `Member status updated to "${status}"`);
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to update member status');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member account?')) return;
    try {
      await authApi.deleteMember(id);
      setMembersList((prev) => prev.filter((m) => m._id !== id));
      showNotification('success', 'Member account removed');
    } catch (err: any) {
      showNotification('error', 'Failed to delete member');
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F0F0F3] flex items-center justify-center text-slate-800">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-500" />
      </div>
    );
  }

  const unreadInquiriesCount = inquiriesList.filter((m) => m.status === 'unread').length;
  const pendingProposalsCount = proposalsList.filter(
    (p) => p.status === 'Pending Review' || p.status === 'Under Review'
  ).length;
  const pendingMembersCount = membersList.filter((m) => m.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#EBEBED] text-slate-900 p-4 sm:p-6 lg:p-8 font-sans selection:bg-slate-900 selection:text-white flex gap-5 overflow-x-hidden">
      {/* Toast Notification */}
      {notification && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.08)] text-xs font-semibold flex items-center gap-2.5 transition-all animate-fade-in"
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-slate-900" />
          ) : (
            <AlertCircle className="w-4 h-4 text-slate-700" />
          )}
          {notification.text}
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. SLIM ICON PILL COLUMN (Matching Inspo 1 & Inspo 2) */}
      {/* ========================================================= */}
      <aside className="hidden xl:flex flex-col justify-between items-center w-16 bg-[#18181B] text-slate-400 py-6 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-800/80 shrink-0 h-[calc(100vh-4rem)] sticky top-8">
        {/* Top Brand Glyph */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs">
            ✳
          </div>

          {/* Quick Icon Switchers */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`p-2.5 rounded-full transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Overview"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`p-2.5 rounded-full transition-all ${
                activeTab === 'content'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Homepage Content"
            >
              <FileEdit className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`p-2.5 rounded-full transition-all ${
                activeTab === 'projects'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Projects"
            >
              <FolderKanban className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`p-2.5 rounded-full transition-all ${
                activeTab === 'team'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Team"
            >
              <Users className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`p-2.5 rounded-full transition-all ${
                activeTab === 'news'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="News"
            >
              <Newspaper className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`p-2.5 rounded-full transition-all relative ${
                activeTab === 'inquiries'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Inquiries"
            >
              <Inbox className="w-4 h-4" />
              {unreadInquiriesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-white absolute top-1.5 right-1.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('proposals')}
              className={`p-2.5 rounded-full transition-all relative ${
                activeTab === 'proposals'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Proposals"
            >
              <Lightbulb className="w-4 h-4" />
              {pendingProposalsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-white absolute top-1.5 right-1.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`p-2.5 rounded-full transition-all relative ${
                activeTab === 'members'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Member Verifications"
            >
              <UserCheck className="w-4 h-4" />
              {pendingMembersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Gear Action */}
        <Link
          to="/"
          target="_blank"
          title="Visit Public Website"
          className="p-2.5 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </aside>

      {/* ========================================================= */}
      {/* 2. SECONDARY SIDEBAR PANEL (Matching Inspo 1 & Inspo 2) */}
      {/* ========================================================= */}
      <aside className="w-72 bg-[#F6F6F8] rounded-3xl border border-white/80 p-6 flex flex-col justify-between shrink-0 shadow-[0_8px_30px_rgba(0,0,0,0.03)] h-[calc(100vh-4rem)] sticky top-8">
        <div className="space-y-6">
          {/* macOS Traffic Lights Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E8] border border-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E8] border border-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5E5E8] border border-slate-300" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">AAU BIO-OS</span>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-slate-200/60 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs text-slate-900 truncate">{user?.name || 'Studio Administrator'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@aau.edu.et'}</p>
            </div>
          </div>

          {/* Group: Core Workspace */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Projects & Content</p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-slate-950 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </div>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                    activeTab === 'overview' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {projectsList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'content'
                    ? 'bg-slate-950 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Homepage CMS</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'projects'
                    ? 'bg-slate-950 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>R&D Projects</span>
                </div>
                <span className="text-[10px] text-slate-400">{projectsList.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('team')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'team'
                    ? 'bg-slate-950 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Founders & Team</span>
                </div>
                <span className="text-[10px] text-slate-400">{teamList.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('news')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'news'
                    ? 'bg-slate-950 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>News & Dispatches</span>
                </div>
                <span className="text-[10px] text-slate-400">{newsList.length}</span>
              </button>
            </div>
          </div>

          {/* Group: Inquiries & Activity */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Review Pipeline</p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'inquiries'
                    ? 'bg-slate-950 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Contact Inquiries</span>
                </div>
                {unreadInquiriesCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                    {unreadInquiriesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('proposals')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'proposals'
                    ? 'bg-slate-950 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Student 3D Proposals</span>
                </div>
                {pendingProposalsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                    {pendingProposalsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'members'
                    ? 'bg-slate-950 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Member Verifications</span>
                </div>
                {pendingMembersCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    {pendingMembersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-200/60 space-y-2">
          <Link
            to="/portal"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/70 transition-colors"
          >
            <span>Member Workspace</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-white/70 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 3. MAIN WORKSPACE CANVAS (Matching Inspo 1 & Inspo 2) */}
      {/* ========================================================= */}
      <main className="flex-1 bg-[#F9F9FA] rounded-3xl border border-white/80 p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] min-h-[calc(100vh-4rem)] overflow-y-auto">
        {loadingData ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 text-xs">Syncing studio database...</p>
          </div>
        ) : (
          <>
            {/* ========================================================= */}
            {/* TAB: OVERVIEW */}
            {/* ========================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-8 max-w-5xl">
                {/* Header */}
                <div>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-950 tracking-tight mb-1">
                    Dashboard
                  </h1>
                  <p className="text-sm text-slate-500 font-normal">
                    All your biomedical workflows, live projects, and clinical dispatches.
                  </p>
                </div>

                {/* Stat Cards Styled Exactly Like Inspo 1 ("Executions: 340") */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Projects</p>
                      <p className="text-4xl font-display font-bold text-slate-950 tracking-tight">{projectsList.length}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <span>See Projects</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">News & Blogs</p>
                      <p className="text-4xl font-display font-bold text-slate-950 tracking-tight">{newsList.length}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('news')}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <span>Manage Dispatches</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Inquiries</p>
                      <p className="text-4xl font-display font-bold text-slate-950 tracking-tight">{inquiriesList.length}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <span>Review Messages</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Student Proposals</p>
                      <p className="text-4xl font-display font-bold text-slate-950 tracking-tight">{proposalsList.length}</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('proposals')}
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <span>Review Submissions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Management Quick Actions Strip */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <h3 className="font-display font-semibold text-sm text-slate-900 mb-4">Workflow Actions</h3>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => {
                        setActiveTab('projects');
                        handleOpenProjectModal();
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Project
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('news');
                        handleOpenNewsModal();
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Publish Article
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('team');
                        handleOpenTeamModal();
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Team Member
                    </button>
                    <button
                      onClick={() => setActiveTab('content')}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Edit Hero & Vision
                    </button>
                  </div>
                </div>

                {/* Recent Inquiries List */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <h3 className="font-display font-semibold text-sm text-slate-900">Recent Inquiries</h3>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      View All ({inquiriesList.length})
                    </button>
                  </div>

                  {inquiriesList.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4">No contact messages received yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {inquiriesList.slice(0, 4).map((msg) => (
                        <div key={msg._id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-slate-900">{msg.name}</span>
                            <span className="text-slate-400 mx-1.5">•</span>
                            <span className="text-slate-500">{msg.email}</span>
                            <p className="text-slate-600 line-clamp-1 mt-0.5">{msg.message}</p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              msg.status === 'unread'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {msg.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: HOMEPAGE CONTENT CMS */}
            {/* ========================================================= */}
            {activeTab === 'content' && siteContent && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                  <div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                      Homepage Content CMS
                    </h2>
                    <p className="text-xs text-slate-500">
                      Update live copy for the hero, core mission, vision, and laboratory contact details.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveContent}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save All Changes
                  </button>
                </div>

                {/* Sub-tabs mirroring clean Inspo 1 & 2 pills */}
                <div className="flex items-center gap-2 pb-2">
                  {[
                    { id: 'hero', label: 'Hero & Intro' },
                    { id: 'missionVision', label: 'Vision & Mission' },
                    { id: 'contact', label: 'Contact & Cleanroom' },
                    { id: 'meta', label: 'Studio Branding' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setContentSubTab(st.id as any)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        contentSubTab === st.id
                          ? 'bg-slate-950 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* SUBTAB 1: HERO */}
                {contentSubTab === 'hero' && (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                    <h3 className="font-display font-semibold text-sm text-slate-900 pb-3 border-b border-slate-100">
                      Hero Section Copy
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Greeting Badge
                        </label>
                        <input
                          type="text"
                          value={siteContent.hero.greetingBadge || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, greetingBadge: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Clinical Badge
                        </label>
                        <input
                          type="text"
                          value={siteContent.hero.clinicalBadge || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, clinicalBadge: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Headline Start
                        </label>
                        <input
                          type="text"
                          value={siteContent.hero.headlineStart || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, headlineStart: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Headline Highlight
                        </label>
                        <input
                          type="text"
                          value={siteContent.hero.headlineHighlight || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, headlineHighlight: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Headline End
                        </label>
                        <input
                          type="text"
                          value={siteContent.hero.headlineEnd || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, headlineEnd: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Intro Narrative
                        </label>
                        <textarea
                          rows={3}
                          value={siteContent.hero.intro || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, intro: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 2: MISSION & VISION */}
                {contentSubTab === 'missionVision' && (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                    <h3 className="font-display font-semibold text-sm text-slate-900 pb-3 border-b border-slate-100">
                      Vision & Mission Content
                    </h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                            Mission Title
                          </label>
                          <input
                            type="text"
                            value={siteContent.missionVision?.mission?.title || ''}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                missionVision: {
                                  ...siteContent.missionVision,
                                  mission: { ...siteContent.missionVision.mission, title: e.target.value },
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                            Mission Subtitle
                          </label>
                          <input
                            type="text"
                            value={siteContent.missionVision?.mission?.subtitle || ''}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                missionVision: {
                                  ...siteContent.missionVision,
                                  mission: { ...siteContent.missionVision.mission, subtitle: e.target.value },
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Mission Description
                        </label>
                        <textarea
                          rows={3}
                          value={siteContent.missionVision?.mission?.description || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              missionVision: {
                                ...siteContent.missionVision,
                                mission: { ...siteContent.missionVision.mission, description: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                            Vision Title
                          </label>
                          <input
                            type="text"
                            value={siteContent.missionVision?.vision?.title || ''}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                missionVision: {
                                  ...siteContent.missionVision,
                                  vision: { ...siteContent.missionVision.vision, title: e.target.value },
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                            Vision Subtitle
                          </label>
                          <input
                            type="text"
                            value={siteContent.missionVision?.vision?.subtitle || ''}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                missionVision: {
                                  ...siteContent.missionVision,
                                  vision: { ...siteContent.missionVision.vision, subtitle: e.target.value },
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Vision Description
                        </label>
                        <textarea
                          rows={3}
                          value={siteContent.missionVision?.vision?.description || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              missionVision: {
                                ...siteContent.missionVision,
                                vision: { ...siteContent.missionVision.vision, description: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 3: CONTACT & CLEANROOM */}
                {contentSubTab === 'contact' && (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                    <h3 className="font-display font-semibold text-sm text-slate-900 pb-3 border-b border-slate-100">
                      Studio Contact & Cleanroom Location
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Studio Email
                        </label>
                        <input
                          type="email"
                          value={siteContent.contact?.email || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              contact: { ...siteContent.contact, email: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Studio Phone
                        </label>
                        <input
                          type="text"
                          value={siteContent.contact?.phone || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              contact: { ...siteContent.contact, phone: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Campus Address
                        </label>
                        <input
                          type="text"
                          value={siteContent.contact?.address || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              contact: { ...siteContent.contact, address: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Cleanroom / Lab Location
                        </label>
                        <input
                          type="text"
                          value={siteContent.contact?.labLocation || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              contact: { ...siteContent.contact, labLocation: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Office / Working Hours
                        </label>
                        <input
                          type="text"
                          value={siteContent.contact?.officeHours || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              contact: { ...siteContent.contact, officeHours: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBTAB 4: META */}
                {contentSubTab === 'meta' && (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-2xs">
                    <h3 className="font-display font-semibold text-sm text-slate-900 pb-3 border-b border-slate-100">
                      Studio Identity & Affiliation
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Studio Official Name
                        </label>
                        <input
                          type="text"
                          value={siteContent.meta?.studioName || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              meta: { ...siteContent.meta, studioName: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          University Affiliation
                        </label>
                        <input
                          type="text"
                          value={siteContent.meta?.university || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              meta: { ...siteContent.meta, university: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Studio Tagline
                        </label>
                        <input
                          type="text"
                          value={siteContent.meta?.tagline || ''}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              meta: { ...siteContent.meta, tagline: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: PROJECTS MANAGER */}
            {/* ========================================================= */}
            {activeTab === 'projects' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                  <div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                      Projects & R&D Pipelines
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage surgical implants, point-of-care diagnostics, and wearables.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenProjectModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Project</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {projectsList.map((project) => (
                    <div
                      key={project._id}
                      className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                            {project.category}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">{project.status}</span>
                        </div>
                        <h3 className="font-display font-bold text-base text-slate-900 mb-1">{project.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-3 mb-4">{project.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {project.leadInvestigator || 'Studio Team'}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenProjectModal(project)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: TEAM & MEMBERS */}
            {/* ========================================================= */}
            {activeTab === 'team' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                  <div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                      Founders & Researchers
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage laboratory researchers, engineering leads, and bios.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenTeamModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {teamList.map((member) => (
                    <div
                      key={member._id}
                      className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            {member.isFounder ? 'Founder' : 'Researcher'}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-base text-slate-900">{member.name}</h3>
                        <p className="text-xs font-semibold text-slate-700 mb-0.5">{member.role}</p>
                        <p className="text-[11px] text-slate-400 mb-3">{member.title}</p>
                        {member.bio && <p className="text-xs text-slate-500 line-clamp-3 mb-3">{member.bio}</p>}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {member.specialties ? member.specialties.join(', ') : ''}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenTeamModal(member)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeamMember(member._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: NEWS & BLOGS */}
            {/* ========================================================= */}
            {activeTab === 'news' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                  <div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                      News & Research Dispatches
                    </h2>
                    <p className="text-xs text-slate-500">
                      Publish scientific breakthroughs, clinical milestones, and studio updates.
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenNewsModal()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Write Article</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {newsList.map((article) => (
                    <div
                      key={article._id}
                      className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                            {article.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                            {article.isPublished !== false ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{article.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-3 mb-4">{article.excerpt}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to={`/news/${article._id}`}
                          target="_blank"
                          className="text-xs font-semibold text-slate-700 hover:text-black flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Dispatch
                        </Link>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenNewsModal(article)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: INQUIRIES INBOX */}
            {/* ========================================================= */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6 max-w-5xl">
                <div className="pb-6 border-b border-slate-200/80">
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    Inquiries & Contact Inbox
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live inquiries submitted via the homepage contact form, stored in MongoDB and emailed to the studio.
                  </p>
                </div>

                {inquiriesList.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                    <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">Inbox is empty</p>
                    <p className="text-[11px] text-slate-400">No contact messages received yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiriesList.map((msg) => (
                      <div
                        key={msg._id}
                        className={`bg-white rounded-3xl border p-6 shadow-2xs transition-all ${
                          msg.status === 'unread' ? 'border-slate-800 ring-1 ring-slate-800/10' : 'border-slate-200/80'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                            <span className="text-slate-400 mx-1.5">•</span>
                            <a href={`mailto:${msg.email}`} className="text-slate-600 text-xs hover:underline">
                              {msg.email}
                            </a>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase self-start sm:self-auto ${
                              msg.status === 'unread'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {msg.status}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-slate-200/60 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed mb-3">
                          {msg.message}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-slate-400">
                            {msg.emailSentToStudio ? '✓ Dispatched to Studio Email' : 'Stored in Database'}
                          </span>
                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${msg.email}?subject=Regarding your inquiry at AAU Biomedical Design Studio`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                            >
                              <Mail className="w-3 h-3" />
                              Reply via Email
                            </a>
                            <button
                              onClick={() => handleMarkInquiryRead(msg._id, msg.status)}
                              className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                            >
                              Toggle Status
                            </button>
                            <button
                              onClick={() => handleDeleteInquiry(msg._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB: STUDENT PROPOSALS REVIEW */}
            {/* ========================================================= */}
            {activeTab === 'proposals' && (() => {
              const pendingProposals = proposalsList.filter(
                (p) => p.status === 'Pending Review' || p.status === 'Under Review'
              );
              const reviewedProposals = proposalsList.filter(
                (p) => p.status === 'Approved' || p.status === 'Needs Revision' || p.status === 'Rejected'
              );
              const filteredProposals =
                proposalFilter === 'pending'
                  ? pendingProposals
                  : proposalFilter === 'reviewed'
                  ? reviewedProposals
                  : proposalsList;

              return (
                <div className="space-y-6 max-w-5xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                    <div>
                      <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                        Student Ideas & 3D Project Submissions
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Review submitted proposals, inspect attached CAD 3D models and concept documents.
                      </p>
                    </div>

                    {/* Filter Tabs: Needs Review / Reviewed / All */}
                    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs self-start sm:self-auto">
                      <button
                        onClick={() => setProposalFilter('pending')}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                          proposalFilter === 'pending'
                            ? 'bg-slate-950 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Needs Review</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            proposalFilter === 'pending'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {pendingProposals.length}
                        </span>
                      </button>

                      <button
                        onClick={() => setProposalFilter('reviewed')}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                          proposalFilter === 'reviewed'
                            ? 'bg-slate-950 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Reviewed</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            proposalFilter === 'reviewed'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {reviewedProposals.length}
                        </span>
                      </button>

                      <button
                        onClick={() => setProposalFilter('all')}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                          proposalFilter === 'all'
                            ? 'bg-slate-950 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All ({proposalsList.length})
                      </button>
                    </div>
                  </div>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Total Submissions
                      </span>
                      <span className="text-2xl font-bold font-display text-slate-900">{proposalsList.length}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
                        Awaiting Review
                      </span>
                      <span className="text-2xl font-bold font-display text-amber-600">{pendingProposals.length}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                        Reviewed & Decisioned
                      </span>
                      <span className="text-2xl font-bold font-display text-emerald-600">{reviewedProposals.length}</span>
                    </div>
                  </div>

                  {filteredProposals.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                      <Lightbulb className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700">
                        {proposalFilter === 'pending'
                          ? 'All caught up! No proposals awaiting review.'
                          : proposalFilter === 'reviewed'
                          ? 'No proposals have been reviewed yet.'
                          : 'No proposals submitted yet'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 mb-4">
                        {proposalFilter === 'pending'
                          ? 'Reviewed proposals automatically move to the "Reviewed" tab.'
                          : 'Proposals reviewed from the "Needs Review" tab will appear here.'}
                      </p>
                      <Link
                        to="/portal"
                        target="_blank"
                        className="px-4 py-2 rounded-full bg-slate-950 text-white text-xs font-semibold inline-block"
                      >
                        Visit Member Workspace
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProposals.map((proposal) => (
                      <div
                        key={proposal._id}
                        className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                                {proposal.category}
                              </span>
                              <span className="text-xs text-slate-400">
                                {proposal.studentName} ({proposal.studentEmail})
                              </span>
                            </div>
                            <h3 className="font-display font-bold text-base text-slate-900">{proposal.title}</h3>
                          </div>

                          <select
                            value={proposal.status}
                            onChange={(e) =>
                              handleUpdateProposalStatus(proposal._id, e.target.value, proposal.adminFeedback || '')
                            }
                            className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-200 bg-white text-slate-800 outline-none"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Needs Revision">Needs Revision</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>

                        {/* Concept & Problem */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-slate-200/60">
                            <p className="font-bold text-slate-700 uppercase tracking-wider mb-1">Clinical Problem:</p>
                            <p className="text-slate-600 leading-relaxed">{proposal.clinicalProblem}</p>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-slate-200/60">
                            <p className="font-bold text-slate-700 uppercase tracking-wider mb-1">Proposed Solution:</p>
                            <p className="text-slate-600 leading-relaxed">{proposal.proposedSolution}</p>
                          </div>
                        </div>

                        {/* Files and CAD models */}
                        {proposal.files && proposal.files.length > 0 && (
                          <div className="pt-1">
                            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                              Attached 3D Models & Files ({proposal.files.length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {proposal.files.map((file: any, fIdx: number) => (
                                <a
                                  key={fIdx}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200 transition-colors"
                                >
                                  {file.fileType === '3d-model' ? (
                                    <Box className="w-3.5 h-3.5 text-slate-700" />
                                  ) : (
                                    <FileText className="w-3.5 h-3.5 text-slate-700" />
                                  )}
                                  <span>{file.originalName}</span>
                                  <Download className="w-3 h-3 text-slate-400 ml-1" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Student Revision Notes if any */}
                        {proposal.revisionNotes && (
                          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs">
                            <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px] block mb-1">
                              Student's Latest Revision Note:
                            </span>
                            <p className="text-amber-950 leading-relaxed italic">{proposal.revisionNotes}</p>
                          </div>
                        )}

                        {/* Admin Feedback Input with Explicit Save */}
                        <div className="pt-3 border-t border-slate-100">
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Faculty Improvement Recommendations & Reviewer Notes:
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              id={`feedback-input-${proposal._id}`}
                              type="text"
                              placeholder="Write instructions on how to improve this proposal or approval notes..."
                              defaultValue={proposal.adminFeedback || ''}
                              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById(`feedback-input-${proposal._id}`) as HTMLInputElement;
                                if (input) {
                                  handleUpdateProposalStatus(proposal._id, proposal.status, input.value);
                                }
                              }}
                              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-black text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors shadow-2xs"
                            >
                              Save Feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

            {/* ========================================================= */}
            {/* TAB: MEMBERS & VERIFICATION MANAGEMENT */}
            {/* ========================================================= */}
            {activeTab === 'members' && (
              <div className="space-y-6 max-w-5xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                  <div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                      Studio Members & Verification Board
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Verify student & faculty accounts before they can log in, access cleanroom facilities, and submit proposals.
                    </p>
                  </div>

                  {/* Filter Pills: Pending / Reviewed / All */}
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs self-start sm:self-auto">
                    <button
                      onClick={() => setMemberFilter('pending')}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        memberFilter === 'pending'
                          ? 'bg-slate-950 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Pending Applications</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          memberFilter === 'pending'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {pendingMembersCount}
                      </span>
                    </button>

                    <button
                      onClick={() => setMemberFilter('reviewed')}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                        memberFilter === 'reviewed'
                          ? 'bg-slate-950 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Reviewed</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          memberFilter === 'reviewed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {membersList.filter((m) => m.status === 'verified' || m.status === 'rejected').length}
                      </span>
                    </button>

                    <button
                      onClick={() => setMemberFilter('all')}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                        memberFilter === 'all'
                          ? 'bg-slate-950 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({membersList.length})
                    </button>
                  </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Total Registered
                    </span>
                    <span className="text-2xl font-bold font-display text-slate-900">{membersList.length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
                      Pending Approvals
                    </span>
                    <span className="text-2xl font-bold font-display text-amber-600">{pendingMembersCount}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                      Reviewed Applications
                    </span>
                    <span className="text-2xl font-bold font-display text-emerald-600">
                      {membersList.filter((m) => m.status === 'verified' || m.status === 'rejected').length}
                    </span>
                  </div>
                </div>

                {/* Members List */}
                {(() => {
                  const pendingMembers = membersList.filter((m) => m.status === 'pending');
                  const reviewedMembers = membersList.filter(
                    (m) => m.status === 'verified' || m.status === 'rejected'
                  );
                  const filtered =
                    memberFilter === 'pending'
                      ? pendingMembers
                      : memberFilter === 'reviewed'
                      ? reviewedMembers
                      : membersList;

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                        <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-700">No members found</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {memberFilter === 'pending'
                            ? 'All caught up! No member applications currently pending approval.'
                            : memberFilter === 'reviewed'
                            ? 'No member applications have been reviewed yet.'
                            : 'No members registered yet.'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {filtered.map((member) => (
                        <div
                          key={member._id}
                          className={`bg-white rounded-3xl border p-6 shadow-2xs space-y-4 transition-all ${
                            member.status === 'pending'
                              ? 'border-amber-300/80 ring-1 ring-amber-300/30'
                              : 'border-slate-200/80'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-display font-bold text-base text-slate-900">
                                  {member.name}
                                </span>
                                <span className="text-slate-400">•</span>
                                <a
                                  href={`mailto:${member.email}`}
                                  className="text-xs text-slate-600 hover:text-slate-900 hover:underline"
                                >
                                  {member.email}
                                </a>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                Registered on {new Date(member.createdAt).toLocaleString()}
                              </p>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex items-center gap-2">
                              {member.status === 'verified' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Verified Member
                                </span>
                              )}
                              {member.status === 'pending' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                  <Clock className="w-3.5 h-3.5" />
                                  Pending Verification
                                </span>
                              )}
                              {member.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Rejected
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Member Meta Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                Member ID Number
                              </span>
                              <span className="font-mono font-bold text-slate-900">
                                {member.studentId || 'Not provided'}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                                Registered Email
                              </span>
                              <span className="font-medium text-slate-800">
                                {member.email}
                              </span>
                            </div>
                          </div>

                          {member.bio && (
                            <div className="p-3 rounded-xl bg-[#FBFBFC] border border-slate-100 text-xs text-slate-600">
                              <strong className="text-slate-700 block text-[10px] uppercase tracking-wider mb-0.5">
                                Research Goals & Interest:
                              </strong>
                              <p>{member.bio}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              {member.status !== 'verified' && (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyMember(member._id, 'verified')}
                                  className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  <span>Approve & Verify Account</span>
                                </button>
                              )}

                              {member.status !== 'rejected' && (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyMember(member._id, 'rejected')}
                                  className="px-3.5 py-1.5 rounded-full border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              )}

                              {member.status !== 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyMember(member._id, 'pending')}
                                  className="px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Reset to Pending
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteMember(member._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Member Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: PROJECT ADD/EDIT */}
      {/* ========================================================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4 pb-3 border-b border-slate-100">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <option value="Implants">Implants</option>
                    <option value="Diagnostics">Diagnostics</option>
                    <option value="Surgical">Surgical</option>
                    <option value="Wearables">Wearables</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Clinical Status
                  </label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <option value="Prototyping">Prototyping</option>
                    <option value="In Vivo Testing">In Vivo Testing</option>
                    <option value="Clinical Trial Phase II">Clinical Trial Phase II</option>
                    <option value="FDA Review">FDA Review</option>
                    <option value="Patent Pending">Patent Pending</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={projectForm.tagline}
                    onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Summary Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Extended Technical Description
                  </label>
                  <textarea
                    rows={3}
                    value={projectForm.extendedDescription}
                    onChange={(e) => setProjectForm({ ...projectForm, extendedDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Lead Investigator
                  </label>
                  <input
                    type="text"
                    value={projectForm.leadInvestigator}
                    onChange={(e) => setProjectForm({ ...projectForm, leadInvestigator: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Patent ID (optional)
                  </label>
                  <input
                    type="text"
                    value={projectForm.patentId}
                    onChange={(e) => setProjectForm({ ...projectForm, patentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    placeholder="e.g. Neural Engineering, Titanium, Telemetry"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Image URL or Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={projectForm.imagePlaceholder}
                      onChange={(e) => setProjectForm({ ...projectForm, imagePlaceholder: e.target.value })}
                      placeholder="https://... or upload local image"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      Upload
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const res = await uploadApi.uploadFile(e.target.files[0]);
                            setProjectForm({ ...projectForm, imagePlaceholder: res.url });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-black"
                >
                  {editingProject ? 'Save Updates' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TEAM MEMBER ADD/EDIT */}
      {/* ========================================================= */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4 pb-3 border-b border-slate-100">
              {editingMember ? 'Edit Team Member' : 'Add Team Member'}
            </h3>

            <form onSubmit={handleSaveTeamMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Role in Studio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Co-Founder & Chief Engineer"
                  value={teamForm.role}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Title & Degrees *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MSc, Mechanical Engineering"
                  value={teamForm.title}
                  onChange={(e) => setTeamForm({ ...teamForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={3}
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Specialties (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Microfluidics, CAD/CAM, Biocompatibility"
                  value={teamForm.specialties}
                  onChange={(e) => setTeamForm({ ...teamForm, specialties: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="founderCheck"
                  checked={teamForm.isFounder}
                  onChange={(e) => setTeamForm({ ...teamForm, isFounder: e.target.checked })}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-800"
                />
                <label htmlFor="founderCheck" className="text-xs font-semibold text-slate-700">
                  Mark as Founder
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTeamModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-black"
                >
                  {editingMember ? 'Save Updates' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NEWS/BLOG ARTICLE ADD/EDIT */}
      {/* ========================================================= */}
      {newsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4 pb-3 border-b border-slate-100">
              {editingArticle ? 'Edit Article' : 'Write New Article'}
            </h3>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <option value="Studio News">Studio News</option>
                    <option value="Research">Research</option>
                    <option value="Clinical Trials">Clinical Trials</option>
                    <option value="Awards & Grants">Awards & Grants</option>
                    <option value="Student Spotlights">Student Spotlights</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={newsForm.coverImage}
                    onChange={(e) => setNewsForm({ ...newsForm, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Short Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of the article..."
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Content (Supports Markdown & Paragraphs) *
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write the article content..."
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Surgery, Diagnostics, Addis Ababa"
                  value={newsForm.tags}
                  onChange={(e) => setNewsForm({ ...newsForm, tags: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishCheck"
                  checked={newsForm.isPublished}
                  onChange={(e) => setNewsForm({ ...newsForm, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-800"
                />
                <label htmlFor="publishCheck" className="text-xs font-semibold text-slate-700">
                  Publish to Public Dispatches & News page
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-black"
                >
                  {editingArticle ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
