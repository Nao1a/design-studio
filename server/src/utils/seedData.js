import { User } from '../models/User.js';
import { SiteContent } from '../models/SiteContent.js';
import { Project } from '../models/Project.js';
import { TeamMember } from '../models/TeamMember.js';
import { Article } from '../models/Article.js';

export const seedInitialDatabase = async () => {
  try {
    // 1. Seed Admin User
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@aau-designstudio.edu.et';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'AAU Studio Administrator',
        email: adminEmail,
        password: process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPass123!',
        role: 'admin',
        status: 'verified',
        department: 'Biomedical Engineering & Administration',
      });
      console.log(`[Seed] Created default admin user: ${adminEmail} (password: ${process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPass123!'})`);
    } else if (adminExists.status !== 'verified') {
      adminExists.status = 'verified';
      await adminExists.save();
    }

    // 2. Seed Site Content
    const contentCount = await SiteContent.countDocuments();
    if (contentCount === 0) {
      await SiteContent.create({
        meta: {
          studioName: "AAU Biomedical Design Studio",
          university: "Addis Ababa University & AAU Institute of Technology",
          tagline: "Designing the future of medical devices",
          subheadline: "Engineering bio-compatible, intelligent diagnostic systems and surgical implants with micro-scale precision.",
          description: "AAU Biomedical Design Studio pioneers next-generation medical devices, neural interfaces, and clinical-grade diagnostic instrumentation.",
        },
        hero: {
          greetingBadge: "Pioneering Biomedical Innovation",
          headlineStart: "Designing the future of",
          headlineHighlight: "medical devices",
          headlineEnd: "for clinical impact.",
          intro: "We bridge biological complexity with precision mechatronics, developing patient-matched neurostimulators, smart bio-sensors, and minimally invasive implants engineered for the next century of healthcare.",
          primaryCta: "Explore Active Projects",
          secondaryCta: "Our Lab & Mission",
          scrollCue: "Scroll to explore our innovations",
          clinicalBadge: "ISO 13485 & FDA Design Control Standards",
          specHighlights: [
            { label: "Biocompatibility", value: "Grade V Titanium & PEEK" },
            { label: "Micro-Precision", value: "< 2.5 µm Tolerance" },
            { label: "Power Efficiency", value: "Sub-microWatt Architecture" },
          ],
        },
        missionVision: {
          badge: "Core Philosophy",
          headline: "Engineered for human longevity",
          subheadline: "Bridging the gap between academic biomedical breakthroughs and life-saving clinical hardware deployed in real-world operating rooms.",
          mission: {
            title: "Our Mission",
            subtitle: "Transforming Clinical Care Through Micro-Engineered Systems",
            description: "To invent, validate, and translate patient-centric medical devices that dramatically lower surgical trauma, accelerate rehabilitation, and democratize access to advanced bio-electronic diagnostics across emerging and global healthcare systems.",
            points: [
              "Direct clinical immersion alongside surgeons and medical staff.",
              "Zero-compromise biocompatibility and rigorous in vitro / in vivo stress validation.",
              "Open-architecture and scalable hardware platforms for global medical equity.",
            ],
          },
          vision: {
            title: "Our Vision",
            subtitle: "The Autonomous, Bio-Integrative Healthcare Paradigm",
            description: "We envision a future where medical devices seamlessly integrate with human tissue, providing real-time telemetry, closed-loop therapeutic delivery, and self-sustaining energy harvesting without invasive battery replacements.",
            points: [
              "Closed-loop bio-sensing neural and cardiac micro-implants.",
              "Fully biodegradable transient electronics for temporary internal recovery monitoring.",
              "Establishing East Africa's leading hub for medical device innovation & commercialization.",
            ],
          },
          coreValues: [
            {
              title: "Clinical Rigor",
              description: "Adhering to strict international medical device standards from initial CAD sketches to sterile cleanroom fabrication.",
              icon: "ShieldCheck",
            },
            {
              title: "Bio-Adaptive Tech",
              description: "Designing dynamic mechanical properties that mimic native human cartilage, bone, and neural tissue compliance.",
              icon: "Cpu",
            },
            {
              title: "Patient-Centered",
              description: "Prioritizing non-invasive ergonomics, intuitive surgeon interfaces, and long-term biocompatible safety.",
              icon: "HeartPulse",
            },
            {
              title: "Translational Design",
              description: "Ensuring every laboratory prototype has a direct, validated regulatory pathway toward hospital clinical adoption.",
              icon: "Sparkles",
            },
          ],
        },
        achievements: {
          badge: "Proven Milestones",
          headline: "Quantifiable Clinical & Research Impact",
          subheadline: "Every prototype is backed by rigorous bench validation, ethical oversight, and published translational research.",
          stats: [
            { value: 14, suffix: "+", label: "Patents Pending & Issued", description: "Across neural interfaces, microfluidics, and patient-matched surgical implants." },
            { value: 6, suffix: "", label: "Active Clinical Trials", description: "Conducted in partnership with Tikur Anbessa Specialized Hospital and international centers." },
            { value: 99.4, suffix: "%", label: "Biocompatibility Index", description: "ISO 10993 cytotoxicity and hemocompatibility compliance across all materials." },
            { value: 28, suffix: "M+", label: "Research Grant Funding", description: "Secured from international translational health programs and university endowments." },
          ],
          timeline: [
            {
              year: "2026",
              title: "FDA Breakthrough Device Designation — NeuroSync",
              category: "Patent",
              description: "Received priority review designation for sub-millimeter motor cortex decoding neural implant.",
              venueOrPartner: "US FDA Center for Devices & Radiological Health",
            },
            {
              year: "2025",
              title: "Multi-Center Clinical Trial at Tikur Anbessa Hospital",
              category: "Partnership",
              description: "50-patient evaluation of the CardioMesh patch for post-infarct recovery monitoring.",
              venueOrPartner: "Tikur Anbessa Specialized Hospital",
            },
            {
              year: "2024",
              title: "Lead Article in Nature Biomedical Engineering",
              category: "Publication",
              description: "'Closed-Loop Microfluidics for Rapid Point-of-Care Pathogen Diagnostics in Sub-Saharan Africa'.",
              venueOrPartner: "Nature Publishing Group (Impact Factor: 28.1)",
            },
            {
              year: "2023",
              title: "BioDesign Cleanroom Facility Commissioning",
              category: "Partnership",
              description: "Opened our 400 m² ISO Class 6 certified biomedical micro-fabrication cleanroom.",
              venueOrPartner: "AAU Institute of Technology",
            },
          ],
        },
        contact: {
          badge: "Get in Touch",
          headline: "Initiate a Research Collaboration or Clinical Inquiry",
          subheadline: "Connect with our team of biomedical engineers, surgeons, and investigators.",
          statusText: "Accepting select Q3/Q4 research partnerships",
          email: "biomedical.studio@aau.edu.et",
          phone: "+251 11 123 4567",
          address: "AAU Institute of Technology (AAiT), King George VI St, Addis Ababa, Ethiopia",
          labLocation: "Block 4, 3rd Floor, Biomaterials & Prototyping Cleanroom",
          officeHours: "Mon – Fri: 08:30 – 17:30 EAT",
          socials: [
            { name: "Linkedin", url: "https://linkedin.com", icon: "Linkedin" },
            { name: "Mail", url: "mailto:biomedical.studio@aau.edu.et", icon: "Mail" },
            { name: "Telegram", url: "https://t.me", icon: "Telegram" },
          ],
        },
        footer: {
          tagline: "Precision Biomedical Engineering for Resilient Healthcare.",
          copyright: "AAU Biomedical Design Studio. All rights reserved.",
          affiliation: "In partnership with Addis Ababa University Institute of Technology & Tikur Anbessa Specialized Hospital.",
        },
      });
      console.log('[Seed] Default site content initialized.');
    }

    // 3. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.create([
        {
          title: "NeuroSync Bio-Prosthetic Interface",
          category: "Implants",
          tagline: "Sub-millimeter closed-loop neural stimulator with 128-channel titanium electrode array.",
          description: "A high-density biocompatible implant engineered for motor cortex signal decoding and sensory feedback restoration in paralyzed limbs.",
          extendedDescription: "NeuroSync integrates ultra-low noise analog front-ends with hermetically sealed grade-23 titanium casing. Tested for over 10,000 continuous hours in simulated physiological cerebrospinal fluid with zero degradation.",
          tags: ["Neural Engineering", "Titanium Grade-23", "Bio-Telemetry", "DSP"],
          metrics: [
            { label: "Channels", value: "128 Rec/Stim" },
            { label: "Power Draw", value: "840 nW/ch" },
            { label: "Diameter", value: "11.4 mm" },
          ],
          status: "In Vivo Testing",
          imagePlaceholder: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",
          gradient: "from-sky-500/10 via-blue-500/5 to-transparent",
          patentId: "ET-PAT-2025-0891A",
          leadInvestigator: "Dr. Aster Tadesse & Prof. K. Mengistu",
          isFeatured: true,
        },
        {
          title: "CardioMesh Compliant Patch",
          category: "Implants",
          tagline: "Elastomeric conductive cardiac sleeve for post-infarct myocardial reinforcement.",
          description: "An auxetic biocompatible scaffold embedded with micro-piezoelectric sensors that synchronizes with epicardial motion to prevent heart failure.",
          extendedDescription: "Utilizing 3D printed medical silicone infused with multi-walled carbon nanotubes, CardioMesh provides passive ventricular restraint while continuously monitoring localized wall strain.",
          tags: ["Cardiovascular", "Auxetic Structure", "Piezoelectric", "Biomaterials"],
          metrics: [
            { label: "Elastic Strain", value: "Up to 340%" },
            { label: "Pressure Sensor", value: "0.1 mmHg res" },
            { label: "Lifespan", value: "> 15 Years" },
          ],
          status: "Clinical Trial Phase II",
          imagePlaceholder: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80",
          gradient: "from-cyan-500/10 via-sky-500/5 to-transparent",
          patentId: "ET-PAT-2024-0412B",
          leadInvestigator: "Dr. Dawit Bekele",
          isFeatured: true,
        },
        {
          title: "SpectroPoint Micro-Optic Cytometer",
          category: "Diagnostics",
          tagline: "Handheld microfluidic lab-on-a-chip for rapid multi-pathogen identification in under 3 minutes.",
          description: "A battery-powered portable diagnostic device capable of detecting malaria, sepsis biomarkers, and viral loads using single-drop capillary blood.",
          extendedDescription: "Combines 405nm and 635nm laser diodes with micro-fabricated polydimethylsiloxane channels for impedance cytometry and fluorescence detection in rural point-of-care settings.",
          tags: ["Microfluidics", "Point-of-Care", "Optoelectronics", "Diagnostics"],
          metrics: [
            { label: "Assay Time", value: "< 180 sec" },
            { label: "Sample Vol", value: "15 µL Blood" },
            { label: "Sensitivity", value: "99.2%" },
          ],
          status: "Clinical Trial Phase II",
          imagePlaceholder: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
          gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
          patentId: "ET-PAT-2025-1102C",
          leadInvestigator: "Selamawit Haile & Eng. Hana Worku",
          isFeatured: true,
        },
      ]);
      console.log('[Seed] Default projects initialized.');
    }

    // 4. Seed Team Members
    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
      await TeamMember.create([
        {
          name: 'Eng. Aster Tadesse',
          role: 'Co-Founder & Lab Director',
          title: 'MSc, Biomedical Engineering',
          bio: 'Practicing biomedical engineer with 12+ years designing patient-matched implants and leading device validation programs.',
          specialties: ['Medical Devices', 'Implant Design'],
          isFounder: true,
          avatar: '',
          displayOrder: 1,
        },
        {
          name: 'Eng. Kassa Mengistu',
          role: 'Co-Founder & Chief Engineer',
          title: 'MSc, Mechanical Engineering',
          bio: 'Senior mechanical engineer specializing in precision CNC, additive manufacturing, and bio-compatible material testing.',
          specialties: ['Manufacturing', 'Biomaterials'],
          isFounder: true,
          avatar: '',
          displayOrder: 2,
        },
        {
          name: 'Eng. Hana Worku',
          role: 'Co-Founder & Clinical Systems Lead',
          title: 'BSc, Biomedical Engineering',
          bio: 'Practicing engineer embedded in clinical environments, translating surgical needs into actionable device specifications.',
          specialties: ['Clinical Systems', 'Regulatory'],
          isFounder: true,
          avatar: '',
          displayOrder: 3,
        },
        {
          name: 'Eng. Solomon Abera',
          role: 'Co-Founder & CTO',
          title: 'MSc, Mechatronics Engineering',
          bio: 'Full-stack hardware engineer architecting embedded bio-sensing platforms and real-time telemetry systems.',
          specialties: ['Embedded Systems', 'Mechatronics'],
          isFounder: true,
          avatar: '',
          displayOrder: 4,
        },
      ]);
      console.log('[Seed] Default team members initialized.');
    }

    // 5. Seed Initial News / Articles
    const articleCount = await Article.countDocuments();
    if (articleCount === 0) {
      await Article.create([
        {
          title: "AAU Biomedical Studio Secures FDA Breakthrough Designation for NeuroSync",
          category: "Research",
          excerpt: "Our 128-channel titanium neural stimulator has reached clinical review status, bringing high-density motor cortex decoding closer to hospital validation.",
          content: `## Breakthrough in Neural Interfaces\n\nThe AAU Biomedical Design Studio is proud to announce a major regulatory milestone: the **NeuroSync Bio-Prosthetic Interface** has received accelerated breakthrough review status.\n\n### Key Highlights\n- **128-channel high-density decoding** with sub-microWatt energy profile.\n- Hermetically sealed Grade-23 titanium enclosure.\n- Over 10,000 continuous validation hours in physiological conditions.\n\nOur team worked hand-in-hand with clinical neurosurgeons to establish a biocompatible protocol that will pave the way for human clinical trials scheduled later this year.`,
          tags: ["Neurotechnology", "FDA", "Neural Implants", "Addis Ababa University"],
          author: { name: "Dr. Aster Tadesse", role: "Lab Director" },
          readTimeMinutes: 4,
          isPublished: true,
        },
        {
          title: "Tikur Anbessa Hospital Evaluates CardioMesh Patch Across 50 Patients",
          category: "Clinical Trials",
          excerpt: "In partnership with Tikur Anbessa Specialized Hospital, clinical researchers are observing post-infarct myocardial reinforcement in real-time.",
          content: `## Transforming Cardiac Recovery\n\nThe CardioMesh auxiliary patch evaluation has begun in Addis Ababa. By merging flexible medical silicone with carbon-nanotube conductive pathways, the patch monitors ventricular wall strain.\n\nEarly clinical observations demonstrate a remarkable reduction in localized ventricular stress, validating years of additive manufacturing and FEA simulation at the studio.`,
          tags: ["Cardiovascular", "Clinical Trials", "Biomaterials"],
          author: { name: "Dr. Dawit Bekele", role: "Cardiovascular Lead" },
          readTimeMinutes: 5,
          isPublished: true,
        },
      ]);
      console.log('[Seed] Initial articles initialized.');
    }
  } catch (err) {
    console.error(`[Seed Error] ${err.message}`);
  }
};
