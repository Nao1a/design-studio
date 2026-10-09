import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { proposalApi, uploadApi } from '../services/api';
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Box,
  Download,
  Plus,
  Send,
  UploadCloud,
  LogOut,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Edit3,
} from 'lucide-react';
import studioLogo from '../assets/logo.jpeg';

export const MemberPortalPage: React.FC = () => {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'proposals' | 'submit'>('proposals');

  // Proposal list state
  const [proposals, setProposals] = useState<any[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Proposal Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Implants',
    clinicalProblem: '',
    proposedSolution: '',
    budgetEstimate: '',
    teamMembers: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Revision Modal State
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [activeRevisionProposal, setActiveRevisionProposal] = useState<any>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [revisedSolution, setRevisedSolution] = useState('');
  const [isSavingRevision, setIsSavingRevision] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load member's proposals
  const loadProposals = async () => {
    try {
      setLoadingProposals(true);
      const data = await proposalApi.getMyProposals();
      setProposals(data);
    } catch (err: any) {
      console.error('Failed to load proposals', err);
      showNotification('error', 'Could not load your proposals.');
    } finally {
      setLoadingProposals(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProposals();
    }
  }, [user]);

  // Handle File Uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filesArray = Array.from(e.target.files);

    try {
      setIsUploading(true);
      const uploaded = await uploadApi.uploadMultiple(filesArray);
      setUploadedFiles((prev) => [...prev, ...uploaded]);
      showNotification('success', `${filesArray.length} file(s) attached successfully.`);
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'File upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };


  // Handle Submit New Proposal
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const payload = {
        title: formData.title,
        category: formData.category,
        clinicalProblem: formData.clinicalProblem,
        proposedSolution: formData.proposedSolution,
        budgetEstimate: formData.budgetEstimate,
        requestedResources: [] as string[],
        studentName: user?.name,
        studentEmail: user?.email,
        studentDepartment: user?.department,
        studentIdNumber: user?.studentId,
        studentPhone: user?.phone,
        teamMembers: formData.teamMembers
          ? formData.teamMembers.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        files: uploadedFiles,
      };

      await proposalApi.submit(payload);
      showNotification('success', 'Project concept submitted successfully for faculty review!');

      // Reset form
      setFormData({
        title: '',
        category: 'Implants',
        clinicalProblem: '',
        proposedSolution: '',
        budgetEstimate: '',
        teamMembers: '',
      });
      setUploadedFiles([]);

      // Reload and switch to proposals tab
      await loadProposals();
      setActiveTab('proposals');
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to submit proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Revision Modal
  const openRevisionModal = (proposal: any) => {
    setActiveRevisionProposal(proposal);
    setRevisedSolution(proposal.proposedSolution || '');
    setRevisionNotes(proposal.revisionNotes || '');
    setRevisionModalOpen(true);
  };

  // Save Revision
  const handleSaveRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRevisionProposal) return;

    try {
      setIsSavingRevision(true);
      await proposalApi.revise(activeRevisionProposal._id, {
        proposedSolution: revisedSolution,
        revisionNotes: revisionNotes,
      });

      showNotification('success', 'Proposal revision submitted to faculty for re-evaluation!');
      setRevisionModalOpen(false);
      setActiveRevisionProposal(null);
      await loadProposals();
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to submit revision');
    } finally {
      setIsSavingRevision(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved for Studio Prototyping
          </span>
        );
      case 'Needs Revision':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Faculty Revision Requested
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
            Under Faculty Review
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Not Accepted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Pending Review
          </span>
        );
    }
  };


  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
            notification.type === 'success'
              ? 'bg-slate-950 text-white border-slate-800'
              : 'bg-rose-600 text-white border-rose-700'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-200" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-xs bg-white">
                <img src={studioLogo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                  AAU Biomedical Design Studio
                </span>
                <p className="text-[11px] font-medium text-slate-500">Member Research Portal</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Member Profile Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-900">{user?.name}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 text-[11px]">{user?.department || 'Biomedical'}</span>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
              >
                Admin Panel
              </Link>
            )}

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Hero */}
      <div className="bg-white border-b border-slate-200/80 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Studio Member • Prototyping Privileges Active
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Welcome back, {user?.name?.split(' ')[0]}
              </h1>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => setActiveTab('submit')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit New Project Concept</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-2 mt-8 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('proposals')}
              className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'proposals'
                  ? 'border-slate-900 text-slate-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Project Proposals ({proposals.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('submit')}
              className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'submit'
                  ? 'border-slate-900 text-slate-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Submit Concept</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================= */}
        {/* TAB 1: MY PROPOSALS */}
        {/* ========================================================= */}
        {activeTab === 'proposals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900">
                  Track Submissions & Faculty Evaluation
                </h2>
                <p className="text-xs text-slate-500">
                  Review the real-time status of your proposals and read recommendations from studio directors.
                </p>
              </div>

              <button
                onClick={loadProposals}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer shadow-2xs"
              >
                <RefreshCw className={`w-3 h-3 ${loadingProposals ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {loadingProposals ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                <RefreshCw className="w-6 h-6 text-slate-400 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Loading your submissions...</p>
              </div>
            ) : proposals.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                    No Project Proposals Submitted Yet
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    As a verified studio member, you have full privileges to submit biomedical device concepts, CAD 3D models, and request prototyping resources.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="px-5 py-2.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  Draft Your First Proposal →
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {proposals.map((proposal) => (
                  <div
                    key={proposal._id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                            {proposal.category}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Submitted on {new Date(proposal.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                          {proposal.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {getStatusBadge(proposal.status)}
                      </div>
                    </div>

                    {/* Problem & Solution Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-slate-200/70">
                        <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                          Clinical Problem / Target Pathology:
                        </p>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {proposal.clinicalProblem}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FBFBFC] border border-slate-200/70">
                        <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
                          Proposed Engineering Solution:
                        </p>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {proposal.proposedSolution}
                        </p>
                      </div>
                    </div>

                    {/* Requested Studio Resources */}
                    {proposal.requestedResources && proposal.requestedResources.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Requested Studio Prototyping Hardware:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {proposal.requestedResources.map((res: string, rIdx: number) => (
                            <span
                              key={rIdx}
                              className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200"
                            >
                              • {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attached Files & 3D Models */}
                    {proposal.files && proposal.files.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Attached CAD Models & Specification Documents ({proposal.files.length}):
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

                    {/* FACULTY FEEDBACK & IMPROVEMENT NOTES */}
                    {proposal.adminFeedback ? (
                      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/90 text-xs">
                        <div className="flex items-start gap-2.5">
                          <MessageSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-bold text-amber-900 uppercase tracking-wider text-[11px] mb-1">
                              Faculty Evaluation & Improvement Notes:
                            </p>
                            <p className="text-amber-950 font-normal leading-relaxed whitespace-pre-wrap">
                              "{proposal.adminFeedback}"
                            </p>

                            {proposal.status === 'Needs Revision' && (
                              <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                                <span className="text-[11px] text-amber-800 font-medium">
                                  Action Required: Revise your concept according to the feedback above.
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openRevisionModal(proposal)}
                                  className="px-3.5 py-1.5 rounded-full bg-amber-900 text-white text-xs font-semibold hover:bg-amber-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Update & Resubmit Revision</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Awaiting faculty review notes. You will see recommendations here once reviewed.</span>
                      </div>
                    )}

                    {/* Member's Revision Notes (if previously revised) */}
                    {proposal.revisionNotes && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                        <strong className="text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">
                          Your Last Revision Note to Faculty:
                        </strong>
                        <p className="italic">{proposal.revisionNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SUBMIT NEW PROJECT IDEA */}
        {/* ========================================================= */}
        {activeTab === 'submit' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
            <div className="mb-8 pb-6 border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3 h-3 text-slate-700" />
                Verified Member Submission Pipeline
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Submit a Biomedical Device Concept
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Provide your clinical challenge, technical mechanism, and specify the physical studio resources required to prototype it.
              </p>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-6">
              {/* Member Info Pre-Filled */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Investigator</span>
                  <span className="font-semibold text-slate-900">{user?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Institutional Email</span>
                  <span className="font-semibold text-slate-900">{user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Member ID Number</span>
                  <span className="font-semibold text-slate-900">
                    {user?.studentId || 'ID Verified'}
                  </span>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Project / Device Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Compliant Neural Cuff Electrode Array"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                  >
                    <option value="Implants">Implants</option>
                    <option value="Diagnostics">Diagnostics</option>
                    <option value="Surgical">Surgical</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Clinical Problem */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Clinical Problem & Medical Need *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the medical condition, current surgical limitations, or diagnostic hurdle this project tackles..."
                  value={formData.clinicalProblem}
                  onChange={(e) => setFormData({ ...formData, clinicalProblem: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800 leading-relaxed"
                />
              </div>

              {/* Proposed Solution */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Proposed Engineering Solution & Working Principle *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your engineering approach, materials (Titanium, PEEK, PDMS, silicone), sensors, circuits, or micro-fluidic channels..."
                  value={formData.proposedSolution}
                  onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800 leading-relaxed"
                />
              </div>

              {/* Team Members & Budget Estimate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Co-Investigators / Student Team (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aster Tadesse, Dawit Bekele"
                    value={formData.teamMembers}
                    onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estimated Prototyping Budget (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15,000 ETB or Studio stock material"
                    value={formData.budgetEstimate}
                    onChange={(e) => setFormData({ ...formData, budgetEstimate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* CAD 3D Models & Document Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Attach CAD 3D Models & Project Documents
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/70 hover:bg-slate-50 transition-colors">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-800">
                    Upload SolidWorks (.SLDPRT, .SLDASM, .SLDDRW), STEP, STL, OBJ, CAD files, PDFs, or any technical documents
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    All file formats supported (up to 250MB per file, up to 20 files).
                  </p>
                  <label className="inline-block mt-3 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer shadow-xs">
                    {isUploading ? 'Uploading files...' : 'Browse Local Files'}
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Attached Files ({uploadedFiles.length}):
                    </p>
                    {uploadedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {f.fileType === '3d-model' ? (
                            <Box className="w-4 h-4 text-slate-700" />
                          ) : (
                            <FileText className="w-4 h-4 text-slate-700" />
                          )}
                          <span className="font-medium text-slate-800">{f.originalName}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('proposals')}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Proposal...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Faculty Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: REVISE PROPOSAL */}
      {/* ========================================================= */}
      {revisionModalOpen && activeRevisionProposal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="pb-4 mb-4 border-b border-slate-100 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Addressing Faculty Recommendations
                </span>
                <h3 className="font-display font-bold text-xl text-slate-900">
                  Revise: {activeRevisionProposal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRevisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Display Reviewer's Feedback */}
            {activeRevisionProposal.adminFeedback && (
              <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <p className="font-bold uppercase tracking-wider text-[11px] mb-1">
                  Faculty Reviewer's Notes:
                </p>
                <p className="leading-relaxed whitespace-pre-wrap">
                  "{activeRevisionProposal.adminFeedback}"
                </p>
              </div>
            )}

            <form onSubmit={handleSaveRevision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Updated Engineering Solution / Revisions *
                </label>
                <textarea
                  rows={5}
                  required
                  value={revisedSolution}
                  onChange={(e) => setRevisedSolution(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Note to Reviewer (How you addressed the feedback) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain what changes were made in response to faculty recommendations..."
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800 leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingRevision}
                  className="px-5 py-2 rounded-full bg-slate-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSavingRevision ? 'Submitting Revisions...' : 'Submit Revisions for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPortalPage;
