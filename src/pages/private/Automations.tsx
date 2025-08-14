import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Pause, TestTube2, Plus, RefreshCw } from 'lucide-react';
import { automationsApi } from '@/lib/automationsApi';
import { useToast } from '@/hooks/use-toast';
import CreateAutomationDialog from '@/components/automations/CreateAutomationDialog';

interface AutomatedMessage {
  id: string;
  user: number;
  platform: string;
  trigger: string;
  content_template: string;
  delay_minutes: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function Automations() {
  const [items, setItems] = useState<AutomatedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await automationsApi.getAutomatedMessages();
      setItems(data);
    } catch (error) {
      console.error('Failed to load automations:', error);
      setError('Failed to load automations. Please check your connection and try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAutomationCreated = () => {
    setCreateDialogOpen(false);
    load(); // Refresh the list
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id: string) => {
    try {
      await automationsApi.toggleAutomatedMessage(id);
      await load(); // Refresh the list
      toast({
        title: "Updated",
        description: "Automation status has been updated.",
      });
    } catch (error) {
      console.error('Failed to toggle automation:', error);
      toast({
        title: "Error",
        description: "Failed to update automation status.",
        variant: "destructive",
      });
    }
  };

  const testSend = async (id: string) => {
    // For now, use a default test recipient - in production, you'd want a dialog to get this
    const testRecipient = 'test@example.com';
    
    try {
      await automationsApi.testAutomatedMessage(id, testRecipient);
      toast({
        title: "Test Sent",
        description: "Test message has been sent successfully.",
      });
    } catch (error) {
      console.error('Failed to send test:', error);
      toast({
        title: "Error",
        description: "Failed to send test message.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">Automations</h1>
          <p className="text-gray-600 mt-1">Manage automated message templates and triggers</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Automation
          </Button>
          <Button variant="outline" onClick={load}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Automated Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-600 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading automations...
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 text-sm mb-4">{error}</div>
              <Button variant="outline" onClick={load}>
                Try Again
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-4">No automated messages configured yet.</div>
              <div className="text-sm text-gray-400">
                Create your first automation to get started with automated responses.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((a) => (
                <div key={a.id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{a.platform} • {a.trigger}</h3>
                      {a.active ? (
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      <Badge variant="secondary">Delay: {a.delay_minutes}m</Badge>
                    </div>
                    <p className="text-gray-700 mt-1 text-sm">{a.content_template}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => toggle(a.id)}>
                      {a.active ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {a.active ? 'Disable' : 'Enable'}
                    </Button>
                    <Button variant="outline" onClick={() => testSend(a.id)}>
                      <TestTube2 className="h-4 w-4 mr-2" /> Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <CreateAutomationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onAutomationCreated={handleAutomationCreated}
      />
    </div>
  );
}
