import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Loader2, Search, Plus, MoreVertical, Mail, Phone, Building, Calendar } from 'lucide-react';
import { useCRMContacts, useCreateContact, useUpdateContact, useDeleteContact } from '@/hooks/useCRM';
import type { CRMContact, CreateContactRequest } from '@/services/crm';
import { format } from 'date-fns';

type ContactFormData = CreateContactRequest;

const ContactForm: React.FC<{
  contact?: CRMContact;
  onSave: (data: ContactFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}> = ({ contact, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    first_name: contact?.first_name || '',
    last_name: contact?.last_name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    tags: contact?.tags || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
          <Input
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Last Name</label>
          <Input
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Phone</label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Company</label>
        <Input
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {contact ? 'Update Contact' : 'Create Contact'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const CRMContactsList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<CRMContact | null>(null);

  const { data: contactsData, isLoading } = useCRMContacts(page, 20);
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const contacts = contactsData?.results || [];

  const handleCreateContact = async (data: ContactFormData) => {
    try {
      await createContact.mutateAsync(data);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  const handleUpdateContact = async (data: ContactFormData) => {
    if (!editingContact) return;
    
    try {
      await updateContact.mutateAsync({
        id: editingContact.id,
        data
      });
      setEditingContact(null);
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact.mutateAsync(contactId);
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'customer':
        return 'success' as const;
      case 'prospect':
        return 'default' as const;
      case 'lead':
        return 'secondary' as const;
      case 'inactive':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const filteredContacts = contacts.filter(contact =>
    contact.first_name.toLowerCase().includes(search.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(search.toLowerCase()) ||
    contact.email?.toLowerCase().includes(search.toLowerCase()) ||
    contact.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CRM Contacts</h2>
          <p className="text-gray-600 mt-2">Manage your customer relationships and contacts</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm
              onSave={handleCreateContact}
              onCancel={() => setShowCreateDialog(false)}
              isLoading={createContact.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contacts ({contactsData?.count || 0})</CardTitle>
              <CardDescription>
                Your synced GoHighLevel contacts and leads
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(contact.first_name, contact.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        {contact.first_name} {contact.last_name}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                        )}
                        
                        {contact.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </div>
                        )}
                        
                        {contact.company && (
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {contact.company}
                          </div>
                        )}
                      </div>

                      {contact.last_synced_at && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          Last synced: {format(new Date(contact.last_synced_at), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadgeVariant(contact.status)}>
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </Badge>

                    {contact.tags.length > 0 && (
                      <div className="flex gap-1">
                        {contact.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setEditingContact(contact)}>
                          Edit Contact
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-600"
                        >
                          Delete Contact
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No contacts found</p>
              <p className="text-sm text-gray-500 mt-1">
                {search ? 'Try adjusting your search criteria' : 'Sync your GoHighLevel contacts to get started'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {contactsData && contactsData.count > 20 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                disabled={!contactsData.previous}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {page} of {Math.ceil(contactsData.count / 20)}
              </span>
              
              <Button
                variant="outline"
                disabled={!contactsData.next}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Contact Dialog */}
      <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          {editingContact && (
            <ContactForm
              contact={editingContact}
              onSave={handleUpdateContact}
              onCancel={() => setEditingContact(null)}
              isLoading={updateContact.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRMContactsList;
