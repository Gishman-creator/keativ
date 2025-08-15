import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreatePlanDialog, 
  EditPlanDialog, 
  CreateContactDialog,
  EditContactDialog,
  SendMessageDialog 
} from '@/components/dialogs';
import { 
  CreditCard,
  Edit,
  UserPlus,
  UserCog,
  MessageCircle,
  Settings,
  Users,
  Mail,
  Zap
} from 'lucide-react';

const DialogsDemoPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  // Sample data for demonstrations
  const samplePlan = {
    id: '1',
    name: 'professional',
    display_name: 'Professional',
    description: 'Advanced features for growing businesses',
    price_monthly: 29.99,
    price_yearly: 299.99,
    features: ['100 Posts/month', 'Analytics', 'Team collaboration', 'Priority support'],
    max_social_accounts: 10,
    max_posts_per_month: 100,
    max_scheduled_posts: 100,
    max_team_members: 5,
    analytics_retention_days: 365,
    api_rate_limit: 10000,
    gohighlevel_integration: false,
    advanced_analytics: true,
    priority_support: true,
    white_label: false,
    is_popular: true,
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
  };

  const sampleContact = {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc',
    status: 'prospect' as const,
    tags: ['Enterprise', 'Marketing', 'Hot Lead'],
    notes: 'Interested in our professional plan. Scheduled for demo next week.',
    social_media_profiles: {
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: '@johndoe',
      facebook: 'https://facebook.com/johndoe',
      instagram: '@johndoe',
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
  };

  const handleSuccess = (type: string) => {
    console.log(`${type} operation completed successfully`);
    setOpenDialog(null);
  };

  const handleDelete = (id: string, type: string) => {
    console.log(`${type} deleted:`, id);
    setOpenDialog(null);
  };

  const dialogSections = [
    {
      title: 'Plan Management',
      description: 'Create and manage subscription plans',
      icon: CreditCard,
      color: 'text-blue-500',
      dialogs: [
        {
          id: 'create-plan',
          name: 'Create Plan',
          description: 'Add a new subscription plan',
          icon: Settings,
        },
        {
          id: 'edit-plan',
          name: 'Edit Plan',
          description: 'Modify existing plan settings',
          icon: Edit,
        },
      ],
    },
    {
      title: 'Contact Management',
      description: 'Manage your CRM contacts',
      icon: Users,
      color: 'text-green-500',
      dialogs: [
        {
          id: 'create-contact',
          name: 'Create Contact',
          description: 'Add a new contact to CRM',
          icon: UserPlus,
        },
        {
          id: 'edit-contact',
          name: 'Edit Contact',
          description: 'Update contact information',
          icon: UserCog,
        },
      ],
    },
    {
      title: 'Communication',
      description: 'Send messages to contacts',
      icon: Mail,
      color: 'text-purple-500',
      dialogs: [
        {
          id: 'send-message',
          name: 'Send Message',
          description: 'Send email, SMS, or social media messages',
          icon: MessageCircle,
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Zap className="w-10 h-10 text-primary" />
          Dialog Components Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive showcase of all available dialog components for plan management, 
          contact management, and communication workflows.
        </p>
      </div>

      {/* Dialog Sections */}
      {dialogSections.map((section) => (
        <Card key={section.title} className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <section.icon className={`w-6 h-6 ${section.color}`} />
              {section.title}
            </CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.dialogs.map((dialog) => (
                <Card key={dialog.id} className="border border-border/50 hover:border-border transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <dialog.icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{dialog.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {dialog.description}
                        </p>
                        <Button 
                          onClick={() => setOpenDialog(dialog.id)}
                          className="w-full"
                          size="sm"
                        >
                          Open Dialog
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
          <CardDescription>
            How to integrate these dialogs into your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Import Components</h3>
              <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                <p>{`import { CreatePlanDialog } from '@/components/dialogs';`}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">State Management</h3>
              <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                <p>{`const [open, setOpen] = useState(false);`}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Handle Success</h3>
              <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                <p>{`onSuccess={() => console.log('Success')}`}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Handle Errors</h3>
              <div className="bg-muted p-3 rounded-lg text-sm font-mono">
                <p>Toast notifications included</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Features</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Form Validation</Badge>
              <Badge variant="secondary">Loading States</Badge>
              <Badge variant="secondary">Error Handling</Badge>
              <Badge variant="secondary">Toast Notifications</Badge>
              <Badge variant="secondary">Responsive Design</Badge>
              <Badge variant="secondary">TypeScript Support</Badge>
              <Badge variant="secondary">Real-time Previews</Badge>
              <Badge variant="secondary">Accessibility</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Render Dialog Components */}
      <CreatePlanDialog 
        open={openDialog === 'create-plan'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        onSuccess={() => handleSuccess('Plan')}
      />

      <EditPlanDialog 
        open={openDialog === 'edit-plan'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        plan={samplePlan}
        onSuccess={() => handleSuccess('Plan')}
      />

      <CreateContactDialog 
        open={openDialog === 'create-contact'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        onSuccess={() => handleSuccess('Contact')}
      />

      <EditContactDialog 
        open={openDialog === 'edit-contact'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        contact={sampleContact}
        onSuccess={() => handleSuccess('Contact')}
        onDelete={(id: string) => handleDelete(id, 'Contact')}
      />

      <SendMessageDialog 
        open={openDialog === 'send-message'}
        onOpenChange={(open) => !open && setOpenDialog(null)}
        onSuccess={() => handleSuccess('Message')}
      />
    </div>
  );
};

export default DialogsDemoPage;
