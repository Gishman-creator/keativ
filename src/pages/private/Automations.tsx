import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Pause, TestTube2, Plus, RefreshCw, Linkedin, MessageSquareReply, CheckCircle2, AlertTriangle, ScanSearch, Send } from 'lucide-react';
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

interface LinkedInSyncSummary {
  accounts_checked: number;
  posts_scanned: number;
  comments_found: number;
  replies_sent: number;
  errors: string[];
}

export default function Automations() {
  const [items, setItems] = useState<AutomatedMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [linkedinSyncing, setLinkedinSyncing] = useState(false);
  const [linkedinSummary, setLinkedinSummary] = useState<LinkedInSyncSummary | null>(null);
  const [linkedinError, setLinkedinError] = useState<string | null>(null);
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

  const syncLinkedIn = async () => {
    setLinkedinSyncing(true);
    setLinkedinError(null);
    setLinkedinSummary(null);

    try {
      const result = await automationsApi.syncLinkedInAutomation();
      setLinkedinSummary(result.summary);

      if (result.success) {
        toast({
          title: "LinkedIn Sync Complete",
          description: result.message,
        });
      } else {
        setLinkedinError(result.message);
        toast({
          title: "Sync Completed with Issues",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync LinkedIn automation';
      setLinkedinError(errorMessage);
      toast({
        title: "LinkedIn Sync Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLinkedinSyncing(false);
    }
  };

  // Check if user has an active LinkedIn comment automation
  const hasLinkedInCommentAutomation = items.some(
    (a) => a.platform === 'linkedin' && a.trigger === 'comment' && a.active
  );

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

      {/* LinkedIn Live Automation Manager */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 via-white to-sky-50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Linkedin className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">LinkedIn Live Automation</CardTitle>
              <CardDescription>
                Automatically reply to comments on your LinkedIn posts using your configured templates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasLinkedInCommentAutomation && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">No active LinkedIn comment automation</p>
                <p className="text-amber-700 mt-0.5">
                  Create a new automation with platform <strong>LinkedIn</strong> and trigger <strong>Comment</strong> to enable auto-replies.
                  Use placeholders like <code className="bg-amber-100 px-1 rounded">{'{username}'}</code> and <code className="bg-amber-100 px-1 rounded">{'{comment}'}</code>.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={syncLinkedIn}
              disabled={linkedinSyncing || !hasLinkedInCommentAutomation}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {linkedinSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning LinkedIn...
                </>
              ) : (
                <>
                  <MessageSquareReply className="h-4 w-4 mr-2" />
                  Sync &amp; Reply to LinkedIn Comments
                </>
              )}
            </Button>
            {linkedinSyncing && (
              <span className="text-sm text-gray-500 animate-pulse">
                Connecting to LinkedIn API...
              </span>
            )}
          </div>

          {/* Summary Cards */}
          {linkedinSummary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <ScanSearch className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase">Posts Scanned</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{linkedinSummary.posts_scanned}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquareReply className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase">Comments Found</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{linkedinSummary.comments_found}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Send className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-gray-500 uppercase">Replies Sent</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{linkedinSummary.replies_sent}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase">Accounts</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{linkedinSummary.accounts_checked}</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {linkedinError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-red-700">{linkedinError}</p>
            </div>
          )}
          {linkedinSummary && linkedinSummary.errors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2 space-y-1">
              <p className="text-xs font-semibold text-amber-800 uppercase">Details</p>
              {linkedinSummary.errors.map((err, idx) => (
                <p key={idx} className="text-sm text-amber-700">• {err}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automated Messages List */}
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
