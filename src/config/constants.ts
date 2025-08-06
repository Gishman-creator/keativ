// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login/`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout/`,
    REGISTER: `${API_BASE_URL}/api/auth/register/`,
    USER: `${API_BASE_URL}/api/auth/user/`,
    PROFILE: `${API_BASE_URL}/api/auth/profile/`,
    REFRESH: `${API_BASE_URL}/api/auth/token/refresh/`,
  },
  
  // Posts
  POSTS: {
    LIST: `${API_BASE_URL}/api/posts/`,
    CREATE: `${API_BASE_URL}/api/posts/`,
    DETAIL: (id: string) => `${API_BASE_URL}/api/posts/${id}/`,
    TEMPLATES: `${API_BASE_URL}/api/posts/templates/`,
    SCHEDULE: (id: string) => `${API_BASE_URL}/api/posts/${id}/schedule/`,
  },
  
  // Analytics
  ANALYTICS: {
    OVERVIEW: `${API_BASE_URL}/api/analytics/overview/`,
    POSTS: `${API_BASE_URL}/api/analytics/posts/`,
    ENGAGEMENT: `${API_BASE_URL}/api/analytics/engagement/`,
    REPORTS: `${API_BASE_URL}/api/analytics/reports/`,
  },
  
  // Social Media Accounts
  SOCIAL_ACCOUNTS: `${API_BASE_URL}/api/auth/social-accounts/`,
  
  // Collaborators
  COLLABORATORS: {
    LIST: `${API_BASE_URL}/api/collaborators/`,
    INVITE: `${API_BASE_URL}/api/collaborators/invite/`,
    PERMISSIONS: (id: string) => `${API_BASE_URL}/api/collaborators/${id}/permissions/`,
  },
  
  // Influencers
  INFLUENCERS: {
    LIST: `${API_BASE_URL}/api/influencers/`,
    ANALYTICS: `${API_BASE_URL}/api/influencers/analytics/`,
    IMPORT: `${API_BASE_URL}/api/influencers/import/`,
  },
  
  // Health Check
  HEALTH: `${API_BASE_URL}/api/health/`,
};

export const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'twitter', name: 'Twitter', color: '#1DA1F2' },
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000' }
];

export const BRAND_COLORS = {
  text: '#2D3748',
  background: '#FFFFFF',
  primary: '#EF4444',
  secondary: '#8B5CF6',
  accent: '#F3F4F6'
};

export const POST_STATUSES = [
  { value: 'draft', label: 'Draft', color: '#6B7280' },
  { value: 'scheduled', label: 'Scheduled', color: '#F59E0B' },
  { value: 'published', label: 'Published', color: '#10B981' },
  { value: 'failed', label: 'Failed', color: '#EF4444' }
];