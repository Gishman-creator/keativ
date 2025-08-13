import { API_ENDPOINTS } from '@/config/constants';
import { InfluencerProfile, Campaign, CampaignApplication, InfluencerPortfolio, Collaboration } from '@/types';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Base fetch function with auth
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

export const influencerApi = {
  // Profile Management
  getProfile: (): Promise<InfluencerProfile> => authFetch(API_ENDPOINTS.INFLUENCERS.PROFILE),
  
  updateProfile: (data: Partial<InfluencerProfile>): Promise<InfluencerProfile> => 
    authFetch(API_ENDPOINTS.INFLUENCERS.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Dashboard Data
  getDashboard: (): Promise<{
    profile: InfluencerProfile;
    stats: {
      total_applications: number;
      active_campaigns: number;
      total_earnings: number;
      portfolio_items: number;
    };
    recent_applications: CampaignApplication[];
    portfolio_highlights: InfluencerPortfolio[];
  }> => authFetch(API_ENDPOINTS.INFLUENCERS.DASHBOARD),

  // Analytics
  getAnalytics: (): Promise<{
    follower_growth: Array<{ date: string; followers: number }>;
    engagement_trends: Array<{ date: string; engagement_rate: number }>;
    platform_breakdown: Array<{ platform: string; followers: number; engagement_rate: number }>;
    content_performance: Array<{ content_id: string; title: string; engagement: number; reach: number }>;
  }> => authFetch(API_ENDPOINTS.INFLUENCERS.ANALYTICS),

  // Influencer Discovery
  discoverInfluencers: (params?: {
    search?: string;
    niche?: string[];
    tier?: string[];
    min_followers?: number;
    max_followers?: number;
    min_engagement?: number;
    location?: string;
    is_verified?: boolean;
    page?: number;
    page_size?: number;
  }): Promise<{
    results: InfluencerProfile[];
    count: number;
    next?: string;
    previous?: string;
  }> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    return authFetch(`${API_ENDPOINTS.INFLUENCERS.DISCOVER}?${searchParams}`);
  },

  // Campaign Management
  getCampaigns: (params?: {
    status?: string;
    campaign_type?: string;
    page?: number;
  }): Promise<{
    results: Campaign[];
    count: number;
    next?: string;
    previous?: string;
  }> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return authFetch(`${API_ENDPOINTS.INFLUENCERS.CAMPAIGNS}?${searchParams}`);
  },

  createCampaign: (data: Omit<Campaign, 'id' | 'creator' | 'created_at' | 'updated_at'>): Promise<Campaign> => 
    authFetch(API_ENDPOINTS.INFLUENCERS.CAMPAIGNS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCampaign: (id: string): Promise<Campaign> => 
    authFetch(API_ENDPOINTS.INFLUENCERS.CAMPAIGN_DETAIL(id)),

  updateCampaign: (id: string, data: Partial<Campaign>): Promise<Campaign> => 
    authFetch(API_ENDPOINTS.INFLUENCERS.CAMPAIGN_DETAIL(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCampaign: (id: string): Promise<void> => 
    authFetch(API_ENDPOINTS.INFLUENCERS.CAMPAIGN_DETAIL(id), {
      method: 'DELETE',
    }),

  // Campaign Applications
  getApplications: (): Promise<{
    results: CampaignApplication[];
    count: number;
  }> => authFetch(API_ENDPOINTS.INFLUENCERS.APPLICATIONS),

  applyToCampaign: (data: {
    campaign: string;
    message: string;
    proposed_rate?: number;
  }): Promise<CampaignApplication> => 
    authFetch(API_ENDPOINTS.INFLUENCERS.APPLICATIONS, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateApplicationStatus: (id: string, status: 'accepted' | 'rejected'): Promise<{
    message: string;
    application_id: string;
    status: string;
  }> => 
    authFetch(API_ENDPOINTS.INFLUENCERS.APPLICATION_STATUS(id), {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  // Portfolio Management
  getPortfolio: (): Promise<InfluencerPortfolio[]> => authFetch(API_ENDPOINTS.INFLUENCERS.PORTFOLIO),

  addPortfolioItem: (data: Omit<InfluencerPortfolio, 'id' | 'created_at'>): Promise<InfluencerPortfolio> => 
    authFetch(API_ENDPOINTS.INFLUENCERS.PORTFOLIO, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Collaborations
  getCollaborations: (): Promise<{
    collaborations: Collaboration[];
    count: number;
  }> => authFetch(API_ENDPOINTS.INFLUENCERS.COLLABORATIONS),

  // Follower Sync
  syncFollowers: (): Promise<{
    message: string;
    total_followers: number;
    avg_engagement_rate: number;
  }> => authFetch(API_ENDPOINTS.INFLUENCERS.SYNC_FOLLOWERS, {
    method: 'POST',
  }),
};
