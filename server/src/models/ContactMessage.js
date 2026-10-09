import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived', 'replied'],
      default: 'unread',
    },
    emailSentToStudio: { type: Boolean, default: false },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
