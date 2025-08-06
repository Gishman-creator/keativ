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

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
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
      });
      return this.handleResponse<T>(response);
    } catch {
      return {
        error: 'Network error',
        success: false,
      };
    }
  }

  // Authentication methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  getToken() {
    return this.token;
  }
}

export const api = new ApiClient();

// Specific API functions
export const authApi = {
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

  updatePost: async (id: string, postData: Partial<Post>) => {
    return api.put<Post>(API_ENDPOINTS.POSTS.DETAIL(id), postData);
  },

  deletePost: async (id: string) => {
    return api.delete(API_ENDPOINTS.POSTS.DETAIL(id));
  },

  getTemplates: async () => {
    return api.get<Post[]>(API_ENDPOINTS.POSTS.TEMPLATES);
  },
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
