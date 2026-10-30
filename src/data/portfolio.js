export const navigation = [
  ['home', '01', 'Overview'],
  ['work', '02', 'Selected work'],
  ['experience', '03', 'Experience'],
  ['expertise', '04', 'Expertise'],
];

export const projects = [
  {
    name: 'plan-parse',
    kind: 'INFRASTRUCTURE TOOLING',
    number: '01',
    description: 'An interactive Terraform plan workbench. Transforms complex HCL change-sets into a hierarchical Cytoscape dependency graph, renders side-by-side attribute diffs, and evaluates blast radius before execution.',
    lore: 'Channel your inner Sorcerer Supreme: peer through 14,000,605 branching infrastructure timelines to spot that one catastrophic red-alert blast-radius branch before hitting `terraform apply`.',
    loreTag: 'TIMELINE OBSERVATORY',
    stack: ['Go', 'Terraform', 'React', 'Cytoscape.js'],
    href: 'https://github.com/AatirNadim/plan-parse',
    status: 'PERSONAL PROJECT',
    image: '/assets/plan-parse-timelines.png',
    imageAlt: 'Pixel-art sorcerer standing at a glowing mystic circle, viewing branching infrastructure timelines and DAG castles across the cosmos to pinpoint blast radius.',
    imageCaption: '14,000,605 infrastructure timelines / 1 safe deployment',
  },
  {
    name: 'getMe',
    kind: 'STORAGE SYSTEMS',
    number: '02',
    description: 'A persistent, Bitcask-inspired key-value storage engine in Go. Features sequential append-only disk logging, an in-memory hash index, concurrent startup reconstruction, and background compaction over Unix Domain Sockets.',
    lore: 'Like an ancient red dragon fiercely guarding its subterranean hoard of golden disk platters and archival tomes—except it runs silent background compaction and serves key lookups in microseconds.',
    loreTag: 'BITCASK VAULT',
    stack: ['Go', 'Storage', 'Unix Sockets', 'Bitcask'],
    href: 'https://github.com/AatirNadim/getMe',
    status: 'PERSONAL PROJECT',
    image: '/assets/getme-record-hoard.png',
    imageAlt: 'An ancient red dragon rests in a subterranean cavern library guarding stacks of gold disk platters and indexed record tomes.',
    imageCaption: 'Subterranean Bitcask hoard / Platters & indexed tomes',
  },
  {
    name: 'Window',
    kind: 'REAL-TIME SYSTEMS',
    number: '03',
    description: 'A peer-to-peer file transfer system engineered with WebRTC Data Channels and a Node.js WebSocket signaling coordinator. Streams chunked files directly device-to-device with backpressure handling and zero intermediary server storage.',
    lore: 'Whether you want to chat with Gandalf, swing across neon skylines with Spider-Gwen, plan grand banquets with Luffy, or dodge bullet-hell with Neo—stream floating data cubes across dimensional rifts with zero middlemen.',
    loreTag: 'MULTIVERSE RIFT',
    stack: ['React', 'WebRTC', 'Node.js', 'WebSockets'],
    href: 'https://github.com/AatirNadim/window',
    status: 'PERSONAL PROJECT',
    image: '/assets/windows.png',
    imageAlt: 'Pixel-art terminal gazing upon dimensional portal windows streaming data cubes to Gandalf, Spider-Gwen, Luffy, and Neo.',
    imageCaption: 'Interdimensional WebRTC bridge / 4 portals, zero middlemen',
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
