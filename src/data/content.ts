export interface Project {
  id: string;
  title: string;
  category: 'Implants' | 'Diagnostics' | 'Surgical' | 'Wearables';
  tagline: string;
  description: string;
  extendedDescription: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  status: 'Clinical Trial Phase II' | 'Prototyping' | 'In Vivo Testing' | 'FDA Review' | 'Patent Pending';
  imagePlaceholder: string;
  gradient: string;
  patentId?: string;
  leadInvestigator: string;
}

export interface AchievementStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  category: 'Award' | 'Patent' | 'Publication' | 'Partnership';
  description: string;
  venueOrPartner: string;
  linkText?: string;
}

export interface SiteContent {
  meta: {
    studioName: string;
    university: string;
    tagline: string;
    subheadline: string;
    description: string;
  };
  navigation: {
    links: { label: string; href: string }[];
    ctaLabel: string;
  };
  hero: {
    greetingBadge: string;
    headlineStart: string;
    headlineHighlight: string;
    headlineEnd: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    scrollCue: string;
    clinicalBadge: string;
    specHighlights: { label: string; value: string }[];
  };
  missionVision: {
    badge: string;
    headline: string;
    subheadline: string;
    mission: {
      title: string;
      subtitle: string;
      description: string;
      points: string[];
    };
    vision: {
      title: string;
      subtitle: string;
      description: string;
      points: string[];
    };
    coreValues: {
      title: string;
      description: string;
      icon: 'ShieldCheck' | 'Cpu' | 'HeartPulse' | 'Sparkles';
    }[];
  };
  projects: {
    badge: string;
    headline: string;
    subheadline: string;
    categories: ('All' | 'Implants' | 'Diagnostics' | 'Surgical' | 'Wearables')[];
    items: Project[];
  };
  achievements: {
    badge: string;
    headline: string;
    subheadline: string;
    stats: AchievementStat[];
    timeline: TimelineItem[];
  };
  contact: {
    badge: string;
    headline: string;
    subheadline: string;
    statusText: string;
    email: string;
    phone: string;
    address: string;
    labLocation: string;
    officeHours: string;
    socials: { name: string; url: string; icon: 'Github' | 'Linkedin' | 'Twitter' | 'Mail' }[];
  };
  footer: {
    tagline: string;
    copyright: string;
    affiliation: string;
  };
}

