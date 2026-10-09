import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Implants', 'Diagnostics', 'Surgical', 'Wearables'],
    },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    extendedDescription: { type: String, default: '' },
    tags: [{ type: String }],
    metrics: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['Clinical Trial Phase II', 'Prototyping', 'In Vivo Testing', 'FDA Review', 'Patent Pending'],
      default: 'Prototyping',
    },
    imagePlaceholder: { type: String, default: '' },
    gradient: { type: String, default: 'from-sky-500/20 to-blue-600/30' },
    patentId: { type: String, default: '' },
    leadInvestigator: { type: String, default: '' },
    isFeatured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
