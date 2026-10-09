import express from 'express';
import { ContactMessage } from '../models/ContactMessage.js';
import { sendContactNotificationEmail } from '../utils/mailer.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route POST /api/contact
// @desc  Submit contact message from public website
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Save message to MongoDB
    const newMessage = new ContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : 'Inquiry via Website',
      message: message.trim(),
    });

    const saved = await newMessage.save();

    // Dispatch email to design studio & admin
    let emailStatus = false;
    try {
      const emailRes = await sendContactNotificationEmail({
        name: saved.name,
        email: saved.email,
        subject: saved.subject,
        message: saved.message,
        contactId: saved._id,
      });
      emailStatus = emailRes.success;
      if (emailStatus) {
        saved.emailSentToStudio = true;
        await saved.save();
      }
    } catch (mailErr) {
      console.error('[Contact Mailer Error]', mailErr);
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted and delivered to the AAU Design Studio team.',
      id: saved._id,
      emailNotified: emailStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/contact
// @desc  Get all inquiries for admin dashboard
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PATCH /api/contact/:id
// @desc  Update status or notes of an inquiry
router.patch('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Message not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/contact/:id
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
