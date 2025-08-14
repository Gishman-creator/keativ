/**
 * API Service Layer for SMMS Frontend
 */

import { API_ENDPOINTS } from '@/config/constants';

// Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  profile?: {
    company_name: string;
    avatar?: string;
    subscription_type: string;
    timezone: string;
  };
}

export interface Post {
  id: string;
  content: string;
  caption: string;
  hashtags: string;
  image?: string;
  video?: string;
  scheduled_time: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  platform: string;
  post_type: 'post' | 'story' | 'reel' | 'video';
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  is_active: boolean;
  follower_count: number;
  profile_image_url?: string;
  connected_at: string;
}

export interface UserProfileData {
  company_name?: string;
  avatar?: string;
  subscription_type?: string;
  timezone?: string;
  time_format?: string;
  email_notifications?: boolean;
  slack_notifications?: boolean;
  [key: string]: unknown;
}

export interface SocialAccountCredentials {
  access_token?: string;
  refresh_token?: string;
  username?: string;
  password?: string;
  api_key?: string;
  api_secret?: string;
  [key: string]: unknown;
}

export interface TwitterAccount {
  id: string;
  username: string;
  name: string;
  followers_count: number;
  following_count: number;
  verified: boolean;
  created: boolean;
}

export interface TwitterPost {
  id: string;
  tweet_id: string;
  text: string;
  url: string;
  published_at: string;
}

export interface Tweet {
    id: string;
    text: string;
    created_at: string;
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
    url: string;
    has_media: boolean;
    media_keys?: string[];
}

export interface TweetAnalytics {
    success: boolean;
    tweet_id: string;
    metrics: {
        retweet_count: number;
        like_count: number;
        reply_count: number;
        quote_count: number;
        impression_count: number;
    };
    created_at: string;
    text: string;
    url: string;
}

export interface MyTwitterPost {
    id: string;
    user: number;
    social_media_account: string;
    tweet_text: string;
    tweet_id: string;
    media_paths: string[];
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
    impression_count: number;
    status: string;
    scheduled_at: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    error_message: string | null;
    last_analytics_update: string | null;
    twitter_url?: string;
    engagement_rate?: number;
    total_engagements?: number;
}

export interface TwitterRateLimit {
    success: boolean;
    data: unknown;
    timestamp: string;
}

export interface PostTweetPayload {
    tweet_text: string;
    media_paths?: string[];
    scheduled_at?: string;
    [key: string]: unknown;
}

export interface TwitterOAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  [key: string]: unknown;
}

export interface TwitterCallbackAccount {
  id: string;
  username: string;
  name?: string;
  profile_image_url?: string;
  [key: string]: unknown;
}

export interface TwitterCallbackResponse {
  account: TwitterCallbackAccount;
  tokens: TwitterOAuthTokens;
}

// Integration extra types
export interface SlackHistoryItem { type?: string; user?: string; text?: string; ts: string }
export interface SlackHistoryResponse { ok: boolean; messages?: SlackHistoryItem[]; error?: string; response_metadata?: { next_cursor?: string } }
export interface SlackConversation {
  id: string;
  name?: string;
  is_channel?: boolean;
  is_group?: boolean;
  is_im?: boolean;
  user?: string; // present for IMs
  is_member?: boolean;
  created?: number;
}
export interface SlackAuthStatus { ok: boolean; auth_test?: Record<string, unknown>; scopes?: string[]; error?: string }
export interface DriveFile { id: string; name: string; mime_type?: string }
export interface DriveFilesResponse { files: DriveFile[] }
export interface DropboxFile { id: string; name: string; path: string }
export interface DropboxFilesResponse { files: DropboxFile[] }
export interface HashtagSuggestions { hashtags: string[] }
export interface OptimalPostingTime { hour: number; score?: number; recommendation?: string; avg_engagement?: number; avg_reach?: number }
export interface OptimalPostingTimesResponse { optimal_posting_times?: OptimalPostingTime[]; optimal_times?: unknown; confidence?: number; analysis_period?: string }
export interface CalendarShareResponse { queued: boolean; slack: number; emails: number }

export interface BindTwitterTokensPayload extends Record<string, unknown> {
  account: TwitterCallbackAccount;
  tokens: TwitterOAuthTokens;
}

// LinkedIn Types
export interface LinkedInAccount {
  id: string;
  platform: string;
  username: string;
  display_name: string;
  profile_image_url?: string;
  is_verified: boolean;
}

