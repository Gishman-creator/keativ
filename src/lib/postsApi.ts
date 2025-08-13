import { api } from './api';

export interface PostData {
  content: string;
  scheduled_time?: string;
  social_set_id: string;
  platform_settings: {
    [platform: string]: {
      enabled: boolean;
      custom_content?: string;
      hashtags?: string[];
    };
  };
  hashtags?: string[];
  mentions?: string[];
  media_urls?: string[];
}

export interface PostResponse {
  id: string;
  content: string;
  scheduled_time?: string;
  social_set_id: string;
  platform_settings: {
    [platform: string]: {
      enabled: boolean;
      custom_content?: string;
      hashtags?: string[];
    };
  };
  hashtags: string[];
  mentions: string[];
  media_urls: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface PostDraft {
  id: string;
  title?: string;
  content: string;
  social_set_id: string;
  platform_settings: {
    [platform: string]: {
      enabled: boolean;
      custom_content?: string;
      hashtags?: string[];
    };
  };
  hashtags: string[];
  mentions: string[];
  media_urls: string[];
  created_at: string;
  updated_at: string;
}

export const postsApi = {
  // Create and schedule a new post
  createPost: async (data: PostData): Promise<PostResponse> => {
    try {
      const response = await api.post('/posts/create/', data as unknown as Record<string, unknown>);
      if (response.success && response.data) {
        return response.data as PostResponse;
      }
      throw new Error(response.error || 'Failed to create post');
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Save a post as draft
  saveDraft: async (data: Omit<PostData, 'scheduled_time'>): Promise<PostDraft> => {
    try {
      const response = await api.post('/posts/drafts/', data as unknown as Record<string, unknown>);
      if (response.success && response.data) {
        return response.data as PostDraft;
      }
      throw new Error(response.error || 'Failed to save draft');
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  },

  // Get all drafts
  getDrafts: async (): Promise<PostDraft[]> => {
    try {
      const response = await api.get('/posts/drafts/');
      if (response.success && response.data) {
        return response.data as PostDraft[];
      }
      throw new Error(response.error || 'Failed to fetch drafts');
    } catch (error) {
      console.error('Error fetching drafts:', error);
      throw error;
    }
  },

  // Delete a draft
  deleteDraft: async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/posts/drafts/${id}/`);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete draft');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw error;
    }
  },

  // Get all posts
  getPosts: async (): Promise<PostResponse[]> => {
    try {
      const response = await api.get('/posts/');
      if (response.success && response.data) {
        return response.data as PostResponse[];
      }
      throw new Error(response.error || 'Failed to fetch posts');
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get a specific post
  getPost: async (id: string): Promise<PostResponse> => {
    try {
      const response = await api.get(`/posts/${id}/`);
      if (response.success && response.data) {
        return response.data as PostResponse;
      }
      throw new Error(response.error || 'Failed to fetch post');
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Update a post
  updatePost: async (id: string, data: Partial<PostData>): Promise<PostResponse> => {
    try {
      const response = await api.put(`/posts/${id}/`, data as unknown as Record<string, unknown>);
      if (response.success && response.data) {
        return response.data as PostResponse;
      }
      throw new Error(response.error || 'Failed to update post');
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete a post
  deletePost: async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/posts/${id}/`);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Upload media file
  uploadMedia: async (file: File): Promise<{ url: string; id: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use fetch directly for FormData uploads as it's more straightforward
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/media/upload/`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header for FormData, browser will set it automatically with boundary
          Authorization: localStorage.getItem('access_token') ? `Bearer ${localStorage.getItem('access_token')}` : ''
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result as { url: string; id: string };
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  },

  // Post immediately to platforms
  postNow: async (data: Omit<PostData, 'scheduled_time'>): Promise<PostResponse> => {
    try {
      const response = await api.post('/posts/post-now/', data as unknown as Record<string, unknown>);
      if (response.success && response.data) {
        return response.data as PostResponse;
      }
      throw new Error(response.error || 'Failed to post now');
    } catch (error) {
      console.error('Error posting now:', error);
      throw error;
    }
  }
};
