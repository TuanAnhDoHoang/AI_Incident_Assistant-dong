// ===== IncidentX Mock Data =====
// Replace these with real API calls later.

import type { User, Service, ServiceMember, ChatMessage, ChatParticipant, TeamMember } from '../types';

// ══════════════════════════════════════════
// ── All User Accounts ────────────────────
// ══════════════════════════════════════════

export const allUsers: User[] = [
  {
    id: 'anhdoo',
    name: 'Anh Doo',
    phone: '0901',
    email: 'anhdoo@incidentx.io',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALxUpmlWiMa5drHvwBOgowraKGorMi10fxOc05b4l5mJ26u_BLf_B3AImWT3cquNEKNpe_D-BGQ7kWNTKE-cETcSFdu7bE7Vx0Q__HhU5dczR8A9wHHV1o6Z5eAeuXSUnpkMypOPGMtrBA0RvIyklNi5x5lVls50ieIMSH0PQZEI_5XJcqxSXk3ud8QoNkfkefxp60KEWvI-PbMqg0mJHwRfJXeQ58GAoASJ6B0dodrCX9CxkJ_ID39ulBmhwT22_XBsahPyZYMx2O',
    role: 'admin',
  },
  {
    id: 'dat',
    name: 'DAT',
    phone: '0902',
    email: 'dat@incidentx.io',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1UUgUn8aCkUdJqK8XZ5zDdTTF7VvBeR_4zIUhVHeBxMS604P9PLqm0K2JK9JWouFRlcjWLmH1zeZRhxMnZe5YJHKkeXthbg665c3F4RXobmhnY_Xv5A3J_uUAdRqo-0v96HsL-_Uwb9-PFKDtBjvCHHgmRwFTzjVl9hP_onXo6THf83HWsH_n0g-L5OWO-0zgC7YeahvxafjKjUoaQbPAtEb1GVfvmP4c84QotKDXhfzNFRb9stwG3Nu_ZwH5vLk9pKCUQQX0Auj5',
    role: 'admin',
  },
  {
    id: 'cuong',
    name: 'CUONG',
    phone: '0903',
    email: 'cuong@incidentx.io',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnA2P18NTsf2aaTafzIkWAjpiZJ0cBxLt43Oe5QfOq3NjiQKo0cefA-bEXpRw9lJvI2dXFHxzk5PCqjiCs4ngO-yj68tzP7sUMF1x3-WwmYaH140Q89-zviVlYF6FU39IlE9eFil0mid8G0x5U3HjHmtowGfYe4QKpUwBH0PNXY_dxarLxfYTlG3dRov-WKqtN2ksmsKhdBAT0W4E5F_2Q5ZowqYTVaYgaiuPi5cfRmT6uSi6n89K326S9cOgWMyR_PK3GHczJe_yi',
    role: 'admin',
  },
];

// Login lookup: phone → user (password is ignored for mock)
export function findUserByPhone(phone: string): User | undefined {
  return allUsers.find(u => u.phone === phone);
}

// Default current user (will be overridden by login)
export const mockCurrentUser: User = allUsers[0]; // anhdoo

// ══════════════════════════════════════════
// ── Per-Service Role Mapping ─────────────
// ══════════════════════════════════════════
// Maps userId → role for each service.
// If a user is not in the map, they have no access.

export interface ServiceRoleEntry {
  userId: string;
  role: 'admin' | 'staff' | 'client';
}

export const serviceRoles: Record<string, ServiceRoleEntry[]> = {
  // Common staff for all services
  aws: [
    { userId: 'anhdoo', role: 'admin' },
    { userId: 'staff-huy', role: 'staff' },
    { userId: 'staff-quan', role: 'staff' },
    { userId: 'staff-an', role: 'staff' },
    { userId: 'staff-vy', role: 'staff' },
  ],
  gcloud: [
    { userId: 'dat', role: 'admin' },
    { userId: 'staff-huy', role: 'staff' },
    { userId: 'staff-quan', role: 'staff' },
    { userId: 'staff-an', role: 'staff' },
    { userId: 'staff-vy', role: 'staff' },
    { userId: 'anhdoo', role: 'client' },
  ],
  vercel: [
    { userId: 'cuong', role: 'admin' },
    { userId: 'staff-huy', role: 'staff' },
    { userId: 'staff-quan', role: 'staff' },
    { userId: 'staff-an', role: 'staff' },
    { userId: 'staff-vy', role: 'staff' },
  ],
  meta: [
    { userId: 'anhdoo', role: 'admin' },
    { userId: 'staff-huy', role: 'staff' },
    { userId: 'staff-quan', role: 'staff' },
    { userId: 'staff-an', role: 'staff' },
    { userId: 'staff-vy', role: 'staff' },
  ],
};