export const content: SiteContent = {
  meta: {
    studioName: "AAU Biomedical Design Studio",
    university: "Addis Ababa University & AAU Institute of Technology",
    tagline: "Designing the future of medical devices",
    subheadline: "Engineering bio-compatible, intelligent diagnostic systems and surgical implants with micro-scale precision.",
    description: "AAU Biomedical Design Studio pioneers next-generation medical devices, neural interfaces, and clinical-grade diagnostic instrumentation.",
  },
  navigation: {
    links: [
      { label: "Overview", href: "#hero" },
      { label: "Mission & Vision", href: "#mission-vision" },
      { label: "Projects", href: "#projects" },
      { label: "Achievements", href: "#achievements" },
      { label: "Contact", href: "#contact" },
    ],
    ctaLabel: "Initiate Collaboration",
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
  projects: {
    badge: "Research & Development",
    headline: "What We're Working On",
    subheadline: "Explore our active clinical pipelines, from micro-scale neural interfaces to intelligent continuous monitoring systems.",
    categories: ["All", "Implants", "Diagnostics", "Surgical", "Wearables"],
    items: [
      {
        id: "aau-neuro-sync",
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
      },
      {
        id: "aau-cardio-mesh",
        title: "CardioMesh Compliant Patch",
        category: "Implants",
        tagline: "Elastomeric conductive cardiac sleeve for post-infarct myocardial reinforcement.",
        description: "An auxetic biocompatible scaffold embedded with micro-piezoelectric sensors that synchronizes with epicardial motion to prevent heart failure.",
        extendedDescription: "Utilizing 3D printed medical silicone infused with multi-walled carbon nanotubes, CardioMesh provides passive ventricular restraint while continuously monitoring localized wall strain and electrical propagation velocity.",
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
      },
      {
        id: "aau-spectro-point",
        title: "SpectroPoint Micro-Optic Cytometer",
        category: "Diagnostics",
        tagline: "Handheld microfluidic lab-on-a-chip for rapid multi-pathogen identification in under 3 minutes.",
        description: "A battery-powered portable diagnostic device capable of detecting malaria, sepsis biomarkers, and viral loads using single-drop capillary blood.",
        extendedDescription: "Engineered specifically for decentralized rural clinics and emergency triage. Employs laser-induced fluorescence and deep learning on-edge neural accelerators to classify cellular morphologies with 99.4% clinical sensitivity.",
        tags: ["Point-of-Care", "Microfluidics", "Edge AI", "Optical Biosensor"],
        metrics: [
          { label: "Assay Time", value: "< 180 sec" },
          { label: "Sample Vol", value: "15 µL" },
          { label: "Sensitivity", value: "99.4%" },
        ],
        status: "FDA Review",
        imagePlaceholder: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
        patentId: "PCT/IB2025/050119",
        leadInvestigator: "Dr. Selamawit Haile",
      },
      {
        id: "aau-endo-steer",
        title: "EndoSteer Articulated Laparoscope",
        category: "Surgical",
        tagline: "Sub-3mm 7-DOF dexterous robotic end-effector for micro-vascular and pediatric surgery.",
        description: "A continuous-backbone nitinol surgical manipulator providing surgeon tremor cancellation and haptic resistance feedback.",
        extendedDescription: "Features patented antagonist tendon-routing channels that prevent cable friction hysteresis, allowing millimeter-level navigation in restricted anatomical corridors with sub-millinewton force sensing.",
        tags: ["Surgical Robotics", "Nitinol SMA", "Haptic Feedback", "Pediatric"],
        metrics: [
          { label: "Outer Diam.", value: "2.8 mm" },
          { label: "Degrees of Freedom", value: "7 DOF" },
          { label: "Bending Angle", value: "±165°" },
        ],
        status: "Prototyping",
        imagePlaceholder: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
        gradient: "from-sky-500/10 via-cyan-500/5 to-transparent",
        patentId: "ET-PAT-2025-0104A",
        leadInvestigator: "Prof. Yonas Alemayehu",
      },
      {
        id: "aau-derm-sense",
        title: "DermSense Epidermal Bio-Sticker",
        category: "Wearables",
        tagline: "Ultra-thin, breathable sweat-electrolyte patch for real-time neonatal intensive monitoring.",
        description: "A wireless, skin-conformable sensor tape that continuously measures electrolyte balance, lactate, and core hydration without skin irritation.",
        extendedDescription: "Fabricated from porous medical polyurethane with screen-printed gold nanoparticles. Features NFC energy harvesting, eliminating battery weight for fragile neonatal patients in intensive care units.",
        tags: ["Flexible Electronics", "Wearables", "Neonatal Care", "NFC Telemetry"],
        metrics: [
          { label: "Thickness", value: "45 µm" },
          { label: "Skin Adhesion", value: "14 Days Safe" },
          { label: "Power Source", value: "Battery-Free NFC" },
        ],
        status: "Clinical Trial Phase II",
        imagePlaceholder: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
        gradient: "from-blue-500/10 via-sky-500/5 to-transparent",
        patentId: "ET-PAT-2024-0992C",
        leadInvestigator: "Dr. Michael Girma",
      },
      {
        id: "aau-osteo-lattice",
        title: "OsteoLattice 3D Bone Scaffold",
        category: "Implants",
        tagline: "Porous bioactive titanium trabecular cage for patient-matched craniofacial reconstruction.",
        description: "Topology-optimized osteoconductive titanium implants that promote accelerated vascular ingrowth and bone regeneration.",
        extendedDescription: "Utilizes selective laser melting (SLM) with a gyroid triply periodic minimal surface (TPMS) architecture, achieving an exact stiffness match to human cancellous bone to eliminate stress shielding.",
        tags: ["Additive Mfg", "Titanium Lattice", "Orthopedic", "Gyroid TPMS"],
        metrics: [
          { label: "Porosity", value: "78% Interconnected" },
          { label: "Pore Size", value: "450 µm" },
          { label: "Elastic Modulus", value: "2.8 GPa (Bone-match)" },
        ],
        status: "Patent Pending",
        imagePlaceholder: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        gradient: "from-slate-500/10 via-sky-500/5 to-transparent",
        patentId: "ET-PAT-2026-0033P",
        leadInvestigator: "Dr. Bethlehem Assefa",
      },
    ],
  },
  achievements: {
    badge: "Milestones & Track Record",
    headline: "Proven Impact in Numbers",
    subheadline: "Quantifiable milestones achieved across clinical trials, intellectual property, academic journals, and healthcare partnerships.",
    stats: [
      {
        id: "patents",
        value: 14,
        suffix: "+",
        label: "Granted Patents & Filings",
        description: "International and regional medical device IP protections.",
      },
      {
        id: "trials",
        value: 8,
        suffix: "",
        label: "Active Clinical Trials",
        description: "IRB-approved patient evaluations in university teaching hospitals.",
      },
      {
        id: "citations",
        value: 120,
        suffix: "k+",
        label: "Clinical Hours Tested",
        description: "Rigorous continuous benchtop and in vivo bio-safety telemetry.",
      },
      {
        id: "funding",
        value: 42,
        suffix: "+",
        label: "Peer-Reviewed Papers",
        description: "Published in Nature Biomedical Engineering, IEEE TBME & Lancet.",
      },
    ],
    timeline: [
      {
        year: "2026",
        title: "Global Health Innovation Pioneer Award",
        category: "Award",
        description: "Recognized by the World Health Organization & IFMBE for low-cost micro-fluidic diagnostic deployment.",
        venueOrPartner: "Geneva Global Medical Forum",
      },
      {
        year: "2025",
        title: "FDA Breakthrough Device Designation for NeuroSync",
        category: "Patent",
        description: "Granted expedited regulatory review path for the sub-millimeter motor cortex neural interface.",
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
    badge: "Direct Consultation",
    headline: "Let's Engineer the Next Medical Breakthrough",
    subheadline: "Whether you are a surgeon with a clinical challenge, an industry partner seeking bio-design licensing, or a researcher looking to collaborate, our studio welcomes you.",
    statusText: "Currently accepting 2026/2027 Research Partnerships & Clinical Trials",
    email: "biomedical.studio@aau.edu.et",
    phone: "+251 11 123 2450 / +251 91 144 8820",
    address: "AAU Institute of Technology Campus, King George VI St, Addis Ababa, Ethiopia",
    labLocation: "Biomedical Engineering Building, Wing C, Cleanroom Lab 304",
    officeHours: "Monday - Friday: 08:30 - 17:30 EAT",
    socials: [
      { name: "GitHub", url: "https://github.com/aau-biomedical", icon: "Github" },
      { name: "LinkedIn", url: "https://linkedin.com/school/aau-biomedical", icon: "Linkedin" },
      { name: "Twitter", url: "https://twitter.com/AAUBioDesign", icon: "Twitter" },
      { name: "Email", url: "mailto:biomedical.studio@aau.edu.et", icon: "Mail" },
    ],
  },
  footer: {
    tagline: "Engineering life-preserving biomedical technology at Addis Ababa University.",
    copyright: "© 2026 AAU Biomedical Design Studio. All rights reserved.",
    affiliation: "Affiliated with Addis Ababa University College of Technology and Built Environment",
  },
};
