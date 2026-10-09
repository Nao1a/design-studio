import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      enum: ['Research', 'Clinical Trials', 'Studio News', 'Awards & Grants', 'Student Spotlights'],
      default: 'Studio News',
    },
    excerpt: { type: String, required: true },
    content: { type: String, required: true }, // Markdown / HTML formatted text
    coverImage: { type: String, default: '' },
    author: {
      name: { type: String, default: 'AAU Design Studio Editorial' },
      role: { type: String, default: 'Biomedical Research Team' },
      avatar: { type: String, default: '' },
    },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    readTimeMinutes: { type: Number, default: 4 },
  },
  { timestamps: true }
);

articleSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
  }
  next();
});

export const Article = mongoose.model('Article', articleSchema);