// Get the current user's role within a given service
export function getUserRoleInService(userId: string, serviceId: string): 'admin' | 'staff' | 'client' | null {
  const entries = serviceRoles[serviceId];
  if (!entries) return null;
  const entry = entries.find(e => e.userId === userId);
  return entry ? entry.role : null;
}

// ══════════════════════════════════════════
// ── All People Directory ─────────────────
// ══════════════════════════════════════════
// These are the staff members, clients, and people who can be added.
export const allPeople: ServiceMember[] = [
  // ── New Staff Team ──
  { id: 'staff-huy',  name: 'Huy',         role: 'DevOps Specialist',      avatar: '', type: 'staff', dateAdded: 'Nov 05, 2023', status: 'online',  initials: 'H' },
  { id: 'staff-quan', name: 'Quan',        role: 'Backend Engineer',       avatar: '', type: 'staff', dateAdded: 'Dec 01, 2023', status: 'online',  initials: 'Q' },
  { id: 'staff-an',   name: 'An',          role: 'Frontend Engineer',      avatar: '', type: 'staff', dateAdded: 'Dec 05, 2023', status: 'online',  initials: 'A' },
  { id: 'staff-vy',   name: 'Vy',          role: 'Security Analyst',       avatar: '', type: 'staff', dateAdded: 'Dec 10, 2023', status: 'online',  initials: 'V' },

  // ── The 3 main users as ServiceMember format (for display in lists) ──
  { id: 'anhdoo',     name: 'Anh Doo',         role: 'System Admin',           avatar: allUsers[0].avatar, type: 'staff', dateAdded: 'Aug 01, 2023', status: 'online',  initials: 'AD' },
  { id: 'dat',        name: 'DAT',             role: 'System Admin',           avatar: allUsers[1].avatar, type: 'staff', dateAdded: 'Aug 01, 2023', status: 'online',  initials: 'DA' },
  { id: 'cuong',      name: 'CUONG',           role: 'System Admin',           avatar: allUsers[2].avatar, type: 'staff', dateAdded: 'Aug 01, 2023', status: 'online',  initials: 'CU' },

  // ── 5 Other people who can be added to any service ──
  { id: 'person-1',   name: 'Hoang Minh',      role: '@hoangminh',             avatar: '', type: 'staff', dateAdded: '',             status: 'online',  initials: 'HM' },
  { id: 'person-2',   name: 'Do Thanh',        role: '@dothanh',               avatar: '', type: 'staff', dateAdded: '',             status: 'online',  initials: 'DT' },
  { id: 'person-3',   name: 'Bui Ngoc',        role: '@buingoc',               avatar: '', type: 'staff', dateAdded: '',             status: 'offline', initials: 'BN' },
  { id: 'person-4',   name: 'Dang Quang',      role: '@dangquang',             avatar: '', type: 'staff', dateAdded: '',             status: 'online',  initials: 'DQ' },
  { id: 'person-5',   name: 'Ly Hien',         role: '@lyhien',                avatar: '', type: 'staff', dateAdded: '',             status: 'offline', initials: 'LH' },
];

// ══════════════════════════════════════════
// ── Services ─────────────────────────────
// ══════════════════════════════════════════

