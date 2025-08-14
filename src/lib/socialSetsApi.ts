import { api } from './api';
import { SocialSet, Platform } from '@/types';

interface SocialSetResponse {
  id: string;
  name: string;
  description: string;
  accounts: SocialMediaAccount[];
  accounts_count: number;
  is_active: boolean;
  created_at: string;
}

interface SocialMediaAccount {
  id: string;
  platform: string;
  username: string;
  is_active: boolean;
  follower_count: number;
  following_count: number;
  platform_user_id: string;
  created_at: string;
}

// Allow paginated or list response from backend
type SocialAccountsApiResponse = SocialMediaAccount[] | { results: SocialMediaAccount[]; count?: number };

interface CreateSocialSetRequest {
  name: string;
  description?: string;
  accounts?: string[]; // Array of account IDs
}

interface UpdateSocialSetRequest {
  name?: string;
  description?: string;
  accounts?: string[]; // Array of account IDs
  is_active?: boolean;
}

// Helper function to get the base URL
const getApiUrl = (endpoint: string) => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  return `${baseURL}/api${endpoint}`;
};

//Transform backend SocialSetResponse to frontend SocialSet type
const transformSocialSet = (backendSet: SocialSetResponse): SocialSet => {
  return {
    id: backendSet.id,
    name: backendSet.name,
    description: backendSet.description,
    userId: '', // Will be filled by the current user
    platforms: backendSet.accounts.map((account): Platform => ({
      id: account.id,
      name: account.username,
      type: account.platform.toLowerCase() as Platform['type'],
      isConnected: account.is_active,
      accountName: account.username,
      followers: account.follower_count,
    })),
    isActive: backendSet.is_active,
    accountCount: backendSet.accounts_count,
    createdAt: backendSet.created_at,
    updatedAt: backendSet.created_at
  };
};

export const socialSetsApi = {
  // Fetch all social sets for the current user
  async getSocialSets(): Promise<SocialSet[]> {
    try {
      const response = await api.get<SocialSetResponse[]>(getApiUrl('/posts/social-sets/'));
      
      if (response.success) {
        // Handle both cases: response.data is array or null/undefined
        const data = response.data || [];
        return Array.isArray(data) ? data.map(transformSocialSet) : [];
      } else {
        throw new Error(response.error || 'Failed to fetch social sets');
      }
    } catch (error) {
      console.error('getSocialSets error:', error);
      throw error;
    }
  },

  // Get a specific social set by ID
  async getSocialSet(id: string): Promise<SocialSet> {
    const response = await api.get<SocialSetResponse>(getApiUrl(`/posts/social-sets/${id}/`));
    if (response.success && response.data) {
      return transformSocialSet(response.data);
    }
    throw new Error(response.error || 'Failed to fetch social set');
  },

  // Create a new social set
  async createSocialSet(data: CreateSocialSetRequest): Promise<SocialSet> {
    const response = await api.post<SocialSetResponse>(getApiUrl('/posts/social-sets/'), data as unknown as Record<string, unknown>);
    if (response.success && response.data) {
      return transformSocialSet(response.data);
    }
    throw new Error(response.error || 'Failed to create social set');
  },

  // Update an existing social set using PUT
  async updateSocialSet(id: string, data: UpdateSocialSetRequest): Promise<SocialSet> {
    const response = await api.put<SocialSetResponse>(getApiUrl(`/posts/social-sets/${id}/`), data as unknown as Record<string, unknown>);
    if (response.success && response.data) {
      return transformSocialSet(response.data);
    }
    throw new Error(response.error || 'Failed to update social set');
  },

  // Delete a social set
  async deleteSocialSet(id: string): Promise<void> {
    const response = await api.delete(getApiUrl(`/posts/social-sets/${id}/`));
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete social set');
    }
  },

  // Get available social media accounts (from authentication app)
  async getAvailableAccounts(): Promise<SocialMediaAccount[]> {
  const response = await api.get<SocialAccountsApiResponse>(getApiUrl('/auth/social-accounts/'));
    if (response.success && response.data) {
      const data = response.data;
      // Support both paginated { results: [...] } and plain array responses
      if (Array.isArray(data)) {
        return data as SocialMediaAccount[];
      }
      if (Array.isArray(data.results)) {
        return data.results as SocialMediaAccount[];
      }
      // Unexpected shape
      console.warn('Unexpected social-accounts payload shape', data);
      return [];
    }
    throw new Error(response.error || 'Failed to fetch accounts');
  },

  // Add accounts to a social set (if backend supports this endpoint)
  async addAccountsToSet(setId: string, accountIds: string[]): Promise<SocialSet> {
    const response = await api.post<SocialSetResponse>(getApiUrl(`/posts/social-sets/${setId}/add-accounts/`), {
      accounts: accountIds
    });
    if (response.success && response.data) {
      return transformSocialSet(response.data);
    }
    throw new Error(response.error || 'Failed to add accounts to set');
  },

  // Remove accounts from a social set (if backend supports this endpoint)
  async removeAccountsFromSet(setId: string, accountIds: string[]): Promise<SocialSet> {
    const response = await api.post<SocialSetResponse>(getApiUrl(`/posts/social-sets/${setId}/remove-accounts/`), {
      accounts: accountIds
    });
    if (response.success && response.data) {
      return transformSocialSet(response.data);
    }
    throw new Error(response.error || 'Failed to remove accounts from set');
  },

  // Set a social set as active/inactive using PUT
  async setActive(id: string, isActive: boolean): Promise<SocialSet> {
    const response = await api.put<SocialSetResponse>(getApiUrl(`/posts/social-sets/${id}/`), { 
      is_active: isActive 
    });
    if (response.success && response.data) {
      return transformSocialSet(response.data);
    }
    throw new Error(response.error || 'Failed to update social set status');
  }
};
