import mongoose from 'mongoose';

const proposalFileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true }, // e.g. 3d-model (.stl, .obj, .gltf, .step), document (.pdf), image
  size: { type: Number, required: true },
  url: { type: String, required: true },
});

const proposalSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Implants', 'Diagnostics', 'Surgical', 'Wearables', 'Robotics', 'Other'],
      default: 'Implants',
    },
    summary: { type: String, required: true },
    clinicalProblem: { type: String, required: true },
    proposedSolution: { type: String, required: true },
    budgetEstimate: { type: String, default: '' },
    requestedResources: [{ type: String }], // e.g. '3D Prototyping Cleanroom', 'Bio-Sensor Lab', 'CNC Milling', 'Faculty Mentorship'
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentDepartment: { type: String, default: 'Biomedical Engineering' },
    studentIdNumber: { type: String, default: '' },
    studentPhone: { type: String, default: '' },
    teamMembers: [{ type: String }],
    status: {
      type: String,
      enum: ['Pending Review', 'Under Review', 'Needs Revision', 'Approved', 'Rejected'],
      default: 'Pending Review',
    },
    adminFeedback: { type: String, default: '' },
    revisionNotes: { type: String, default: '' },
    files: [proposalFileSchema],
  },
  { timestamps: true }
);

proposalSchema.index({ status: 1 });
proposalSchema.index({ member: 1 });
proposalSchema.index({ createdAt: -1 });

export const Proposal = mongoose.model('Proposal', proposalSchema);
