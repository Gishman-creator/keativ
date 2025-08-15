import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users,
  Building2,
  Phone,
  Mail,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Save
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CRMContact {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  tags: string[];
  notes?: string;
  social_media_profiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface EditContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: CRMContact;
  onSuccess?: (contact: CRMContact) => void;
  onDelete?: (contactId: string) => void;
}

const EditContactDialog: React.FC<EditContactDialogProps> = ({ 
  open, 
  onOpenChange, 
  contact,
  onSuccess,
  onDelete 
}) => {
  const [formData, setFormData] = useState<Partial<CRMContact>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    tags: [],
    notes: '',
    social_media_profiles: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (contact) {
      setFormData({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone || '',
        company: contact.company || '',
        status: contact.status,
        tags: contact.tags || [],
        notes: contact.notes || '',
        social_media_profiles: {
          linkedin: contact.social_media_profiles?.linkedin || '',
          twitter: contact.social_media_profiles?.twitter || '',
          facebook: contact.social_media_profiles?.facebook || '',
          instagram: contact.social_media_profiles?.instagram || '',
        },
      });
    }
  }, [contact]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name?.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name?.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (if provided)
    if (formData.phone && !/^[+]?[1-9]\d{0,15}$/.test(formData.phone.replace(/[\s\-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !contact) return;

    setIsSubmitting(true);
    try {
      // This would be an API call to update the contact
      const updatedContact: CRMContact = {
        ...contact,
        ...formData as CRMContact,
        updated_at: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Contact Updated',
        description: `${formData.first_name} ${formData.last_name} has been updated successfully.`,
      });

      onSuccess?.(updatedContact);
      onOpenChange(false);
    } catch (err) {
      console.error('Error updating contact:', err);
      toast({
        title: 'Error',
        description: 'Failed to update contact. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!contact?.id) return;

    setIsDeleting(true);
    try {
      // This would be an API call to delete the contact
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Contact Deleted',
        description: `${contact.first_name} ${contact.last_name} has been deleted.`,
      });

      onDelete?.(contact.id);
      onOpenChange(false);
    } catch (err) {
      console.error('Error deleting contact:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete contact. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  if (!contact) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Not Found</DialogTitle>
            <DialogDescription>
              The requested contact could not be loaded.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Edit Contact
          </DialogTitle>
          <DialogDescription>
            Update contact information and details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Metadata */}
          <div className="p-4 border rounded-lg bg-muted/20">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Created</Label>
                <p>{contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Updated</Label>
                <p>{contact.updated_at ? new Date(contact.updated_at).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Contact ID</Label>
                <p className="font-mono text-xs">{contact.id}</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className={errors.first_name ? 'border-destructive' : ''}
                />
                {errors.first_name && <p className="text-sm text-destructive">{errors.first_name}</p>}
              </div>
              
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className={errors.last_name ? 'border-destructive' : ''}
                />
                {errors.last_name && <p className="text-sm text-destructive">{errors.last_name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="company"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Contact Status and Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Classification</h3>
            
            <div>
              <Label htmlFor="status">Contact Status</Label>
              <Select
                value={formData.status || 'lead'}
                onValueChange={(value: 'lead' | 'prospect' | 'customer' | 'inactive') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      Lead
                    </div>
                  </SelectItem>
                  <SelectItem value="prospect">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      Prospect
                    </div>
                  </SelectItem>
                  <SelectItem value="customer">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Customer
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" onClick={addTag} disabled={!newTag.trim()}>
                  Add
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Social Media Profiles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media Profiles</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.social_media_profiles?.linkedin || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media_profiles: {
                      ...formData.social_media_profiles,
                      linkedin: e.target.value
                    }
                  })}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              
              <div>
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  value={formData.social_media_profiles?.twitter || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media_profiles: {
                      ...formData.social_media_profiles,
                      twitter: e.target.value
                    }
                  })}
                  placeholder="@johndoe"
                />
              </div>
              
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.social_media_profiles?.facebook || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media_profiles: {
                      ...formData.social_media_profiles,
                      facebook: e.target.value
                    }
                  })}
                  placeholder="https://facebook.com/johndoe"
                />
              </div>
              
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.social_media_profiles?.instagram || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_media_profiles: {
                      ...formData.social_media_profiles,
                      instagram: e.target.value
                    }
                  })}
                  placeholder="@johndoe"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes about this contact..."
                rows={4}
              />
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
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Contact
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {onDelete && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;
