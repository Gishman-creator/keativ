import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare,
  Send,
  Clock,
  Users,
  Building2,
  Mail,
  Phone,
  Loader2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CRMContact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
}

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts?: CRMContact[];
  selectedContactId?: string;
  onSuccess?: () => void;
}

const SendMessageDialog: React.FC<SendMessageDialogProps> = ({ 
  open, 
  onOpenChange, 
  contacts = [], 
  selectedContactId,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    recipient_type: 'single', // 'single', 'multiple', 'segment'
    contact_ids: selectedContactId ? [selectedContactId] : [],
    segment: '',
    message_type: 'email', // 'email', 'sms', 'social'
    subject: '',
    message: '',
    scheduled_at: '',
    priority: 'normal', // 'low', 'normal', 'high', 'urgent'
    template_id: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedContacts, setSelectedContacts] = useState<CRMContact[]>(
    selectedContactId && contacts.length > 0 
      ? contacts.filter(c => c.id === selectedContactId)
      : []
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.recipient_type === 'single' && formData.contact_ids.length === 0) {
      newErrors.contact_ids = 'Please select at least one contact';
    }

    if (formData.recipient_type === 'segment' && !formData.segment) {
      newErrors.segment = 'Please select a segment';
    }

    if (formData.message_type === 'email' && !formData.subject.trim()) {
      newErrors.subject = 'Subject is required for email messages';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message content is required';
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const recipientCount = formData.recipient_type === 'single' 
        ? formData.contact_ids.length
        : formData.recipient_type === 'segment' 
        ? 50 // Mock segment size
        : selectedContacts.length;

      toast({
        title: 'Message Sent',
        description: `Your ${formData.message_type} has been ${formData.scheduled_at ? 'scheduled' : 'sent'} to ${recipientCount} recipient${recipientCount > 1 ? 's' : ''}.`,
      });

      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        recipient_type: 'single',
        contact_ids: [],
        segment: '',
        message_type: 'email',
        subject: '',
        message: '',
        scheduled_at: '',
        priority: 'normal',
        template_id: '',
      });
      setSelectedContacts([]);
      setErrors({});
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addContact = (contact: CRMContact) => {
    if (!selectedContacts.find(c => c.id === contact.id)) {
      setSelectedContacts([...selectedContacts, contact]);
      setFormData({
        ...formData,
        contact_ids: [...formData.contact_ids, contact.id]
      });
    }
  };

  const removeContact = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter(c => c.id !== contactId));
    setFormData({
      ...formData,
      contact_ids: formData.contact_ids.filter(id => id !== contactId)
    });
  };

  const getMessageIcon = () => {
    switch (formData.message_type) {
      case 'email': return Mail;
      case 'sms': return Phone;
      case 'social': return MessageSquare;
      default: return MessageSquare;
    }
  };

  const MessageIcon = getMessageIcon();

  const messageTemplates = [
    { id: 'welcome', name: 'Welcome Message', content: 'Welcome to our service! We\'re excited to have you on board.' },
    { id: 'followup', name: 'Follow-up', content: 'Just checking in to see how things are going. Let us know if you need any help!' },
    { id: 'promotion', name: 'Special Offer', content: 'We have a special offer just for you! Don\'t miss out on this limited-time deal.' },
    { id: 'newsletter', name: 'Newsletter', content: 'Here\'s what\'s been happening this month...' },
  ];

  const segments = [
    { id: 'all_customers', name: 'All Customers', count: 120 },
    { id: 'new_leads', name: 'New Leads (Last 30 days)', count: 45 },
    { id: 'active_prospects', name: 'Active Prospects', count: 78 },
    { id: 'vip_customers', name: 'VIP Customers', count: 25 },
    { id: 'inactive_contacts', name: 'Inactive Contacts', count: 89 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageIcon className="w-5 h-5" />
            Send Message
          </DialogTitle>
          <DialogDescription>
            Send emails, SMS, or social media messages to your contacts
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="message_type">Message Type</Label>
              <Select
                value={formData.message_type}
                onValueChange={(value) => setFormData({ ...formData, message_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      SMS
                    </div>
                  </SelectItem>
                  <SelectItem value="social">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Social Media
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="normal">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      Normal
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400" />
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Urgent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recipients
            </h3>

            <div>
              <Label htmlFor="recipient_type">Send To</Label>
              <Select
                value={formData.recipient_type}
                onValueChange={(value) => {
                  setFormData({ ...formData, recipient_type: value });
                  if (value !== 'single') {
                    setSelectedContacts([]);
                    setFormData({ ...formData, contact_ids: [] });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Selected Contacts</SelectItem>
                  <SelectItem value="segment">Contact Segment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.recipient_type === 'single' && (
              <div>
                <Label>Select Contacts</Label>
                {errors.contact_ids && <p className="text-sm text-destructive">{errors.contact_ids}</p>}
                
                {selectedContacts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedContacts.map((contact) => (
                      <Badge
                        key={contact.id}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeContact(contact.id)}
                      >
                        {contact.first_name} {contact.last_name} ×
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="border rounded-lg max-h-40 overflow-y-auto">
                  {contacts.length === 0 ? (
                    <p className="p-4 text-muted-foreground text-center">No contacts available</p>
                  ) : (
                    contacts
                      .filter(contact => !selectedContacts.find(sc => sc.id === contact.id))
                      .map((contact) => (
                        <div
                          key={contact.id}
                          className="p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                          onClick={() => addContact(contact)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{contact.first_name} {contact.last_name}</p>
                              <p className="text-sm text-muted-foreground">{contact.email}</p>
                              {contact.company && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {contact.company}
                                </p>
                              )}
                            </div>
                            <Badge variant={
                              contact.status === 'customer' ? 'default' :
                              contact.status === 'prospect' ? 'secondary' :
                              contact.status === 'inactive' ? 'outline' : 'secondary'
                            }>
                              {contact.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {formData.recipient_type === 'segment' && (
              <div>
                <Label htmlFor="segment">Contact Segment</Label>
                <Select
                  value={formData.segment}
                  onValueChange={(value) => setFormData({ ...formData, segment: value })}
                >
                  <SelectTrigger className={errors.segment ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Choose a segment..." />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{segment.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {segment.count}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.segment && <p className="text-sm text-destructive">{errors.segment}</p>}
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Message Content
            </h3>

            {/* Template Selection */}
            <div>
              <Label htmlFor="template_id">Message Template (Optional)</Label>
              <Select
                value={formData.template_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, template_id: value });
                  if (value) {
                    const template = messageTemplates.find(t => t.id === value);
                    if (template) {
                      setFormData({
                        ...formData,
                        template_id: value,
                        message: template.content,
                        subject: formData.message_type === 'email' ? template.name : formData.subject,
                      });
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {messageTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        {template.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.message_type === 'email' && (
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter email subject..."
                  className={errors.subject ? 'border-destructive' : ''}
                />
                {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
              </div>
            )}

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={
                  formData.message_type === 'email' 
                    ? 'Enter your email content...'
                    : formData.message_type === 'sms'
                    ? 'Enter your SMS message (160 characters max)...'
                    : 'Enter your message...'
                }
                rows={6}
                className={errors.message ? 'border-destructive' : ''}
              />
              {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                {formData.message.length} {formData.message_type === 'sms' && '/ 160'} characters
              </p>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Scheduling (Optional)
            </h3>

            <div>
              <Label htmlFor="scheduled_at">Schedule for Later</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to send immediately
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageIcon className="w-4 h-4" />
                  <span className="font-medium capitalize">{formData.message_type}</span>
                  {formData.scheduled_at && (
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      Scheduled
                    </Badge>
                  )}
                </div>
                <Badge variant={
                  formData.priority === 'urgent' ? 'destructive' :
                  formData.priority === 'high' ? 'default' :
                  'secondary'
                }>
                  {formData.priority} priority
                </Badge>
              </div>

              {formData.subject && (
                <div className="mb-2">
                  <Label className="text-xs text-muted-foreground">Subject:</Label>
                  <p className="font-medium">{formData.subject}</p>
                </div>
              )}

              <div className="mb-3">
                <Label className="text-xs text-muted-foreground">Recipients:</Label>
                <p>
                  {formData.recipient_type === 'single' 
                    ? `${selectedContacts.length} selected contact${selectedContacts.length !== 1 ? 's' : ''}`
                    : formData.recipient_type === 'segment' && formData.segment
                    ? segments.find(s => s.id === formData.segment)?.name
                    : 'No recipients selected'
                  }
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Message:</Label>
                <p className="text-sm whitespace-pre-wrap">{formData.message || 'No message content'}</p>
              </div>

              {formData.scheduled_at && (
                <div className="mt-3 pt-3 border-t">
                  <Label className="text-xs text-muted-foreground">Scheduled for:</Label>
                  <p className="text-sm">{new Date(formData.scheduled_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {formData.scheduled_at ? 'Schedule Message' : 'Send Now'}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendMessageDialog;
