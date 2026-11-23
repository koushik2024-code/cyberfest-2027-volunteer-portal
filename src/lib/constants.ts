import { DepartmentName } from '@/types';

export const EVENT_DETAILS = {
  name: 'CYBERFEST 2027',
  tagline: 'Think Beyond. Defend Beyond.',
  subheading: 'Be Part of the Team Behind One of the Biggest Cybersecurity Events.',
  organizer: 'Digital Defence Club (DDC)',
  institution: 'Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad',
  venue: 'CBIT Campus, Gandipet, Hyderabad - 500075',
  academicGuidance: 'Jointly guided by the Departments of CET, AI&DS, and IT',
};

export interface DepartmentInfo {
  name: DepartmentName;
  iconName: string;
  tagline: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  color: string;
}

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    name: 'Technical',
    iconName: 'Terminal',
    tagline: 'CTFs, Sandboxes, Network Infrastructure & Bug Bounties',
    description:
      'Architect vulnerable environments, design CTF challenges (Web, Pwn, Crypto, Forensics), manage high-availability local network infrastructure, and maintain digital competition platforms.',
    responsibilities: [
      'Setting up CTFd and custom jeopardy/attack-defense infrastructure',
      'Configuring isolated lab environments, sandboxes, and LAN subnets',
      'Assisting technical participants, auditing challenge flags, and validating solutions',
      'Maintaining club web applications, portals, and scoreboard displays',
    ],
    skills: ['Linux / Bash', 'Python / Go', 'CTF / Security Tools', 'Networking & Docker'],
    color: 'from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/30',
  },
  {
    name: 'Events',
    iconName: 'CalendarCheck',
    tagline: 'Ground Operations, Stage Protocol & Conclave Logistics',
    description:
      'Manage end-to-end event choreography, crowd control, auditorium setup, guest speaker coordination, on-ground problem solving, and overall operational discipline.',
    responsibilities: [
      'Coordinating auditorium protocol, sound, lighting, and stage flow',
      'Managing participant queues, verification desks, and on-ground hospitality',
      'Ensuring seamless minute-to-minute schedule adherence across days',
      'Handling crisis mitigation and logistical contingencies during conclave hours',
    ],
    skills: ['Crisis Management', 'Team Leadership', 'Ground Logistics', 'Schedule Coordination'],
    color: 'from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30',
  },
  {
    name: 'Public Relations (PR)',
    iconName: 'Megaphone',
    tagline: 'Outreach, Multi-College Campaigns & Audience Engagement',
    description:
      'Build buzz across Telangana and pan-India engineering colleges. Drive campus ambassador programs, pitch to tech societies, and lead digital outreach campaigns.',
    responsibilities: [
      'Driving participant registration across 50+ universities and colleges',
      'Crafting compelling social media announcements, reels, and stories',
      'Hosting interactive countdowns, AMA sessions, and community engagement',
      'Managing attendee communications, query hotlines, and FAQs',
    ],
    skills: ['Public Speaking', 'Social Media Strategy', 'Campaign Outreach', 'Networking'],
    color: 'from-pink-500/20 to-rose-600/20 text-pink-400 border-pink-500/30',
  },
  {
    name: 'Design',
    iconName: 'Palette',
    tagline: 'Cyberpunk Visual Identity, UI/UX & Digital Assets',
    description:
      'Set the aesthetic benchmark for CyberFest 2027. Create stunning cyber-themed banners, social media creatives, identity cards, certificates, and web visuals.',
    responsibilities: [
      'Designing futuristic visual assets, brochures, roll-up banners, and backdrops',
      'Crafting branded merchandise (T-shirts, badges, sticker packs, attendee kits)',
      'Designing responsive UI prototypes for event portals and landing pages',
      'Enforcing strict brand consistency across all print and digital media',
    ],
    skills: ['Figma', 'Adobe Photoshop / Illustrator', 'UI/UX Design', 'Visual Hierarchy'],
    color: 'from-purple-500/20 to-violet-600/20 text-purple-400 border-purple-500/30',
  },
  {
    name: 'Video Editing',
    iconName: 'Video',
    tagline: 'Teasers, Aftermovies, Motion Graphics & Visual FX',
    description:
      'Produce high-octane event trailers, motion graphic teasers, dynamic countdown videos, keynote openers, and an unforgettable post-event cinematic aftermovie.',
    responsibilities: [
      'Shooting cinematic live footage during hackathon and workshop sessions',
      'Editing high-impact reels, short-form hype videos, and teaser sequences',
      'Creating motion graphics, animated sponsor stingers, and title cards',
      'Delivering the official CyberFest aftermovie within T+3 days',
    ],
    skills: ['Premiere Pro / DaVinci Resolve', 'After Effects', 'Sound Design', 'Videography'],
    color: 'from-red-500/20 to-rose-600/20 text-red-400 border-red-500/30',
  },
  {
    name: 'Sponsorship',
    iconName: 'Handshake',
    tagline: 'Corporate Pitching, Title Sponsorships & Grant Requisitions',
    description:
      'Liaise with cybersecurity companies, tech MNCs, startups, and community partners to secure corporate sponsorships, prize pools, swag, and cloud compute credits.',
    responsibilities: [
      'Preparing high-impact sponsorship pitch decks and tier matrices',
      'Negotiating deliverable packages with corporate brand managers',
      'Securing cloud credits, software licenses, and prize funding',
      'Ensuring sponsor branding promises and deliverables are strictly met',
    ],
    skills: ['Corporate Pitching', 'Negotiation', 'Proposal Writing', 'Business Communication'],
    color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30',
  },
  {
    name: 'External Affairs',
    iconName: 'Globe',
    tagline: 'Dignitary Protocol, Government Bodies & Keynote Speakers',
    description:
      'Interface with eminent cybersecurity professionals, CERT-In / DSCI officials, academic keynote speakers, and external college delegations for official representation.',
    responsibilities: [
      'Sending formal institutional invitation letters to high-profile dignitaries',
      'Managing VIP travel, guest hospitality, reception protocol, and mementos',
      'Liaising with institutional leadership (Principal, HoDs, Directors)',
      'Coordinating security clearances, parking, and campus escorts',
    ],
    skills: ['Executive Protocol', 'Formal Correspondence', 'Liaison', 'Diplomacy'],
    color: 'from-blue-500/20 to-indigo-600/20 text-blue-400 border-blue-500/30',
  },
  {
    name: 'Documentation',
    iconName: 'FileText',
    tagline: 'Institutional Letters, Permission Requisitions & IQAC Reports',
    description:
      'Act as the academic and administrative backbone. Author official institutional proposals, budget requisitions, venue allocations, and accredited post-event IQAC reports.',
    responsibilities: [
      'Drafting official permission letters through HoD CET, AI&DS, and IT to Principal',
      'Preparing budget estimation sheets, venue requisition letters, and OD circulars',
      'Recording detailed Minutes of Meetings (MoM) and maintaining central registers',
      'Compiling comprehensive post-event compliance reports for NAAC / NBA / IQAC',
    ],
    skills: ['Technical Writing', 'Institutional Drafting', 'Archival', 'Policy Compliance'],
    color: 'from-teal-500/20 to-cyan-600/20 text-teal-400 border-teal-500/30',
  },
];

export const WHY_JOIN_US = [
  {
    title: 'Hands-On Event Management',
    description: 'Gain real-world experience organizing one of Hyderabad’s largest cybersecurity conclaves and 36-hour hackathons.',
    iconName: 'Wrench',
  },
  {
    title: 'Passionate Technical Community',
    description: 'Work alongside elite student ethical hackers, CTF players, developers, and AI researchers across CET, AI&DS, and IT.',
    iconName: 'Users',
  },
  {
    title: 'Leadership & Communication Skills',
    description: 'Sharpen your project management, public speaking, negotiation, and high-pressure problem-solving capabilities.',
    iconName: 'Sparkles',
  },
  {
    title: 'Professional Connections',
    description: 'Directly interact with industry CISOs, cybersecurity researchers, enterprise recruiters, and government leaders.',
    iconName: 'Network',
  },
  {
    title: 'Cybersecurity Exposure',
    description: 'Get deep exposure to cutting-edge domains: offensive security, reverse engineering, post-quantum cryptography, and LLM defense.',
    iconName: 'ShieldAlert',
  },
  {
    title: 'Certificates & Recognition',
    description: 'Receive official certificates of organizing excellence from DDC and CBIT, with verified institutional endorsement.',
    iconName: 'Award',
  },
];
