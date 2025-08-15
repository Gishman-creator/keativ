import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmService, type SetupIntegrationRequest, type UpdateIntegrationRequest, type CreateContactRequest } from '../services/crm';

// Hook to get GoHighLevel integration
export const useGoHighLevelIntegration = () => {
  return useQuery({
    queryKey: ['gohighlevelIntegration'],
    queryFn: crmService.getIntegration,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get CRM contacts
export const useCRMContacts = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: ['crmContacts', page, pageSize],
    queryFn: () => crmService.getContacts(page, pageSize),
    staleTime: 60 * 1000, // 1 minute
  });
};

// Hook to setup GoHighLevel integration
export const useSetupIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SetupIntegrationRequest) => crmService.setupIntegration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gohighlevelIntegration'] });
    },
  });
};

// Hook to update GoHighLevel integration
export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateIntegrationRequest) => crmService.updateIntegration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gohighlevelIntegration'] });
    },
  });
};

// Hook to delete GoHighLevel integration
export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => crmService.deleteIntegration(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gohighlevelIntegration'] });
      queryClient.invalidateQueries({ queryKey: ['crmContacts'] });
    },
  });
};

// Hook to sync contacts
export const useSyncContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => crmService.syncContacts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crmContacts'] });
    },
  });
};

// Hook to create contact
export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactRequest) => crmService.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crmContacts'] });
    },
  });
};

// Hook to update contact
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateContactRequest> }) => 
      crmService.updateContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crmContacts'] });
    },
  });
};

// Hook to delete contact
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => crmService.deleteContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crmContacts'] });
    },
  });
};

// Hook to test GoHighLevel connection
export const useTestConnection = () => {
  return useMutation({
    mutationFn: ({ apiKey, locationId }: { apiKey: string; locationId: string }) =>
      crmService.testConnection(apiKey, locationId),
  });
};
