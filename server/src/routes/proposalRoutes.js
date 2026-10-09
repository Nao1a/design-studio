import express from 'express';
import { Proposal } from '../models/Proposal.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route POST /api/proposals
// @desc  Submit member project idea / concept (Verified members only)
router.post('/', protect, async (req, res) => {
  try {
    // Only verified members or admins can submit proposals
    if (req.user.role === 'member' && req.user.status !== 'verified') {
      return res.status(403).json({
        message: 'Your member account is pending admin verification. Only verified members can submit project concepts.',
      });
    }

    const {
      title,
      category,
      summary,
      clinicalProblem,
      proposedSolution,
      budgetEstimate,
      requestedResources,
      studentName,
      studentEmail,
      studentDepartment,
      studentIdNumber,
      studentPhone,
      teamMembers,
      files,
    } = req.body;

    if (!title || !clinicalProblem || !proposedSolution) {
      return res.status(400).json({ message: 'Title, clinical problem, and proposed solution are required.' });
    }

    const proposal = new Proposal({
      member: req.user._id,
      title: title.trim(),
      category: category || 'Implants',
      summary: summary || clinicalProblem.substring(0, 160),
      clinicalProblem,
      proposedSolution,
      budgetEstimate: budgetEstimate || '',
      requestedResources: Array.isArray(requestedResources) ? requestedResources : [],
      studentName: studentName || req.user.name,
      studentEmail: studentEmail || req.user.email,
      studentDepartment: studentDepartment || req.user.department || 'Biomedical Engineering',
      studentIdNumber: studentIdNumber || req.user.studentId || '',
      studentPhone: studentPhone || req.user.phone || '',
      teamMembers: Array.isArray(teamMembers) ? teamMembers : (teamMembers ? [teamMembers] : []),
      files: files || [],
      status: 'Pending Review',
    });

    const saved = await proposal.save();
    res.status(201).json({
      success: true,
      message: 'Project proposal submitted successfully for studio faculty review.',
      proposal: saved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/proposals
// @desc  Get all proposals (Admin review pipeline)
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate('member', 'name email department studentId phone status')
      .sort({ createdAt: -1 })
      .lean();
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/proposals/my
// @desc  Get member's own proposals
router.get('/my', protect, async (req, res) => {
  try {
    const proposals = await Proposal.find({
      $or: [
        { member: req.user._id },
        { studentEmail: req.user.email.toLowerCase() },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PATCH /api/proposals/:id/revise
// @desc  Member update or respond to feedback
router.patch('/:id/revise', protect, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Ensure only the author can revise
    if (
      req.user.role !== 'admin' &&
      proposal.member &&
      proposal.member.toString() !== req.user._id.toString() &&
      proposal.studentEmail.toLowerCase() !== req.user.email.toLowerCase()
    ) {
      return res.status(403).json({ message: 'Not authorized to edit this proposal' });
    }

    const {
      title,
      category,
      clinicalProblem,
      proposedSolution,
      budgetEstimate,
      requestedResources,
      revisionNotes,
      files,
    } = req.body;

    if (title) proposal.title = title;
    if (category) proposal.category = category;
    if (clinicalProblem) proposal.clinicalProblem = clinicalProblem;
    if (proposedSolution) proposal.proposedSolution = proposedSolution;
    if (budgetEstimate !== undefined) proposal.budgetEstimate = budgetEstimate;
    if (requestedResources) proposal.requestedResources = requestedResources;
    if (files) proposal.files = files;
    if (revisionNotes) proposal.revisionNotes = revisionNotes;

    // If it was in "Needs Revision", resetting status to "Under Review" lets faculty know it was updated
    if (proposal.status === 'Needs Revision') {
      proposal.status = 'Under Review';
    }

    const updated = await proposal.save();
    res.json({
      success: true,
      message: 'Proposal revisions saved successfully.',
      proposal: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PATCH /api/proposals/:id
// @desc  Admin update status and feedback
router.patch('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const { status, adminFeedback } = req.body;
    const updated = await Proposal.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(adminFeedback !== undefined && { adminFeedback }),
      },
      { new: true }
    ).populate('member', 'name email department studentId phone status');

    if (!updated) return res.status(404).json({ message: 'Proposal not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/proposals/:id
// @desc  Admin delete proposal
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const deleted = await Proposal.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Proposal not found' });
    res.json({ success: true, message: 'Proposal deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
