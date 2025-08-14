import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { automationsApi } from '@/lib/automationsApi';

interface CreateAutomationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAutomationCreated: () => void;
}

const CreateAutomationDialog: React.FC<CreateAutomationDialogProps> = ({
  open,
  onOpenChange,
  onAutomationCreated
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    platform: '',
    trigger: '',
    content_template: '',
    delay_minutes: 0,
  });
  const [loading, setLoading] = useState(false);

  const platforms = [
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
  ];

  const triggers = [
    { value: 'new_follower', label: 'New Follower' },
    { value: 'mention', label: 'Mention' },
    { value: 'comment', label: 'Comment' },
    { value: 'direct_message', label: 'Direct Message' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.platform || !formData.trigger || !formData.content_template.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      await automationsApi.createAutomatedMessage({
        platform: formData.platform,
        trigger: formData.trigger,
        content_template: formData.content_template,
        delay_minutes: formData.delay_minutes,
      });

      toast({
        title: "Created",
        description: "Automated message has been created successfully.",
      });
      
      onAutomationCreated();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        platform: '',
        trigger: '',
        content_template: '',
        delay_minutes: 0,
      });
    } catch (error) {
      console.error('Failed to create automation:', error);
      toast({
        title: "Error",
        description: "Failed to create automated message.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Automated Message</DialogTitle>
          <DialogDescription>
            Set up an automated response for specific triggers on your social media platforms.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="platform">Platform *</Label>
              <Select 
                value={formData.platform} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="trigger">Trigger *</Label>
              <Select 
                value={formData.trigger} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, trigger: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggers.map((trigger) => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      {trigger.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="content_template">Message Template *</Label>
              <Textarea
                id="content_template"
                placeholder="Hello {username}! Thank you for your interaction..."
                value={formData.content_template}
                onChange={(e) => setFormData(prev => ({ ...prev, content_template: e.target.value }))}
                className="mt-1"
                rows={4}
              />
              <div className="text-xs text-gray-500 mt-1">
                Use placeholders like {'{username}'}, {'{follower_count}'}, etc.
              </div>
            </div>
            
            <div>
              <Label htmlFor="delay_minutes">Delay (minutes)</Label>
              <Input
                id="delay_minutes"
                type="number"
                min="0"
                max="1440"
                placeholder="0"
                value={formData.delay_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, delay_minutes: parseInt(e.target.value) || 0 }))}
                className="mt-1"
              />
              <div className="text-xs text-gray-500 mt-1">
                How long to wait before sending the automated message
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Automation'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAutomationDialog;
