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
    const response = await api.post('/core/crm/gohighlevel/setup/', data);
    return response.data;
  },

  // Get GoHighLevel integration details
  getIntegration: async (): Promise<GoHighLevelIntegration | null> => {
    const response = await api.get('/core/crm/gohighlevel/integration/');
    return response.data;
  },

  // Update GoHighLevel integration
  updateIntegration: async (data: UpdateIntegrationRequest): Promise<GoHighLevelIntegration> => {
    const response = await api.put('/core/crm/gohighlevel/integration/', data);
    return response.data;
  },

  // Delete GoHighLevel integration
  deleteIntegration: async (): Promise<{ message: string }> => {
    const response = await api.delete('/core/crm/gohighlevel/integration/');
    return response.data;
  },

  // Sync contacts from GoHighLevel
  syncContacts: async (): Promise<{ message: string; synced_count: number }> => {
    const response = await api.post('/core/crm/gohighlevel/sync-contacts/');
    return response.data;
  },

  // Get all CRM contacts
  getContacts: async (page = 1, page_size = 20): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: CRMContact[];
  }> => {
    const response = await api.get('/core/crm/contacts/', {
      params: { page, page_size }
    });
    return response.data;
  },

  // Get single CRM contact
  getContact: async (contactId: string): Promise<CRMContact> => {
    const response = await api.get(`/core/crm/contacts/${contactId}/`);
    return response.data;
  },

  // Create new contact in GoHighLevel
  createContact: async (data: CreateContactRequest): Promise<CRMContact> => {
    const response = await api.post('/core/crm/contacts/', data);
    return response.data;
  },

  // Update contact
  updateContact: async (contactId: string, data: UpdateContactRequest): Promise<CRMContact> => {
    const response = await api.put(`/core/crm/contacts/${contactId}/`, data);
    return response.data;
  },

  // Delete contact
  deleteContact: async (contactId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/core/crm/contacts/${contactId}/`);
    return response.data;
  },

  // Test GoHighLevel API connection
  testConnection: async (api_key: string, location_id: string): Promise<{ 
    success: boolean; 
    message: string;
    location_name?: string;
  }> => {
    const response = await api.post('/core/crm/gohighlevel/test-connection/', { 
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
    const response = await api.post('/core/crm/contacts/message/', data);
    return response.data;
  },
};

export default crmService;
