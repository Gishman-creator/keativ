import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  AlertCircle,
  CheckCircle2,
  Settings,
  FolderSync
} from 'lucide-react';

interface CRMContact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'prospect' | 'customer' | 'unsubscribed';
  tags: string[];
  last_contacted?: string;
  created_at: string;
  social_media_profiles: {
    [key: string]: string;
  };
}

interface GoHighLevelIntegration {
  id: string;
  api_key: string;
  location_id: string;
  sync_contacts: boolean;
  sync_opportunities: boolean;
  sync_campaigns: boolean;
  is_active: boolean;
  last_sync_date?: string;
}

const CRMDashboard: React.FC = () => {
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [integration, setIntegration] = useState<GoHighLevelIntegration | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddContact, setShowAddContact] = useState(false);
  const [showIntegrationSetup, setShowIntegrationSetup] = useState(false);
  const [newContact, setNewContact] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    tags: [] as string[],
  });
  const [integrationForm, setIntegrationForm] = useState({
    api_key: '',
    location_id: '',
    sync_contacts: true,
    sync_opportunities: true,
    sync_campaigns: true,
  });

  useEffect(() => {
    loadContacts();
    loadIntegration();
  }, []);

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockContacts: CRMContact[] = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '+1-555-0123',
          company: 'Tech Solutions Inc',
          status: 'customer',
          tags: ['VIP', 'Enterprise'],
          last_contacted: '2024-08-10',
          created_at: '2024-07-15',
          social_media_profiles: {
            linkedin: 'john-doe-123',
            twitter: '@johndoe'
          }
        },
        {
          id: '2',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          phone: '+1-555-0456',
          company: 'Digital Marketing Co',
          status: 'prospect',
          tags: ['Marketing', 'SMB'],
          last_contacted: '2024-08-12',
          created_at: '2024-08-01',
          social_media_profiles: {
            linkedin: 'jane-smith-456'
          }
        }
      ];
      setContacts(mockContacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadIntegration = async () => {
    try {
      // Mock data - replace with actual API call
      const mockIntegration: GoHighLevelIntegration = {
        id: '1',
        api_key: 'ghl_***************',
        location_id: 'loc_123456',
        sync_contacts: true,
        sync_opportunities: true,
        sync_campaigns: false,
        is_active: true,
        last_sync_date: '2024-08-15T10:30:00Z'
      };
      setIntegration(mockIntegration);
    } catch (error) {
      console.error('Error loading integration:', error);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.first_name || !newContact.last_name || !newContact.email) {
      return;
    }

    try {
      // Mock add contact - replace with actual API call
      const contact: CRMContact = {
        id: Date.now().toString(),
        ...newContact,
        status: 'prospect',
        created_at: new Date().toISOString(),
        social_media_profiles: {}
      };
      
      setContacts([...contacts, contact]);
      setNewContact({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        tags: [],
      });
      setShowAddContact(false);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleSetupIntegration = async () => {
    try {
      // Mock setup - replace with actual API call
      const newIntegration: GoHighLevelIntegration = {
        id: Date.now().toString(),
        ...integrationForm,
        is_active: true,
        last_sync_date: new Date().toISOString()
      };
      
      setIntegration(newIntegration);
      setShowIntegrationSetup(false);
    } catch (error) {
      console.error('Error setting up integration:', error);
    }
  };

  const handleSyncContacts = async () => {
    if (!integration) return;
    
    setIsLoading(true);
    try {
      // Mock sync - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      await loadContacts();
      
      // Update last sync date
      setIntegration({
        ...integration,
        last_sync_date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error syncing contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'success' as const,
      customer: 'success' as const,
      prospect: 'secondary' as const,
      inactive: 'destructive' as const,
      unsubscribed: 'destructive' as const,
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your contacts and GoHighLevel integration
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddContact(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </Button>
          
          {integration ? (
            <Button 
              onClick={handleSyncContacts}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FolderSync className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Sync Contacts
            </Button>
          ) : (
            <Button 
              onClick={() => setShowIntegrationSetup(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Setup Integration
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {contacts.filter(c => c.status === 'customer').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Prospects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {contacts.filter(c => c.status === 'prospect').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last Sync
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {integration?.last_sync_date 
                    ? new Date(integration.last_sync_date).toLocaleDateString()
                    : 'Never'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              title="Filter contacts by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="customer">Customer</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Contacts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Company</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Tags</th>
                      <th className="text-left p-2">Last Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">
                              {contact.first_name} {contact.last_name}
                            </div>
                            {contact.phone && (
                              <div className="text-sm text-muted-foreground">
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-2">{contact.email}</td>
                        <td className="p-2">{contact.company || '-'}</td>
                        <td className="p-2">
                          <Badge variant={getStatusBadge(contact.status)}>
                            {contact.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1 flex-wrap">
                            {contact.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-2">
                          {contact.last_contacted 
                            ? new Date(contact.last_contacted).toLocaleDateString()
                            : '-'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          {integration ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  GoHighLevel Integration Active
                </CardTitle>
                <CardDescription>
                  Your GoHighLevel account is connected and syncing data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>API Key</Label>
                    <div className="text-sm text-muted-foreground">
                      {integration.api_key}
                    </div>
                  </div>
                  <div>
                    <Label>Location ID</Label>
                    <div className="text-sm text-muted-foreground">
                      {integration.location_id}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sync Settings</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Contacts sync enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Opportunities sync enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.sync_campaigns ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted" />
                      )}
                      <span className="text-sm">Campaigns sync {integration.sync_campaigns ? 'enabled' : 'disabled'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSyncContacts} disabled={isLoading}>
                    {isLoading ? 'Syncing...' : 'Sync Now'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowIntegrationSetup(true)}>
                    Update Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  GoHighLevel Integration
                </CardTitle>
                <CardDescription>
                  Connect your GoHighLevel account to sync contacts and opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowIntegrationSetup(true)}>
                  Setup Integration
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Analytics charts coming soon...
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Analytics charts coming soon...
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Contact Dialog */}
      <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Create a new contact in your CRM
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={newContact.first_name}
                  onChange={(e) => setNewContact({...newContact, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={newContact.last_name}
                  onChange={(e) => setNewContact({...newContact, last_name: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={newContact.company}
                onChange={(e) => setNewContact({...newContact, company: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddContact}>Add Contact</Button>
              <Button variant="outline" onClick={() => setShowAddContact(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Integration Setup Dialog */}
      <Dialog open={showIntegrationSetup} onOpenChange={setShowIntegrationSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>GoHighLevel Integration Setup</DialogTitle>
            <DialogDescription>
              Configure your GoHighLevel API connection
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key *</Label>
              <Input
                id="apiKey"
                type="password"
                value={integrationForm.api_key}
                onChange={(e) => setIntegrationForm({...integrationForm, api_key: e.target.value})}
                placeholder="Enter your GoHighLevel API key"
              />
            </div>
            
            <div>
              <Label htmlFor="locationId">Location ID *</Label>
              <Input
                id="locationId"
                value={integrationForm.location_id}
                onChange={(e) => setIntegrationForm({...integrationForm, location_id: e.target.value})}
                placeholder="Enter your Location ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sync Options</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={integrationForm.sync_contacts}
                    onChange={(e) => setIntegrationForm({...integrationForm, sync_contacts: e.target.checked})}
                  />
                  <span className="text-sm">Sync Contacts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={integrationForm.sync_opportunities}
                    onChange={(e) => setIntegrationForm({...integrationForm, sync_opportunities: e.target.checked})}
                  />
                  <span className="text-sm">Sync Opportunities</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={integrationForm.sync_campaigns}
                    onChange={(e) => setIntegrationForm({...integrationForm, sync_campaigns: e.target.checked})}
                  />
                  <span className="text-sm">Sync Campaigns</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSetupIntegration}>
                {integration ? 'Update' : 'Setup'} Integration
              </Button>
              <Button variant="outline" onClick={() => setShowIntegrationSetup(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRMDashboard;
