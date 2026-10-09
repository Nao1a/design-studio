import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_aau_biomedical_design_studio_jwt_token_2026', {
    expiresIn: '7d',
  });
};

// @route POST /api/auth/register
// @desc  Member self-signup (account created with pending status)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, studentId, department, phone, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const trimmedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: trimmedEmail,
      password,
      role: 'member',
      status: 'pending',
      studentId: studentId ? studentId.trim() : '',
      department: department ? department.trim() : 'Biomedical Engineering',
      phone: phone ? phone.trim() : '',
      bio: bio ? bio.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Membership registration submitted! Your account is currently pending verification by the studio administrator. You will be able to log in once approved.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        studentId: user.studentId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/login
// @desc  Login for members and admins
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If user is a member, verify their account status
    if (user.role === 'member') {
      if (user.status === 'pending') {
        return res.status(403).json({
          isPending: true,
          message: 'Your member account is pending verification by the studio administrator. Please check back shortly once faculty approves your membership.',
        });
      }

      if (user.status === 'rejected') {
        return res.status(403).json({
          isRejected: true,
          message: 'Your membership application was not approved. Please contact studio administration for inquiries.',
        });
      }
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        department: user.department,
        studentId: user.studentId,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
      department: req.user.department,
      studentId: req.user.studentId,
      phone: req.user.phone,
      avatar: req.user.avatar,
    },
  });
});

// @route GET /api/auth/members
// @desc  Admin fetch list of members (pending, verified, rejected)
router.get('/members', protect, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { role: 'member' };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const members = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route PATCH /api/auth/members/:id/verify
// @desc  Admin update member verification status
router.patch('/members/:id/verify', protect, requireAdmin, async (req, res) => {
  try {
    const { status, verificationNotes } = req.body;

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(verificationNotes !== undefined && { verificationNotes }),
      },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({
      success: true,
      message: `Member status updated to ${status}.`,
      member: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route DELETE /api/auth/members/:id
// @desc  Admin delete member
router.delete('/members/:id', protect, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin account via member management' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Member account removed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
