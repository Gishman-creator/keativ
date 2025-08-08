import { useEffect, useState } from 'react';
import { api, ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Pause, TestTube2 } from 'lucide-react';

interface AutomatedMessageItem {
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
  const [items, setItems] = useState<AutomatedMessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res: ApiResponse<AutomatedMessageItem[]> = await api.get(API_ENDPOINTS.MESSAGING.AUTOMATED.LIST);
    if (res.success && Array.isArray(res.data)) {
      setItems(res.data);
      setError(null);
    } else {
      setError(res.error || 'Failed to load automations');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id: string) => {
    await api.post(API_ENDPOINTS.MESSAGING.AUTOMATED.TOGGLE(id));
    load();
  };

  const testSend = async (id: string) => {
    await api.post(API_ENDPOINTS.MESSAGING.AUTOMATED.TEST(id));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">Automations</h1>
          <p className="text-gray-600 mt-1">Manage automated message templates and triggers</p>
        </div>
        <Button variant="outline" onClick={load}>
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Refresh
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Automated Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-600 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : items.length === 0 ? (
            <div className="text-gray-500">No automations</div>
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
    </div>
  );
}
