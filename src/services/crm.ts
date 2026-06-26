import api from './api';

// Types for CRM data
export interface GoHighLevelIntegration {
  id: string;
  user: string;
  api_key: string;
  location_id: string;
  is_active: boolean;
  sync_contacts: boolean;
  sync_opportunities: boolean;
  sync_campaigns: boolean;
  webhook_url?: string;
  webhook_secret?: string;
  last_sync_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMContact {
  id: string;
  user: string;
  ghl_contact_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  tags: string[];
  custom_fields: Record<string, unknown>;
  social_media_profiles: Record<string, string>;
  last_contacted?: string;
  ghl_created_at?: string;
  ghl_updated_at?: string;
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SetupIntegrationRequest {
  api_key: string;
  location_id: string;
  sync_contacts?: boolean;
  sync_opportunities?: boolean;
  sync_campaigns?: boolean;
}

export interface UpdateIntegrationRequest {
  api_key?: string;
  location_id?: string;
  is_active?: boolean;
  sync_contacts?: boolean;
  sync_opportunities?: boolean;
  sync_campaigns?: boolean;
}

export interface CreateContactRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  tags?: string[];
  custom_fields?: Record<string, unknown>;
}

export interface UpdateContactRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: 'lead' | 'prospect' | 'customer' | 'inactive';
  tags?: string[];
  custom_fields?: Record<string, unknown>;
  social_media_profiles?: Record<string, string>;
}

export interface SendMessageRequest {
  contact_id: string;
  message: string;
  message_type?: 'sms' | 'email';
}

// CRM API functions
export const crmService = {
  // Setup GoHighLevel integration
  setupIntegration: async (data: SetupIntegrationRequest): Promise<GoHighLevelIntegration> => {
    const response = await api.post('/core/ghl/setup/', data);
    return response.data.integration || response.data;
  },

  // Get GoHighLevel integration details
  getIntegration: async (): Promise<GoHighLevelIntegration | null> => {
    const response = await api.get('/core/ghl/integration/');
    return response.data.success ? response.data.integration : null;
  },

  // Update GoHighLevel integration
  updateIntegration: async (data: UpdateIntegrationRequest): Promise<GoHighLevelIntegration> => {
    const response = await api.post('/core/ghl/setup/', data);
    return response.data.integration || response.data;
  },

  // Delete GoHighLevel integration
  deleteIntegration: async (): Promise<{ message: string }> => {
    const response = await api.delete('/core/ghl/integration/delete/');
    return response.data;
  },

  // Sync contacts from GoHighLevel
  syncContacts: async (): Promise<{ message: string; synced_count: number }> => {
    const response = await api.post('/core/ghl/sync-contacts/');
    return response.data;
  },

  // Get all CRM contacts
  getContacts: async (page = 1, page_size = 20): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: CRMContact[];
  }> => {
    const response = await api.get('/core/contacts/', {
      params: { page, page_size }
    });
    return {
      count: response.data.total_count || response.data.count || 0,
      results: response.data.contacts || response.data.results || [],
      next: response.data.next || null,
      previous: response.data.previous || null,
    };
  },

  // Get single CRM contact
  getContact: async (contactId: string): Promise<CRMContact> => {
    const response = await api.get(`/core/contacts/${contactId}/`);
    return response.data.contact || response.data;
  },

  // Create new contact in GoHighLevel
  createContact: async (data: CreateContactRequest): Promise<CRMContact> => {
    const response = await api.post('/core/contacts/create/', data);
    return response.data.contact || response.data;
  },

  // Update contact
  updateContact: async (contactId: string, data: UpdateContactRequest): Promise<CRMContact> => {
    const response = await api.put(`/core/contacts/${contactId}/update/`, data);
    return response.data.contact || response.data;
  },

  // Delete contact
  deleteContact: async (contactId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/core/contacts/${contactId}/delete/`);
    return response.data;
  },

  // Test GoHighLevel API connection
  testConnection: async (api_key: string, location_id: string): Promise<{ 
    success: boolean; 
    message: string;
    location_name?: string;
  }> => {
    const response = await api.post('/core/ghl/test-connection/', { 
      api_key, 
      location_id 
    });
    return response.data;
  },

  // Send message to contact
  sendMessage: async (data: SendMessageRequest): Promise<{ 
    success: boolean; 
    message: string 
  }> => {
    const response = await api.post('/core/contacts/message/', data);
    return response.data;
  },
};

export default crmService;
