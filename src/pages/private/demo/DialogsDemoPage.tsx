import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CreatePlanDialog,
  EditPlanDialog, 
  CreateContactDialog,
  SendMessageDialog
} from '@/components/dialogs';
import { 
  Plus,
  Edit,
  UserPlus,
  MessageSquare,
  Crown,
  Users,
  Mail,
  Settings
} from 'lucide-react';

// Mock data for demonstration
const mockSubscriptionPlan = {
  id: 'tier_professional',
  name: 'professional',
  display_name: 'Professional',
  description: 'Perfect for growing businesses and agencies',
  price_monthly: 49.99,
  price_yearly: 499.99,
  max_social_accounts: 10,
  max_scheduled_posts: 500,
  max_team_members: 5,
  analytics_retention_days: 90,
  api_rate_limit: 5000,
  gohighlevel_integration: true,
  advanced_analytics: true,
  priority_support: true,
  white_label: false,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
};

const mockContacts = [
  {
    id: 'contact_1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Corp',
    status: 'customer' as const,
  },
  {
    id: 'contact_2', 
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Design Studio',
    status: 'prospect' as const,
  },
  {
    id: 'contact_3',
    first_name: 'Bob',
    last_name: 'Wilson',
    email: 'bob@example.com',
    company: 'Marketing Agency',
    status: 'lead' as const,
  },
];

const DialogsDemoPage: React.FC = () => {
  // Dialog states
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [editPlanOpen, setEditPlanOpen] = useState(false);
  const [createContactOpen, setCreateContactOpen] = useState(false);
  const [sendMessageOpen, setSendMessageOpen] = useState(false);

  // Success handlers
  const handlePlanCreated = () => {
    console.log('Plan created successfully!');
    // Refresh plans list, show success message, etc.
  };

  const handlePlanUpdated = () => {
    console.log('Plan updated successfully!');
    // Refresh plans list, show success message, etc.
  };

  const handleContactCreated = (contact: { id?: string; first_name: string; last_name: string; email: string }) => {
    console.log('Contact created:', contact);
    // Add to contacts list, show success message, etc.
  };

  const handleMessageSent = () => {
    console.log('Message sent successfully!');
    // Update message history, show success message, etc.
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Dialog Components Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive dialog collection for plan management, CRM, and messaging
        </p>
      </div>

      {/* Plan Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Plan Management Dialogs
          </CardTitle>
          <CardDescription>
            Create and manage subscription plans with comprehensive features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setCreatePlanOpen(true)}
              className="h-auto flex-col space-y-2 p-4"
            >
              <Plus className="w-6 h-6" />
              <div className="text-center">
                <div className="font-semibold">Create New Plan</div>
                <div className="text-xs opacity-75">Add subscription tier</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => setEditPlanOpen(true)}
              className="h-auto flex-col space-y-2 p-4"
            >
              <Edit className="w-6 h-6" />
              <div className="text-center">
                <div className="font-semibold">Edit Plan</div>
                <div className="text-xs opacity-75">Modify existing plan</div>
              </div>
            </Button>
          </div>

          <div className="pt-4">
            <h4 className="font-medium mb-2">Current Plan Example:</h4>
            <div className="border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span className="font-semibold">{mockSubscriptionPlan.display_name}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default">${mockSubscriptionPlan.price_monthly}/mo</Badge>
                  <Badge variant={mockSubscriptionPlan.is_active ? "default" : "secondary"}>
                    {mockSubscriptionPlan.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {mockSubscriptionPlan.description}
              </p>
              <div className="text-xs space-y-1">
                <div>• {mockSubscriptionPlan.max_social_accounts} social accounts</div>
                <div>• {mockSubscriptionPlan.max_scheduled_posts} scheduled posts</div>
                <div>• {mockSubscriptionPlan.max_team_members} team members</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CRM Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            CRM Management Dialogs
          </CardTitle>
          <CardDescription>
            Manage contacts and customer relationships
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setCreateContactOpen(true)}
              className="h-auto flex-col space-y-2 p-4"
            >
              <UserPlus className="w-6 h-6" />
              <div className="text-center">
                <div className="font-semibold">Add Contact</div>
                <div className="text-xs opacity-75">Create new CRM contact</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => setSendMessageOpen(true)}
              className="h-auto flex-col space-y-2 p-4"
            >
              <MessageSquare className="w-6 h-6" />
              <div className="text-center">
                <div className="font-semibold">Send Message</div>
                <div className="text-xs opacity-75">Email, SMS, or social</div>
              </div>
            </Button>
          </div>

          <div className="pt-4">
            <h4 className="font-medium mb-2">Sample Contacts:</h4>
            <div className="space-y-2">
              {mockContacts.map((contact) => (
                <div key={contact.id} className="border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{contact.first_name} {contact.last_name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </span>
                        {contact.company && (
                          <span className="flex items-center gap-1">
                            <Settings className="w-3 h-3" />
                            {contact.company}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant={
                      contact.status === 'customer' ? 'default' :
                      contact.status === 'prospect' ? 'secondary' :
                      contact.status === 'lead' ? 'outline' : 'secondary'
                    }>
                      {contact.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Components */}
      <CreatePlanDialog
        open={createPlanOpen}
        onOpenChange={setCreatePlanOpen}
        onSuccess={handlePlanCreated}
      />

      <EditPlanDialog
        open={editPlanOpen}
        onOpenChange={setEditPlanOpen}
        plan={mockSubscriptionPlan}
        onSuccess={handlePlanUpdated}
      />

      <CreateContactDialog
        open={createContactOpen}
        onOpenChange={setCreateContactOpen}
        onSuccess={handleContactCreated}
      />

      <SendMessageDialog
        open={sendMessageOpen}
        onOpenChange={setSendMessageOpen}
        contacts={mockContacts}
        onSuccess={handleMessageSent}
      />
    </div>
  );
};

export default DialogsDemoPage;