export interface LinkedInPost {
  success: boolean;
  message: string;
  post_id: string;
  url?: string;
}

export interface LinkedInOAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  [key: string]: unknown;
}

export interface LinkedInCallbackAccount {
  platform: string;
  platform_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_image_url?: string;
  [key: string]: unknown;
}

export interface LinkedInCallbackResponse {
  account: LinkedInCallbackAccount;
  tokens: LinkedInOAuthTokens;
}

export interface BindLinkedInTokensPayload extends Record<string, unknown> {
  account: LinkedInCallbackAccount;
  tokens: LinkedInOAuthTokens;
}

export interface PostLinkedInPayload extends Record<string, unknown> {
  content: string;
}

export interface CalendarPostItem {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledDate: string; // ISO
  status: string;
}

// Scheduled Post types
export interface ScheduledPost {
  id: string;
  social_account: string | null;
  social_set: string | null;
  content: string;
  caption?: string;
  hashtags?: string;
  media_url?: string;
  scheduled_time: string; // ISO string
  timezone?: string;
  post_type?: 'post' | 'story' | 'reel' | 'video';
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  platform?: string;
  created_at?: string;
  updated_at?: string;
}

// Extra types for file uploads
export type PostCreateWithMedia = Omit<Partial<Post>, 'image' | 'video'> & {
  image?: File;
  video?: File;
};

