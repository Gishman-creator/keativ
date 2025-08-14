// Automation API functions
import { api } from './api';

interface AutomatedMessage {
  id: string;
  user: number;
  platform: string;
  trigger: string;
  content_template: string;
  delay_minutes: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateAutomatedMessageRequest {
  platform: string;
  trigger: string;
  content_template: string;
  delay_minutes: number;
}

const getApiUrl = (endpoint: string) => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  return `${baseURL}${endpoint}`;
};

export const automationsApi = {
  // Fetch all automated messages for the current user
  async getAutomatedMessages(): Promise<AutomatedMessage[]> {
    try {
      const response = await api.get<{
        count: number;
        next: string | null;
        previous: string | null;
        results: AutomatedMessage[];
      }>(getApiUrl('/api/messaging/automated/'));
      
      if (response.success) {
        const data = response.data;
        // Handle paginated response - extract results array
        if (data && typeof data === 'object' && 'results' in data) {
          return Array.isArray(data.results) ? data.results : [];
        }
        // Fallback for direct array response
        return Array.isArray(data) ? data : [];
      } else {
        throw new Error(response.error || 'Failed to fetch automated messages');
      }
    } catch (error) {
      console.error('getAutomatedMessages error:', error);
      throw error;
    }
  },

  // Create a new automated message
  async createAutomatedMessage(data: CreateAutomatedMessageRequest): Promise<AutomatedMessage> {
    try {
      const response = await api.post<AutomatedMessage>(getApiUrl('/api/messaging/automated/'), data as unknown as Record<string, unknown>);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create automated message');
      }
    } catch (error) {
      console.error('createAutomatedMessage error:', error);
      throw error;
    }
  },

  // Toggle an automated message active/inactive
  async toggleAutomatedMessage(id: string): Promise<void> {
    try {
      const response = await api.post(getApiUrl(`/api/messaging/automated/${id}/toggle/`));
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to toggle automated message');
      }
    } catch (error) {
      console.error('toggleAutomatedMessage error:', error);
      throw error;
    }
  },

  // Test an automated message
  async testAutomatedMessage(id: string, testRecipient: string): Promise<void> {
    try {
      const response = await api.post(getApiUrl(`/api/messaging/automated/${id}/test/`), {
        test_recipient: testRecipient
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to test automated message');
      }
    } catch (error) {
      console.error('testAutomatedMessage error:', error);
      throw error;
    }
  },
};
