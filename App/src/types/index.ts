// ===== IncidentX Type Definitions =====

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  role: 'admin' | 'staff' | 'client';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;       // Material Symbol name
  iconColor: string;  // CSS color class
  status: 'connected' | 'alert' | 'standby';
  statusText: string;
  apps: ServiceApp[];
}

export interface ServiceApp {
  id: string;
  name: string;
  description: string;
  icon: string;       // Material Symbol name
  status: 'active' | 'syncing' | 'idle';
  statusText: string;
}

export interface ServiceMember {
  id: string;
  name: string;
  role: string;      // e.g. "Security Lead", "DevOps Eng."
  avatar: string;
  type: 'staff' | 'client';
  dateAdded: string;
  status: 'online' | 'offline';
  initials: string;
}

export interface Suggestion {
  username: string;
  displayName: string;
  score: number;
  reason: string;
}

export interface ChatMessage {
  id: string;
  sender: ChatParticipant;
  content: string;
  timestamp: string;
  type: 'customer' | 'staff' | 'bot' | 'system';
  suggestions?: Suggestion[];
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  type: 'customer' | 'staff' | 'bot';
  isOnline: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  avatar: string;
}

// Auth context types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// Route params
export interface ServiceRouteParams {
  serviceId: string;
}

export interface ChatRouteParams {
  serviceId: string;
  appId: string;
}