export const mockServices: Service[] = [
  {
    id: 'aws',
    name: 'AWS Infrastructure',
    description: 'Enterprise-grade cloud monitoring for EC2, S3, and RDS instances.',
    icon: 'cloud',
    iconColor: '#f97316',
    status: 'connected',
    statusText: 'Last ping: 2ms ago',
    apps: [
      { id: 'ec2', name: 'EC2 Manager', description: 'Instance lifecycle management and auto-scaling.', icon: 'dns', status: 'active', statusText: '42 Instances' },
      { id: 's3', name: 'S3 Storage', description: 'Object storage monitoring and access control.', icon: 'cloud_queue', status: 'active', statusText: '8.4 TB used' },
      { id: 'rds', name: 'RDS Database', description: 'Relational database performance monitoring.', icon: 'storage', status: 'syncing', statusText: '3 Clusters' },
      { id: 'lambda', name: 'Lambda Functions', description: 'Serverless compute execution monitoring.', icon: 'functions', status: 'active', statusText: '156 Functions' },
    ],
  },
  {
    id: 'gcloud',
    name: 'Google Cloud',
    description: 'Real-time health telemetry for GKE and Firebase clusters.',
    icon: 'google',
    iconColor: '#60a5fa',
    status: 'connected',
    statusText: 'Last ping: 14ms ago',
    apps: [
      { id: 'drive', name: 'Google Drive', description: 'Centralized cloud storage and file synchronization for teams.', icon: 'cloud_queue', status: 'active', statusText: '4.2 TB used' },
      { id: 'gemini', name: 'Gemini AI', description: 'Advanced LLM integration for automated incident response.', icon: 'smart_toy', status: 'active', statusText: 'API: v1.5 Pro' },
      { id: 'photos', name: 'Google Photos', description: 'Visual asset repository and automated image indexing.', icon: 'photo_library', status: 'syncing', statusText: '12.5k Assets' },
      { id: 'gmail', name: 'Gmail Admin', description: 'Secure communication gateway and enterprise mail server.', icon: 'alternate_email', status: 'idle', statusText: '250 Users' },
    ],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Frontend cloud platform for static sites and serverless functions.',
    icon: 'deployed_code',
    iconColor: '#f5f5f5',
    status: 'connected',
    statusText: 'Last deploy: 5m ago',
    apps: [
      { id: 'deployments', name: 'Deployments', description: 'Production and preview deployment management.', icon: 'rocket_launch', status: 'active', statusText: '18 Active' },
      { id: 'analytics', name: 'Web Analytics', description: 'Real-time visitor analytics and performance metrics.', icon: 'monitoring', status: 'active', statusText: '45k/day' },
      { id: 'edge', name: 'Edge Functions', description: 'Serverless edge compute for low-latency responses.', icon: 'bolt', status: 'active', statusText: '12 Functions' },
      { id: 'domains', name: 'Domains', description: 'Custom domain management and SSL certificate automation.', icon: 'language', status: 'idle', statusText: '6 Domains' },
    ],
  },
  {
    id: 'meta',
    name: 'Meta API',
    description: 'Graph API performance tracking and latency distribution logs.',
    icon: 'public',
    iconColor: '#2563eb',
    status: 'alert',
    statusText: 'Latency Spike: 450ms',
    apps: [
      { id: 'graph', name: 'Graph API', description: 'Social graph data access and performance monitoring.', icon: 'share', status: 'active', statusText: 'v18.0' },
      { id: 'messenger', name: 'Messenger Bot', description: 'Automated customer engagement and support pipeline.', icon: 'chat', status: 'active', statusText: '2.4k Users' },
      { id: 'ads', name: 'Ads Manager', description: 'Campaign performance analytics and budget tracking.', icon: 'campaign', status: 'idle', statusText: '3 Campaigns' },
    ],
  },
  {
    id: 'github',
    name: 'GitHub Actions',
    description: 'CI/CD pipeline monitoring and build success rate metrics.',
    icon: 'code_blocks',
    iconColor: '#d4e4fa',
    status: 'standby',
    statusText: 'Last build: 2h ago',
    apps: [
      { id: 'actions', name: 'Actions Runner', description: 'Workflow execution and runner fleet management.', icon: 'play_circle', status: 'active', statusText: '8 Runners' },
      { id: 'repos', name: 'Repositories', description: 'Code repository monitoring and security scanning.', icon: 'folder_copy', status: 'active', statusText: '24 Repos' },
    ],
  },
  {
    id: 'slack',
    name: 'Slack Webhooks',
    description: 'Alert forwarding and interactive incident management commands.',
    icon: 'forum',
    iconColor: '#a855f7',
    status: 'connected',
    statusText: 'Channels: #ops-alerts',
    apps: [
      { id: 'webhooks', name: 'Webhook Manager', description: 'Automated alert routing and notification pipelines.', icon: 'webhook', status: 'active', statusText: '12 Hooks' },
      { id: 'bot', name: 'Slack Bot', description: 'Interactive slash commands for incident management.', icon: 'smart_toy', status: 'active', statusText: 'v2.1' },
    ],
  },
  {
    id: 'azure',
    name: 'Azure DevOps',
    description: 'Lifecycle management and security scanning for enterprise apps.',
    icon: 'lan',
    iconColor: '#3b82f6',
    status: 'connected',
    statusText: 'Status: Optimized',
    apps: [
      { id: 'pipelines', name: 'Pipelines', description: 'Build and release pipeline monitoring.', icon: 'route', status: 'active', statusText: '6 Pipelines' },
      { id: 'boards', name: 'Boards', description: 'Agile project management and work item tracking.', icon: 'view_kanban', status: 'active', statusText: '89 Items' },
    ],
  },
  {
    id: 'datadog',
    name: 'Datadog Sync',
    description: 'High-resolution metric ingestion and historical data analysis.',
    icon: 'insights',
    iconColor: '#7c3aed',
    status: 'connected',
    statusText: 'Active: 124 metrics',
    apps: [
      { id: 'metrics', name: 'Metrics Explorer', description: 'Real-time metric visualization and alerting.', icon: 'monitoring', status: 'active', statusText: '124 Metrics' },
      { id: 'logs', name: 'Log Management', description: 'Centralized log aggregation and pattern analysis.', icon: 'description', status: 'active', statusText: '2.1M/day' },
    ],
  },
];

