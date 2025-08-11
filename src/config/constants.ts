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
    // Added: dashboard stats endpoint
    DASHBOARD: `${API_BASE_URL}/api/posts/dashboard/`,
    // Added: calendar endpoint for upcoming posts
    CALENDAR: `${API_BASE_URL}/api/posts/calendar/`,
    // Added: scheduled posts endpoints
    SCHEDULED_LIST: `${API_BASE_URL}/api/posts/scheduled/`,
    SCHEDULED_DETAIL: (id: string) => `${API_BASE_URL}/api/posts/scheduled/${id}/`,
  },
  
  // Analytics
  ANALYTICS: {
    // Updated: add actual dashboard endpoint exposed by backend
    DASHBOARD: `${API_BASE_URL}/api/analytics/dashboard/`,
    OVERVIEW: `${API_BASE_URL}/api/analytics/overview/`,
    POSTS: `${API_BASE_URL}/api/analytics/posts/`,
    ENGAGEMENT: `${API_BASE_URL}/api/analytics/engagement/`,
    REPORTS: `${API_BASE_URL}/api/analytics/reports/`,
    BEST_POSTS: `${API_BASE_URL}/api/analytics/best-posts/`,
    PLATFORM_AVERAGES: `${API_BASE_URL}/api/analytics/platform-averages/`,
  },
  
  // Social Media Accounts
  SOCIAL_ACCOUNTS: `${API_BASE_URL}/api/auth/social-accounts/`,
  
  // Collaborators (align with backend URLs)
  COLLABORATORS: {
    WORKSPACES: {
      LIST: `${API_BASE_URL}/api/collaborators/workspaces/`,
      DETAIL: (id: number | string) => `${API_BASE_URL}/api/collaborators/workspaces/${id}/`,
      STATS: (workspaceId: number | string) => `${API_BASE_URL}/api/collaborators/workspaces/${workspaceId}/stats/`,
      MEMBERS: (workspaceId: number | string) => `${API_BASE_URL}/api/collaborators/workspaces/${workspaceId}/members/`,
      INVITE: (workspaceId: number | string) => `${API_BASE_URL}/api/collaborators/workspaces/${workspaceId}/invite/`,
      REMOVE_MEMBER: (workspaceId: number | string, memberId: number | string) => `${API_BASE_URL}/api/collaborators/workspaces/${workspaceId}/members/${memberId}/remove/`,
    },
    POSTS: {
      COLLABORATION: (postId: number | string) => `${API_BASE_URL}/api/collaborators/posts/${postId}/collaboration/`,
      ASSIGN_REVIEW: (postId: number | string) => `${API_BASE_URL}/api/collaborators/posts/${postId}/assign-review/`,
      COMMENTS: (postId: number | string) => `${API_BASE_URL}/api/collaborators/posts/${postId}/comments/`,
    },
    REVIEWS: {
      LIST: (collaborationId: number | string) => `${API_BASE_URL}/api/collaborators/collaborations/${collaborationId}/reviews/`,
    },
  },
  
  // Influencers
  INFLUENCERS: {
    LIST: `${API_BASE_URL}/api/influencers/`,
    ANALYTICS: `${API_BASE_URL}/api/influencers/analytics/`,
    IMPORT: `${API_BASE_URL}/api/influencers/import/`,
  },
  
  // Health Check
  HEALTH: `${API_BASE_URL}/health/`,

  // Notifications
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/api/notifications/`,
    DETAIL: (id: number | string) => `${API_BASE_URL}/api/notifications/${id}/`,
    STATS: `${API_BASE_URL}/api/notifications/stats/`,
    MARK_ALL_READ: `${API_BASE_URL}/api/notifications/mark-all-read/`,
    BULK_MARK_READ: `${API_BASE_URL}/api/notifications/bulk-mark-read/`,
    CLEAR_ALL: `${API_BASE_URL}/api/notifications/clear-all/`,
    PREFERENCES: `${API_BASE_URL}/api/notifications/preferences/`,
    TEST: `${API_BASE_URL}/api/notifications/test/`,
  },

  // Core (Rate limiting & IP management)
  CORE: {
    RATE_LIMIT: {
      DASHBOARD: `${API_BASE_URL}/api/core/rate-limit/dashboard/`,
      LOGS: `${API_BASE_URL}/api/core/rate-limit/logs/`,
      STATS: `${API_BASE_URL}/api/core/rate-limit/stats/`,
      TEST: `${API_BASE_URL}/api/core/rate-limit/test/`,
    },
    IP: {
      WHITELIST: `${API_BASE_URL}/api/core/ip/whitelist/`,
      BLACKLIST: `${API_BASE_URL}/api/core/ip/blacklist/`,
    },
  },

  // Twitter Integration
  TWITTER_VERIFY: `${API_BASE_URL}/api/integrations/twitter/verify/`,
  TWITTER_POST: `${API_BASE_URL}/api/integrations/twitter/post/`,
  TWITTER_USER_TWEETS: `${API_BASE_URL}/api/integrations/twitter/tweets/`,
  TWITTER_TWEET_ANALYTICS: `${API_BASE_URL}/api/integrations/twitter/analytics`, // Note: tweet_id is appended in the API call
  TWITTER_SEARCH: `${API_BASE_URL}/api/integrations/twitter/search/`,
  TWITTER_DELETE: `${API_BASE_URL}/api/integrations/twitter/delete`, // Note: tweet_id is appended in the API call
  TWITTER_MY_POSTS: `${API_BASE_URL}/api/integrations/twitter/my-posts/`,
  TWITTER_RATE_LIMIT: `${API_BASE_URL}/api/integrations/twitter/rate-limit/`,
  // Added OAuth endpoints
  TWITTER_AUTHORIZE: `${API_BASE_URL}/api/integrations/twitter/authorize/`,
  TWITTER_CALLBACK: `${API_BASE_URL}/api/integrations/twitter/callback/`,
  TWITTER_BIND_TOKENS: `${API_BASE_URL}/api/integrations/twitter/bind-tokens/`,
  
  // Messaging
  MESSAGING: {
    MESSAGES: {
      LIST: `${API_BASE_URL}/api/messaging/messages/`,
      DETAIL: (id: string) => `${API_BASE_URL}/api/messaging/messages/${id}/`,
      SEND_NOW: `${API_BASE_URL}/api/messaging/messages/send/`,
      STATS: `${API_BASE_URL}/api/messaging/messages/stats/`,
    },
    AUTOMATED: {
      LIST: `${API_BASE_URL}/api/messaging/automated/`,
      DETAIL: (id: string) => `${API_BASE_URL}/api/messaging/automated/${id}/`,
      TOGGLE: (id: string) => `${API_BASE_URL}/api/messaging/automated/${id}/toggle/`,
      TEST: (id: string) => `${API_BASE_URL}/api/messaging/automated/${id}/test/`,
    },
  },

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