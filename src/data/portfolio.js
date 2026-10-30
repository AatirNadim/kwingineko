export const navigation = [
  ['home', '01', 'Overview'],
  ['work', '02', 'Selected work'],
  ['experience', '03', 'Experience'],
  ['expertise', '04', 'Expertise'],
];

export const projects = [
  {
    name: 'plan-parse', kind: 'INFRASTRUCTURE TOOLING', number: '01',
    description: 'An interactive Terraform plan workbench. Parse planned changes into a dependency graph, inspect resource diffs, and reason about potential blast radius.',
    stack: ['Go', 'Terraform', 'React'], href: 'https://github.com/AatirNadim/plan-parse', status: 'PERSONAL PROJECT',
    image: '/assets/plan-parse-timelines.png', imageAlt: 'A pixel-art sorcerer studies branching infrastructure timelines, with one risky branch glowing red.',
  },
  {
    name: 'getMe', kind: 'STORAGE SYSTEMS', number: '02',
    description: 'A Go key-value storage engine built around an append-only log and in-memory index, with background compaction and local client integrations.',
    stack: ['Go', 'Storage', 'Unix sockets'], href: 'https://github.com/AatirNadim/getMe', status: 'PERSONAL PROJECT',
    image: '/assets/getme-record-hoard.png', imageAlt: 'A tiny pixel-art dragon guards a chest of records while new coins arrive and a ledger keeps them indexed.',
  },
  {
    name: 'Window', kind: 'REAL-TIME SYSTEMS', number: '03',
    description: 'A room-based file-sharing app exploring direct browser-to-browser transfers with WebRTC Data Channels and WebSocket signaling.',
    stack: ['React', 'WebRTC', 'Node.js'], href: 'https://github.com/AatirNadim/window', status: 'PERSONAL PROJECT',
  },
];

export const socials = [
  { name: 'LinkedIn', handle: 'aatirnadim', url: 'https://www.linkedin.com/in/aatirnadim/' },
  { name: 'GitHub', handle: 'AatirNadim', url: 'https://github.com/AatirNadim' },
  { name: 'Blog', handle: 'Techtom', url: 'https://techtom.hashnode.dev/' },
  { name: 'LeetCode', handle: 'AatirNadim', url: 'https://leetcode.com/user3405Ye/' },
  { name: 'Google Cloud Skills Boost', handle: 'Aatir Nadim', url: 'https://www.cloudskillsboost.google/public_profiles/d61be509-d6cb-46fc-9b62-c083e3636598' },
];

export const experience = [
  {
    date: 'BACKEND / PLATFORM', role: 'Service and infrastructure engineering', org: 'Professional experience',
    note: 'Contributed across service APIs, AWS infrastructure, delivery automation, observability, and security-focused changes.',
  },
  {
    date: 'PRODUCT ENGINEERING', role: 'Software engineering internship', org: 'AI-assisted workflows',
    note: 'Contributed to note-taking and workflow products, including integrations, editable execution experiences, and context-aware interactions.',
  },
];

export const expertise = [
  ['BACKEND', 'Java · Spring · Kotlin · Scala · Go · REST APIs'],
  ['CLOUD & PLATFORM', 'AWS · Terraform · Docker · CI/CD · GitHub Actions'],
  ['OBSERVABILITY', 'OpenTelemetry · Grafana · Prometheus · Loki · CloudWatch'],
  ['SECURITY & QUALITY', 'OAuth/OIDC · IAM · dependency hygiene · testing'],
];
