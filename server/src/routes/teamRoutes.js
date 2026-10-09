import express from 'express';
import { TeamMember } from '../models/TeamMember.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/team
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/team
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    const saved = await member.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route PUT /api/team/:id
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const updated = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Team member not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route DELETE /api/team/:id
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Team member not found' });
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
