import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema(
  {
    meta: {
      studioName: { type: String, default: 'AAU Biomedical Design Studio' },
      university: { type: String, default: 'Addis Ababa University & AAU Institute of Technology' },
      tagline: { type: String, default: 'Designing the future of medical devices' },
      subheadline: { type: String, default: 'Engineering bio-compatible, intelligent diagnostic systems and surgical implants with micro-scale precision.' },
      description: { type: String, default: 'AAU Biomedical Design Studio pioneers next-generation medical devices, neural interfaces, and clinical-grade diagnostic instrumentation.' },
    },
    hero: {
      greetingBadge: { type: String, default: 'Pioneering Biomedical Innovation' },
      headlineStart: { type: String, default: 'Designing the future of' },
      headlineHighlight: { type: String, default: 'medical devices' },
      headlineEnd: { type: String, default: 'with micro-scale precision.' },
      intro: { type: String, default: 'We engineer patient-specific neural interfaces, surgical implants, and point-of-care diagnostics bridging clinical necessity with cutting-edge micro-fabrication.' },
      primaryCta: { type: String, default: 'Explore Innovations' },
      secondaryCta: { type: String, default: 'Contact Studio' },
      clinicalBadge: { type: String, default: 'Clinical Grade Standards' },
      specHighlights: [
        {
          label: { type: String },
          value: { type: String },
        },
      ],
    },
    missionVision: {
      badge: { type: String, default: 'Purpose & Trajectory' },
      headline: { type: String, default: 'Translating Clinical Need into Engineering Reality' },
      subheadline: { type: String, default: 'Founded within Addis Ababa University, our design studio operates at the nexus of clinical surgery, tissue engineering, and embedded medical instrumentation.' },
      mission: {
        title: { type: String, default: 'Our Core Mission' },
        subtitle: { type: String, default: 'Accelerating localized clinical impact through indigenous precision engineering.' },
        description: { type: String, default: 'To democratize access to advanced surgical implants and diagnostics by engineering bio-compatible medical devices tailored for African healthcare ecosystems and global standards.' },
        points: [{ type: String }],
      },
      vision: {
        title: { type: String, default: 'Our Long-Range Vision' },
        subtitle: { type: String, default: 'A continental epicenter for FDA & CE-cleared biomedical innovation.' },
        description: { type: String, default: 'To become East Africa’s premier biomedical translation accelerator, incubating clinical-grade medical technologies that transition from university lab bench to active operating theatres.' },
        points: [{ type: String }],
      },
      coreValues: [
        {
          title: { type: String },
          description: { type: String },
          icon: { type: String, default: 'ShieldCheck' },
        },
      ],
    },
    achievements: {
      badge: { type: String, default: 'Proven Milestones' },
      headline: { type: String, default: 'Quantifiable Clinical & Research Impact' },
      subheadline: { type: String, default: 'Every prototype is backed by rigorous bench validation, ethical oversight, and published translational research.' },
      stats: [
        {
          value: { type: Number },
          suffix: { type: String },
          label: { type: String },
          description: { type: String },
        },
      ],
      timeline: [
        {
          year: { type: String },
          title: { type: String },
          category: { type: String },
          description: { type: String },
          venueOrPartner: { type: String },
          linkText: { type: String },
        },
      ],
    },
    contact: {
      badge: { type: String, default: 'Get in Touch' },
      headline: { type: String, default: 'Initiate a Research Collaboration or Clinical Inquiry' },
      subheadline: { type: String, default: 'Connect with our team of biomedical engineers, surgeons, and investigators.' },
      statusText: { type: String, default: 'Accepting select Q3/Q4 research partnerships' },
      email: { type: String, default: 'biomedical.studio@aau.edu.et' },
      phone: { type: String, default: '+251 11 123 4567' },
      address: { type: String, default: 'AAU Institute of Technology (AAiT), King George VI St, Addis Ababa, Ethiopia' },
      labLocation: { type: String, default: 'Block 4, 3rd Floor, Biomaterials & Prototyping Cleanroom' },
      officeHours: { type: String, default: 'Mon – Fri: 08:30 – 17:30 EAT' },
      socials: [
        {
          name: { type: String },
          url: { type: String },
          icon: { type: String },
        },
      ],
    },
    footer: {
      tagline: { type: String, default: 'Precision Biomedical Engineering for Resilient Healthcare.' },
      copyright: { type: String, default: 'AAU Biomedical Design Studio. All rights reserved.' },
      affiliation: { type: String, default: 'In partnership with Addis Ababa University Institute of Technology & Tikur Anbessa Specialized Hospital.' },
    },
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model('SiteContent', siteContentSchema);