// Type guards
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const isFileLike = (v: unknown): v is File => {
  if (!isRecord(v)) return false;
  return typeof v.name === 'string' && typeof v.size === 'number' && typeof v.type === 'string';
};

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    // Keep in sync if another tab updates auth_token
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'auth_token') {
          this.token = e.newValue;
        }
      });
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
  'Accept': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    return headers;
  }

  // Authorization-only headers (no Content-Type) for FormData requests
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (response.ok) {
        return {
          data,
          success: true,
        };
      } else {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        return {
          error: data.error || data.message || `HTTP ${response.status}: ${response.statusText}`,
          success: false,
          data: data // Include the error details from backend
        };
      }
    } catch (parseError) {
      console.error('Response parsing error:', parseError);
      return {
        error: `Network error or invalid response (${response.status})`,
        success: false,
      };
    }
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'GET',
  headers: this.getHeaders(),
  credentials: 'include',
      });
      return this.handleResponse<T>(response);
    } catch {
      return {
        error: 'Network error',
        success: false,
      };
    }
  }

  async post<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'POST',
  headers: this.getHeaders(),
  credentials: 'include',
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch {
      return {
        error: 'Network error',
        success: false,
      };
    }
  }

  async put<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
  headers: this.getHeaders(),
  credentials: 'include',
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch {
      return {
        error: 'Network error',
        success: false,
      };
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
  headers: this.getHeaders(),
  credentials: 'include',
      });
      return this.handleResponse<T>(response);
    } catch {
      return {
        error: 'Network error',
        success: false,
      };
    }
  }

  async patch<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
  headers: this.getHeaders(),
  credentials: 'include',
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch {
      return {
        error: 'Network error',
        success: false,
      };
    }
  }

  // Multipart helpers for file uploads
  async postForm<T>(url: string, form: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'POST',
  headers: this.getAuthHeaders(),
  credentials: 'include',
        body: form,
      });
        return this.handleResponse<T>(response);
    } catch {
      return { success: false, error: 'Network error' };
    }
  }

  async putForm<T>(url: string, form: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
  headers: this.getAuthHeaders(),
  credentials: 'include',
        body: form,
      });
      return this.handleResponse<T>(response);
    } catch {
      return { success: false, error: 'Network error' };
    }
  }

  // Authentication methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    if (!this.token && typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth_token');
      if (stored) this.token = stored;
    }
    return this.token;
  }

  // Twitter Integration Methods

  async verifyTwitterCredentials(): Promise<ApiResponse<{ success: boolean; message: string; account: TwitterAccount }>> {
    return this.get<{ success: boolean; message: string; account: TwitterAccount }>(API_ENDPOINTS.TWITTER_VERIFY);
  }

  async postTweet(payload: PostTweetPayload): Promise<ApiResponse<{ success: boolean; message: string; tweet: TwitterPost }>> {
    return this.post<{ success: boolean; message: string; tweet: TwitterPost }>(API_ENDPOINTS.TWITTER_POST, payload);
  }

  async getUserTweets(count: number = 10): Promise<ApiResponse<{ success: boolean; tweets: Tweet[]; count: number }>> {
    return this.get<{ success: boolean; tweets: Tweet[]; count: number }>(`${API_ENDPOINTS.TWITTER_USER_TWEETS}?count=${count}`);
  }

  async getTweetAnalytics(tweetId: string): Promise<ApiResponse<{ success: boolean; analytics: TweetAnalytics }>> {
    return this.get<{ success: boolean; analytics: TweetAnalytics }>(`${API_ENDPOINTS.TWITTER_TWEET_ANALYTICS}/${tweetId}/`);
  }

  async searchTweets(query: string, count: number = 10): Promise<ApiResponse<{ success: boolean; query: string; tweets: Tweet[]; count: number }>> {
    return this.get<{ success: boolean; query: string; tweets: Tweet[]; count: number }>(`${API_ENDPOINTS.TWITTER_SEARCH}?query=${encodeURIComponent(query)}&count=${count}`);
  }

  async deleteTweet(tweetId: string): Promise<ApiResponse<{ success: boolean; message: string; tweet_id: string }>> {
    return this.delete<{ success: boolean; message: string; tweet_id: string }>(`${API_ENDPOINTS.TWITTER_DELETE}/${tweetId}/`);
  }

  async getMyTwitterPosts(status?: string, limit: number = 20): Promise<ApiResponse<{ success: boolean; posts: MyTwitterPost[]; count: number }>> {
    let url = `${API_ENDPOINTS.TWITTER_MY_POSTS}?limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.get<{ success: boolean; posts: MyTwitterPost[]; count: number }>(url);
  }

  async getTwitterRateLimit(): Promise<ApiResponse<TwitterRateLimit>> {
    return this.get<TwitterRateLimit>(API_ENDPOINTS.TWITTER_RATE_LIMIT);
  }

  async getTwitterAuthorizeUrl(): Promise<ApiResponse<{ authorize_url: string }>> {
    return this.get<{ authorize_url: string }>(API_ENDPOINTS.TWITTER_AUTHORIZE);
  }

  async twitterCallback(params: { code: string; state?: string }): Promise<ApiResponse<TwitterCallbackResponse>> {
    const url = new URL(API_ENDPOINTS.TWITTER_CALLBACK);
    url.searchParams.set('code', params.code);
    if (params.state) url.searchParams.set('state', params.state);
    return this.get<TwitterCallbackResponse>(url.toString());
  }

  async bindTwitterTokens(payload: BindTwitterTokensPayload): Promise<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(API_ENDPOINTS.TWITTER_BIND_TOKENS, payload);
  }

  // LinkedIn Integration Methods

  async verifyLinkedInCredentials(): Promise<ApiResponse<{ success: boolean; message: string; account: LinkedInAccount }>> {
    return this.get<{ success: boolean; message: string; account: LinkedInAccount }>(API_ENDPOINTS.LINKEDIN_VERIFY);
  }

  async postLinkedInShare(payload: PostLinkedInPayload): Promise<ApiResponse<{ success: boolean; message: string; post: LinkedInPost }>> {
    return this.post<{ success: boolean; message: string; post: LinkedInPost }>(API_ENDPOINTS.LINKEDIN_POST, payload);
  }

  async getLinkedInAuthorizeUrl(): Promise<ApiResponse<{ authorize_url: string }>> {
    return this.get<{ authorize_url: string }>(API_ENDPOINTS.LINKEDIN_AUTHORIZE);
  }

  async linkedInCallback(params: { code: string; state?: string }): Promise<ApiResponse<LinkedInCallbackResponse>> {
    const url = new URL(API_ENDPOINTS.LINKEDIN_CALLBACK);
    url.searchParams.set('code', params.code);
    if (params.state) url.searchParams.set('state', params.state);
    return this.get<LinkedInCallbackResponse>(url.toString());
  }

  async bindLinkedInTokens(payload: BindLinkedInTokensPayload): Promise<ApiResponse<{ success: boolean }>> {
    return this.post<{ success: boolean }>(API_ENDPOINTS.LINKEDIN_BIND_TOKENS, payload);
  }

  // Posts API Methods
  async getPosts(params?: { page?: number; status?: string; platform?: string }): Promise<ApiResponse<{ results: Post[]; count: number }>> {
    const url = new URL(API_ENDPOINTS.POSTS.LIST);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    return api.get<{ results: Post[]; count: number }>(url.toString());
  }

  async createPost(postData: Partial<Post>): Promise<ApiResponse<Post>> {
    return api.post<Post>(API_ENDPOINTS.POSTS.CREATE, postData);
  }

  // Create post with files using FormData
  async createPostWithFiles(data: PostCreateWithMedia): Promise<ApiResponse<Post>> {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (k === 'image' || k === 'video') {
        if (isFileLike(v)) {
          fd.append(k, v);
        } else {
          fd.append(k, String(v));
        }
      } else {
        fd.append(k, String(v));
      }
    });
    return api.postForm<Post>(API_ENDPOINTS.POSTS.CREATE, fd);
  }

  async updatePost(id: string, postData: Partial<Post>): Promise<ApiResponse<Post>> {
    return api.put<Post>(API_ENDPOINTS.POSTS.DETAIL(id), postData);
  }

  // Update post with files using FormData
  async updatePostWithFiles(id: string, data: PostCreateWithMedia): Promise<ApiResponse<Post>> {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (k === 'image' || k === 'video') {
        if (isFileLike(v)) {
          fd.append(k, v);
        } else {
          fd.append(k, String(v));
        }
      } else {
        fd.append(k, String(v));
      }
    });
    return api.putForm<Post>(API_ENDPOINTS.POSTS.DETAIL(id), fd);
  }

  async deletePost(id: string): Promise<ApiResponse<void>> {
    return api.delete(API_ENDPOINTS.POSTS.DETAIL(id));
  }

  async getTemplates(): Promise<ApiResponse<Post[]>> {
    return api.get<Post[]>(API_ENDPOINTS.POSTS.TEMPLATES);
  }

  async getCalendarPosts(): Promise<ApiResponse<unknown>> {
    return api.get<unknown>(API_ENDPOINTS.POSTS.CALENDAR);
  }

  async schedulePost(id: string, scheduled_at_iso: string): Promise<ApiResponse<void>> {
    return api.post(API_ENDPOINTS.POSTS.SCHEDULE(id), { scheduled_at: scheduled_at_iso });
  }

  // Scheduled posts
  async getScheduledPosts(): Promise<ApiResponse<ScheduledPost[]>> {
    return api.get<ScheduledPost[]>(API_ENDPOINTS.POSTS.SCHEDULED_LIST);
  }

  async createScheduledPost(payload: Partial<ScheduledPost>): Promise<ApiResponse<ScheduledPost>> {
    return api.post<ScheduledPost>(API_ENDPOINTS.POSTS.SCHEDULED_LIST, payload as Record<string, unknown>);
  }

  async updateScheduledPost(id: string, payload: Partial<ScheduledPost>): Promise<ApiResponse<ScheduledPost>> {
    return api.put<ScheduledPost>(API_ENDPOINTS.POSTS.SCHEDULED_DETAIL(id), payload as Record<string, unknown>);
  }
}

export const api = new ApiClient();

// Small helper to ensure token is loaded early in app startup
export const bootstrapAuth = () => !!api.getToken();

// Specific API functions
export const authApi = {
  // Quick check for guards
  isAuthenticated: () => !!api.getToken(),

  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post<{ token: string; user: User }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    if (response.success && response.data?.token) {
      api.setToken(response.data.token);
    }
    return response;
  },
  // Integrations extras
  integrations: {
  slackHistory: async (channel: string): Promise<ApiResponse<SlackHistoryResponse>> => api.get(API_ENDPOINTS.INTEGRATIONS.SLACK_HISTORY(channel)),
  slackAuthStatus: async (): Promise<ApiResponse<SlackAuthStatus>> => api.get(API_ENDPOINTS.INTEGRATIONS.SLACK_AUTH_STATUS),
  googleDriveFiles: async (): Promise<ApiResponse<DriveFilesResponse>> => api.get(API_ENDPOINTS.INTEGRATIONS.GOOGLE_DRIVE_FILES),
  googleDriveImport: async (file_id: string): Promise<ApiResponse<{ imported: boolean; file_id: string }>> => api.post(API_ENDPOINTS.INTEGRATIONS.GOOGLE_DRIVE_IMPORT, { file_id }),
  dropboxFiles: async (): Promise<ApiResponse<DropboxFilesResponse>> => api.get(API_ENDPOINTS.INTEGRATIONS.DROPBOX_FILES),
  dropboxImport: async (path: string): Promise<ApiResponse<{ imported: boolean; path: string }>> => api.post(API_ENDPOINTS.INTEGRATIONS.DROPBOX_IMPORT, { path }),
  hashtagSuggestions: async (content: string, platform='instagram'): Promise<ApiResponse<HashtagSuggestions>> => api.post(API_ENDPOINTS.INTEGRATIONS.HASHTAG_SUGGEST, { content, platform }),
  optimalPostingTimes: async (): Promise<ApiResponse<OptimalPostingTimesResponse>> => api.get(API_ENDPOINTS.INTEGRATIONS.OPTIMAL_TIMES),
  shareCalendar: async (entries: {platform:string; scheduled_time:string; title:string; status:string}[], slack_recipients: string[], emails: string[]): Promise<ApiResponse<CalendarShareResponse>> => api.post('/api/messaging/share-calendar/', { entries, slack_recipients, emails }),
  },

  logout: async () => {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    api.clearToken();
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
    company_name?: string;
    role?: string;
  }) => {
    console.log('🚀 Attempting registration with data:', userData);
    const response = await api.post<{ message: string; user_id: number; username: string; profile_uuid: string }>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
    console.log('📥 Registration response:', response);
    return response;
  },

  getCurrentUser: async () => {
    return api.get<User>(API_ENDPOINTS.AUTH.USER);
  },

  updateProfile: async (profileData: UserProfileData) => {
    return api.put<User>(API_ENDPOINTS.AUTH.PROFILE, profileData);
  },

  verifyEmail: async (token: string) => {
    return api.get(`/api/auth/verify-email/${token}/`);
  },

  resendVerificationEmail: async (email: string) => {
    return api.post('/api/auth/resend-verification/', { email });
  },

  // Enhanced methods for navbar and settings integration
  uploadAvatar: async (avatarFile: File) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    return api.putForm<{ avatar: string; message: string }>(
      API_ENDPOINTS.AUTH.PROFILE,
      formData
    );
  },

  updatePassword: async (passwordData: {
    current_password: string;
    new_password: string;
  }) => {
    return api.post<{ message: string }>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
  },

  updateNotificationSettings: async (settings: {
    email_notifications?: boolean;
    slack_notifications?: boolean;
  }) => {
    return api.post<{ message: string; email_notifications: boolean; slack_notifications: boolean }>(
      API_ENDPOINTS.AUTH.UPDATE_NOTIFICATIONS,
      settings
    );
  },

  getUserStats: async () => {
    return api.get<{
      active_posts: number;
      scheduled_posts: number;
      unread_notifications: number;
    }>(API_ENDPOINTS.AUTH.STATS);
  },

  getAccountOverview: async () => {
    return api.get<{
      account_created: string;
      last_login: string;
      subscription_type: string;
      social_accounts_count: number;
      total_posts: number;
      team_memberships: number;
      storage_used: string;
      api_calls_this_month: number;
    }>(API_ENDPOINTS.AUTH.ACCOUNT_OVERVIEW);
  },

  // Account security methods
  enable2FA: async () => {
    return api.post<{ qr_code: string; secret: string }>('/api/auth/2fa/setup/', {});
  },

  confirm2FA: async (token: string) => {
    return api.post<{ message: string }>('/api/auth/2fa/confirm/', { token });
  },

  disable2FA: async (token: string) => {
    return api.post<{ message: string }>('/api/auth/2fa/disable/', { token });
  },

  getActiveSessions: async () => {
    return api.get<{ sessions: Array<{
      id: string;
      ip_address: string;
      user_agent: string;
      created_at: string;
      last_activity: string;
      is_current: boolean;
    }> }>('/api/auth/sessions/');
  },

  terminateSession: async (sessionId: string) => {
    return api.delete(`/api/auth/sessions/${sessionId}/`);
  },

  requestDataExport: async () => {
    return api.post<{ message: string; export_id: string }>('/api/auth/export-data/', {});
  },

  deleteAccount: async (password: string) => {
    return api.post<{ message: string }>('/api/auth/delete-account/', { password });
  },
};

// Slack API Client
export const slackApi = {
  listConversations: async (types?: string) => {
    const qs = types ? `?types=${encodeURIComponent(types)}` : '';
  return api.get<{ ok?: boolean; channels?: SlackConversation[]; response_metadata?: { next_cursor?: string } }>(`/api/integrations/slack/conversations/${qs}`);
  },
  sendMessage: async (recipient: string, text: string) => {
    return api.post<{ ok?: boolean; ts?: string; error?: string }>(`/api/integrations/slack/send/`, { recipient, text });
  }
};

export const postsApi = {
  getPosts: async (params?: {
    page?: number;
    status?: string;
    platform?: string;
  }) => {
    const url = new URL(API_ENDPOINTS.POSTS.LIST);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    return api.get<{ results: Post[]; count: number }>(url.toString());
  },

  createPost: async (postData: Partial<Post>) => {
    return api.post<Post>(API_ENDPOINTS.POSTS.CREATE, postData);
  },

  // New: create post with media files
  createPostWithMedia: async (data: PostCreateWithMedia) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (k === 'image' || k === 'video') {
        if (isFileLike(v)) {
          fd.append(k, v);
        } else {
          fd.append(k, String(v));
        }
      } else {
        fd.append(k, String(v));
      }
    });
    return api.postForm<Post>(API_ENDPOINTS.POSTS.CREATE, fd);
  },

  updatePost: async (id: string, postData: Partial<Post>) => {
    return api.put<Post>(API_ENDPOINTS.POSTS.DETAIL(id), postData);
  },

  // New: update post with media files
  updatePostWithMedia: async (id: string, data: PostCreateWithMedia) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (k === 'image' || k === 'video') {
        if (isFileLike(v)) {
          fd.append(k, v);
        } else {
          fd.append(k, String(v));
        }
      } else {
        fd.append(k, String(v));
      }
    });
    return api.putForm<Post>(API_ENDPOINTS.POSTS.DETAIL(id), fd);
  },

  deletePost: async (id: string) => {
    return api.delete(API_ENDPOINTS.POSTS.DETAIL(id));
  },

  getTemplates: async (): Promise<ApiResponse<Post[]>> => {
    return api.get<Post[]>(API_ENDPOINTS.POSTS.TEMPLATES);
  },

  getCalendarPosts: async (): Promise<ApiResponse<unknown>> => {
    return api.get<unknown>(API_ENDPOINTS.POSTS.CALENDAR);
  },

  schedulePost: async (id: string, scheduled_at_iso: string): Promise<ApiResponse<void>> => {
    return api.post(API_ENDPOINTS.POSTS.SCHEDULE(id), { scheduled_at: scheduled_at_iso });
  },

  // Scheduled posts
  listScheduled: async () => api.get<ScheduledPost[]>(API_ENDPOINTS.POSTS.SCHEDULED_LIST),
  createScheduled: async (payload: Partial<ScheduledPost>) =>
    api.post<ScheduledPost>(API_ENDPOINTS.POSTS.SCHEDULED_LIST, payload as Record<string, unknown>),
  updateScheduled: async (id: string, payload: Partial<ScheduledPost>) =>
    api.put<ScheduledPost>(API_ENDPOINTS.POSTS.SCHEDULED_DETAIL(id), payload as Record<string, unknown>),
};

export const analyticsApi = {
  getOverview: async (params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    const url = new URL(API_ENDPOINTS.ANALYTICS.OVERVIEW);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value);
        }
      });
    }
    return api.get(url.toString());
  },

  getPostAnalytics: async (postId?: string) => {
    const url = postId 
      ? `${API_ENDPOINTS.ANALYTICS.POSTS}?post_id=${postId}`
      : API_ENDPOINTS.ANALYTICS.POSTS;
    return api.get(url);
  },
};

export const socialAccountsApi = {
  getAccounts: async () => {
    return api.get<SocialAccount[]>(API_ENDPOINTS.SOCIAL_ACCOUNTS);
  },

  connectAccount: async (platform: string, credentials: Record<string, unknown>) => {
    return api.post<SocialAccount>(API_ENDPOINTS.SOCIAL_ACCOUNTS, {
      platform,
      ...credentials,
    });
  },

  disconnectAccount: async (accountId: string) => {
    return api.delete(`${API_ENDPOINTS.SOCIAL_ACCOUNTS}${accountId}/`);
  },
};

// Health check
export const healthApi = {
  check: async () => {
    return api.get(API_ENDPOINTS.HEALTH);
  },
};