// ══════════════════════════════════════════
// ── Per-Service Members & Clients ────────
// ══════════════════════════════════════════

// Get staff members for a specific service
export function getStaffForService(serviceId: string): ServiceMember[] {
  const roles = serviceRoles[serviceId];
  if (!roles) return [];
  const staffIds = roles.filter(r => r.role === 'staff' || r.role === 'admin').map(r => r.userId);
  return allPeople.filter(p => staffIds.includes(p.id));
}

// Get clients for a specific service
export function getClientsForService(serviceId: string): ServiceMember[] {
  const roles = serviceRoles[serviceId];
  if (!roles) return [];
  const clientIds = roles.filter(r => r.role === 'client').map(r => r.userId);
  return allPeople
    .filter(p => clientIds.includes(p.id))
    .map(p => ({ ...p, type: 'client' as const }));
}

// Get the admin user for a service
export function getAdminForService(serviceId: string): ServiceMember | undefined {
  const roles = serviceRoles[serviceId];
  if (!roles) return undefined;
  const adminEntry = roles.find(r => r.role === 'admin');
  if (!adminEntry) return undefined;
  return allPeople.find(p => p.id === adminEntry.userId);
}

// ── Mutation: Add a person to a service ──
export function addMemberToService(
  serviceId: string,
  personId: string,
  role: 'staff' | 'client'
): boolean {
  if (!serviceRoles[serviceId]) {
    serviceRoles[serviceId] = [];
  }
  // Don't add duplicates
  const existing = serviceRoles[serviceId].find(e => e.userId === personId);
  if (existing) return false;

  // Update the person's dateAdded in allPeople
  const person = allPeople.find(p => p.id === personId);
  if (person && !person.dateAdded) {
    person.dateAdded = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  serviceRoles[serviceId].push({ userId: personId, role });
  return true;
}

// ── Mutation: Remove a person from a service ──
export function removeMemberFromService(
  serviceId: string,
  personId: string
): boolean {
  const roles = serviceRoles[serviceId];
  if (!roles) return false;
  // Don't allow removing the admin
  const entry = roles.find(e => e.userId === personId);
  if (!entry || entry.role === 'admin') return false;

  serviceRoles[serviceId] = roles.filter(e => e.userId !== personId);
  return true;
}

// ── Get people who are NOT yet in a service (available to add) ──
export function getAvailablePeopleForService(serviceId: string): ServiceMember[] {
  const roles = serviceRoles[serviceId] || [];
  const existingIds = new Set(roles.map(r => r.userId));
  return allPeople.filter(p => !existingIds.has(p.id));
}

// Legacy aliases
export function getMembersForService(serviceId: string): ServiceMember[] {
  return getStaffForService(serviceId);
}
export const mockClients = getClientsForService('gcloud');
export const mockSearchResults: ServiceMember[] = allPeople.filter(p =>
  ['person-1', 'person-2', 'person-3', 'person-4', 'person-5'].includes(p.id)
);
export const mockServiceMembers: Record<string, ServiceMember[]> = {
  default: getStaffForService('aws'),
};

// ══════════════════════════════════════════
// ── Chat (derived from real users) ───────
// ══════════════════════════════════════════

// The bot is always present in every chat
export const incidentXBot: ChatParticipant = {
  id: 'bot',
  name: 'IncidentX Bot',
  role: 'Active Analysis',
  avatar: '',
  type: 'bot',
  isOnline: true,
};

// Convert a ServiceMember to a ChatParticipant
function memberToParticipant(m: ServiceMember, type: 'staff' | 'customer'): ChatParticipant {
  return {
    id: m.id,
    name: m.name,
    role: m.role,
    avatar: m.avatar,
    type,
    isOnline: m.status === 'online',
  };
}

// Convert a User to a ChatParticipant
function userToParticipant(u: User, type: 'staff' | 'customer'): ChatParticipant {
  return {
    id: u.id,
    name: u.name,
    role: u.role === 'admin' ? 'Admin' : u.role === 'staff' ? 'Staff' : 'Client',
    avatar: u.avatar,
    type,
    isOnline: true,
  };
}

// Build chat participants for a service (staff/admin team + currently chatting client + bot)
export function getChatParticipantsForService(
  serviceId: string,
  activeClientId?: string
): { staff: ChatParticipant[]; clients: ChatParticipant[]; bot: ChatParticipant } {
  const roles = serviceRoles[serviceId] || [];

  // Staff/admin participants
  const staffEntries = roles.filter(r => r.role === 'staff' || r.role === 'admin');
  const staff: ChatParticipant[] = staffEntries.map(entry => {
    const user = allUsers.find(u => u.id === entry.userId);
    const person = allPeople.find(p => p.id === entry.userId);
    if (user) return userToParticipant(user, 'staff');
    if (person) return memberToParticipant(person, 'staff');
    return { id: entry.userId, name: entry.userId, role: entry.role, avatar: '', type: 'staff' as const, isOnline: true };
  });

  // Active client in this chat
  const clients: ChatParticipant[] = [];
  if (activeClientId) {
    const user = allUsers.find(u => u.id === activeClientId);
    const person = allPeople.find(p => p.id === activeClientId);
    if (user) clients.push(userToParticipant(user, 'customer'));
    else if (person) clients.push(memberToParticipant(person, 'customer'));
  }

  return { staff, clients, bot: incidentXBot };
}

// Get all clients for a service (for the "Switch Client" panel)
export function getClientListForService(serviceId: string): ChatParticipant[] {
  const roles = serviceRoles[serviceId] || [];
  const clientEntries = roles.filter(r => r.role === 'client');
  return clientEntries.map(entry => {
    const user = allUsers.find(u => u.id === entry.userId);
    const person = allPeople.find(p => p.id === entry.userId);
    if (user) return userToParticipant(user, 'customer');
    if (person) return memberToParticipant(person, 'customer');
    return { id: entry.userId, name: entry.userId, role: 'Client', avatar: '', type: 'customer' as const, isOnline: false };
  });
}

// Generate mock chat messages for a specific client conversation
export function getChatMessagesForClient(
  serviceId: string,
  _appId: string,
  clientId: string
): ChatMessage[] {
  const participants = getChatParticipantsForService(serviceId, clientId);
  const client = participants.clients[0];
  const firstStaff = participants.staff[0];
  const secondStaff = participants.staff[1];

  if (!client) {
    // No client — return a generic system log
    return [
      {
        id: 'msg0',
        sender: { id: 'sys', name: 'System', role: 'System', avatar: '', type: 'bot', isOnline: true },
        content: '[SYSTEM LOG] No active client session. Waiting for connection...',
        timestamp: '08:42 AM',
        type: 'system',
      },
    ];
  }

  const clientName = client.name.split(' ')[0];
  const staffName = firstStaff?.name.split(' ')[0] || 'Staff';

  return [
    {
      id: `msg-${clientId}-0`,
      sender: { id: 'sys', name: 'System', role: 'System', avatar: '', type: 'bot', isOnline: true },
      content: `[SYSTEM LOG] 08:42:15 - Incident opened by ${client.name}`,
      timestamp: '08:42 AM',
      type: 'system',
    },
    {
      id: `msg-${clientId}-1`,
      sender: client,
      content: `Hi team, we're seeing intermittent errors on our end. Dashboard metrics are showing elevated error rates over the last 15 minutes. Can you investigate?`,
      timestamp: '08:43 AM',
      type: 'customer',
    },
    {
      id: `msg-${clientId}-2`,
      sender: participants.bot,
      content: `Analyzing telemetry for ${client.name}'s account... I've detected anomalous patterns in the request pipeline. Initiating automated diagnostics. ETA for initial report: 2 minutes.`,
      timestamp: '08:43 AM',
      type: 'bot',
    },
    ...(firstStaff ? [{
      id: `msg-${clientId}-3`,
      sender: firstStaff,
      content: `${clientName}, I'm on it. Let me check the logs and correlate with our monitoring dashboards. We'll have an update for you shortly.`,
      timestamp: '08:44 AM',
      type: 'staff' as const,
    }] : []),
    ...(secondStaff ? [{
      id: `msg-${clientId}-4`,
      sender: secondStaff,
      content: `${staffName}, I'm pulling up the infrastructure metrics. Looks like there might be a connection pool issue. Investigating now.`,
      timestamp: '08:45 AM',
      type: 'staff' as const,
    }] : []),
  ];
}

// Legacy exports (for backward compatibility if needed)
export const mockChatParticipants: ChatParticipant[] = [
  { id: 'cp1', name: 'Alex Rivera', role: 'VP of Engineering', avatar: '', type: 'customer', isOnline: true },
  ...getChatParticipantsForService('aws').staff,
  incidentXBot,
];

export const mockChatMessages: ChatMessage[] = getChatMessagesForClient('gcloud', 'drive', 'anhdoo');

// ══════════════════════════════════════════
// ── Team Members (for intro page) ────────
// ══════════════════════════════════════════

export const mockTeamMembers: TeamMember[] = [
  { id: 't1', name: 'Dr. Alex Rivers', title: 'Chief Architect', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1UUgUn8aCkUdJqK8XZ5zDdTTF7VvBeR_4zIUhVHeBxMS604P9PLqm0K2JK9JWouFRlcjWLmH1zeZRhxMnZe5YJHKkeXthbg665c3F4RXobmhnY_Xv5A3J_uUAdRqo-0v96HsL-_Uwb9-PFKDtBjvCHHgmRwFTzjVl9hP_onXo6THf83HWsH_n0g-L5OWO-0zgC7YeahvxafjKjUoaQbPAtEb1GVfvmP4c84QotKDXhfzNFRb9stwG3Nu_ZwH5vLk9pKCUQQX0Auj5' },
  { id: 't2', name: 'Sarah Chen', title: 'Head of Security', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBBkRWtAXwhJRHEu6W55HtQSqOX4SX7n6R6vwkxFpJkMh85G-jEE9AZh8CEqOU4WQ6o6KyEBnrpFcbFJBJY8OwdnREK_SskU5DvB5FNPggVgmkvv432RbkZR5tgRDrp9fvhNp5H5f6o_RTqLOgYUsCLAaGsckpHG4tIgEB4KpRayxzwAS7zyICLIRRMTAtLpeaNI0yk8VohIoOBLMDpAAfnJipGir0XopSuGyineg4xIXlUv6S6q8IyikFoWS8lb9K0Y-oHQxUx_qh' },
  { id: 't3', name: 'Marcus Thorne', title: 'VP Operations', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnA2P18NTsf2aaTafzIkWAjpiZJ0cBxLt43Oe5QfOq3NjiQKo0cefA-bEXpRw9lJvI2dXFHxzk5PCqjiCs4ngO-yj68tzP7sUMF1x3-WwmYaH140Q89-zviVlYF6FU39IlE9eFil0mid8G0x5U3HjHmtowGfYe4QKpUwBH0PNXY_dxarLxfYTlG3dRov-WKqtN2ksmsKhdBAT0W4E5F_2Q5ZowqYTVaYgaiuPi5cfRmT6uSi6n89K326S9cOgWMyR_PK3GHczJe_yi' },
  { id: 't4', name: 'Elena Vance', title: 'Product Lead', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuih2fT4Ez6IcPw7sSlH3nQC0kfuZ-nrwe2eP6rq2zZTXhqOKEB1WCSp1O3wIPRYAZoQ_5q3zbHfLry9Acc-9IUKJPUdizgWs-9MfWwFD-bixz62diHvbVYT27Un1-uS2ppUasN_ss49vDXpe3Tljp8qcSmfkEr2t0dU6KrD5JI1xNkXQQ_rZeF241oZfvZePX4RnqOdiR16CqmTXd4Q7TKKac9fZtadhIHyMj9j2unG5dHMSnF2ruEdPZNg_AbOi6UfyZ8Ldsjyjd' },
];

// ══════════════════════════════════════════
// ── Helpers ──────────────────────────────
// ══════════════════════════════════════════

export function getServiceById(id: string): Service | undefined {
  return mockServices.find(s => s.id === id);
}

export function getAppById(serviceId: string, appId: string): { service: Service; app: Service['apps'][0] } | undefined {
  const service = getServiceById(serviceId);
  if (!service) return undefined;
  const app = service.apps.find(a => a.id === appId);
  if (!app) return undefined;
  return { service, app };
}
