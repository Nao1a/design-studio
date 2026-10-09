import express from 'express';
import { SiteContent } from '../models/SiteContent.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/content
// @desc  Get site content (public)
router.get('/', async (req, res) => {
  try {
    let content = await SiteContent.findOne().lean();
    if (!content) {
      content = await SiteContent.create({});
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PUT /api/content
// @desc  Update site content (admin only)
router.put('/', protect, requireAdmin, async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) {
      content = new SiteContent(req.body);
    } else {
      if (req.body.meta) content.meta = { ...content.meta, ...req.body.meta };
      if (req.body.hero) content.hero = { ...content.hero, ...req.body.hero };
      if (req.body.missionVision) content.missionVision = { ...content.missionVision, ...req.body.missionVision };
      if (req.body.achievements) content.achievements = { ...content.achievements, ...req.body.achievements };
      if (req.body.contact) content.contact = { ...content.contact, ...req.body.contact };
      if (req.body.footer) content.footer = { ...content.footer, ...req.body.footer };
    }

    const updated = await content.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
