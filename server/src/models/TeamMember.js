import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    specialties: [{ type: String }],
    isFounder: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
