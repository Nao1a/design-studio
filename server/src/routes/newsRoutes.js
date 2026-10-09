import express from 'express';
import { Article } from '../models/Article.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/news
// @desc  Get published articles (public)
router.get('/', async (req, res) => {
  try {
    const { category, tag } = req.query;
    const filter = { isPublished: true };
    if (category && category !== 'All') filter.category = category;
    if (tag) filter.tags = tag;

    const articles = await Article.find(filter).sort({ createdAt: -1 }).lean();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/news/admin/all
// @desc  Get all articles including drafts (admin)
router.get('/admin/all', protect, requireAdmin, async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).lean();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/news/:idOrSlug
// @desc  Get single article
router.get('/:idOrSlug', async (req, res) => {
  try {
    let article = null;
    if (req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      article = await Article.findById(req.params.idOrSlug);
    }
    if (!article) {
      article = await Article.findOne({ slug: req.params.idOrSlug });
    }
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/news
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const article = new Article(req.body);
    const saved = await article.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route PUT /api/news/:id
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Article not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route DELETE /api/news/:id
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
