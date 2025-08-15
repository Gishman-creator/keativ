import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Settings, ExternalLink, RotateCw } from 'lucide-react';
import { useGoHighLevelIntegration, useSetupIntegration, useUpdateIntegration, useDeleteIntegration, useTestConnection, useSyncContacts } from '@/hooks/useCRM';
import { useForm } from 'react-hook-form';
import type { SetupIntegrationRequest, UpdateIntegrationRequest } from '@/services/crm';

interface IntegrationFormData {
  api_key: string;
  location_id: string;
  sync_contacts: boolean;
  sync_opportunities: boolean;
  sync_campaigns: boolean;
}

const GoHighLevelIntegration: React.FC = () => {
  const { data: integration, isLoading } = useGoHighLevelIntegration();
  const setupIntegration = useSetupIntegration();
  const updateIntegration = useUpdateIntegration();
  const deleteIntegration = useDeleteIntegration();
  const testConnection = useTestConnection();
  const syncContacts = useSyncContacts();
  
  const [isEditing, setIsEditing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<IntegrationFormData>({
    defaultValues: {
      api_key: integration?.api_key || '',
      location_id: integration?.location_id || '',
      sync_contacts: integration?.sync_contacts || true,
      sync_opportunities: integration?.sync_opportunities || false,
      sync_campaigns: integration?.sync_campaigns || false,
    }
  });

  // Update form values when integration data loads
  React.useEffect(() => {
    if (integration) {
      setValue('api_key', integration.api_key);
      setValue('location_id', integration.location_id);
      setValue('sync_contacts', integration.sync_contacts);
      setValue('sync_opportunities', integration.sync_opportunities);
      setValue('sync_campaigns', integration.sync_campaigns);
    }
  }, [integration, setValue]);

  const onSubmit = async (data: IntegrationFormData) => {
    try {
      if (integration) {
        await updateIntegration.mutateAsync(data as UpdateIntegrationRequest);
      } else {
        await setupIntegration.mutateAsync(data as SetupIntegrationRequest);
      }
      setIsEditing(false);
      setTestResult(null);
    } catch (error) {
      console.error('Failed to save integration:', error);
    }
  };

  const handleTestConnection = async () => {
    const apiKey = watch('api_key');
    const locationId = watch('location_id');

    if (!apiKey || !locationId) {
      setTestResult({ success: false, message: 'Please enter both API key and location ID' });
      return;
    }

    try {
      const result = await testConnection.mutateAsync({ apiKey, locationId });
      setTestResult(result);
    } catch {
      setTestResult({ success: false, message: 'Failed to test connection' });
    }
  };

  const handleDeleteIntegration = async () => {
    if (window.confirm('Are you sure you want to delete the GoHighLevel integration? This will remove all synced data.')) {
      try {
        await deleteIntegration.mutateAsync();
        setIsEditing(false);
        setTestResult(null);
      } catch (error) {
        console.error('Failed to delete integration:', error);
      }
    }
  };

  const handleSyncContacts = async () => {
    try {
      await syncContacts.mutateAsync();
    } catch (error) {
      console.error('Failed to sync contacts:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">GoHighLevel CRM Integration</h2>
        <p className="text-gray-600 mt-2">
          Connect your GoHighLevel account to sync contacts and manage your CRM data
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Integration Settings
              </CardTitle>
              <CardDescription>
                Configure your GoHighLevel API connection and sync preferences
              </CardDescription>
            </div>
            {integration && (
              <div className="flex items-center gap-2">
                <Badge variant={integration.is_active ? "default" : "secondary"}>
                  {integration.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* API Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">API Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key</Label>
                  <Input
                    id="api_key"
                    type="password"
                    placeholder="Enter your GoHighLevel API key"
                    {...register('api_key', { required: 'API key is required' })}
                    disabled={!isEditing && !!integration}
                  />
                  {errors.api_key && (
                    <p className="text-sm text-red-500">{errors.api_key.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location_id">Location ID</Label>
                  <Input
                    id="location_id"
                    placeholder="Enter your GoHighLevel location ID"
                    {...register('location_id', { required: 'Location ID is required' })}
                    disabled={!isEditing && !!integration}
                  />
                  {errors.location_id && (
                    <p className="text-sm text-red-500">{errors.location_id.message}</p>
                  )}
                </div>
              </div>

              {(isEditing || !integration) && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={testConnection.isPending}
                  >
                    {testConnection.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="mr-2 h-4 w-4" />
                    )}
                    Test Connection
                  </Button>
                </div>
              )}

              {testResult && (
                <Alert variant={testResult.success ? "default" : "destructive"}>
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{testResult.message}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Sync Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sync Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sync_contacts">Sync Contacts</Label>
                    <p className="text-sm text-gray-600">
                      Automatically sync contacts between GoHighLevel and SMMS
                    </p>
                  </div>
                  <Switch
                    id="sync_contacts"
                    {...register('sync_contacts')}
                    disabled={!isEditing && !!integration}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sync_opportunities">Sync Opportunities</Label>
                    <p className="text-sm text-gray-600">
                      Sync sales opportunities and pipeline data
                    </p>
                  </div>
                  <Switch
                    id="sync_opportunities"
                    {...register('sync_opportunities')}
                    disabled={!isEditing && !!integration}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sync_campaigns">Sync Campaigns</Label>
                    <p className="text-sm text-gray-600">
                      Sync marketing campaigns and automation data
                    </p>
                  </div>
                  <Switch
                    id="sync_campaigns"
                    {...register('sync_campaigns')}
                    disabled={!isEditing && !!integration}
                  />
                </div>
              </div>
            </div>

            {(isEditing || !integration) && (
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={setupIntegration.isPending || updateIntegration.isPending}
                >
                  {(setupIntegration.isPending || updateIntegration.isPending) ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {integration ? 'Update Integration' : 'Setup Integration'}
                </Button>

                {integration && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteIntegration}
                    disabled={deleteIntegration.isPending}
                  >
                    {deleteIntegration.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Delete Integration
                  </Button>
                )}
              </div>
            )}
          </form>

          {/* Sync Actions */}
          {integration && integration.is_active && !isEditing && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Sync Actions</h3>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSyncContacts}
                  disabled={syncContacts.isPending}
                >
                  {syncContacts.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCw className="mr-2 h-4 w-4" />
                  )}
                  Sync Contacts Now
                </Button>
              </div>
              
              {integration.last_sync_date && (
                <p className="text-sm text-gray-600 mt-2">
                  Last sync: {new Date(integration.last_sync_date).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoHighLevelIntegration;
