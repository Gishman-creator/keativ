import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_ENDPOINTS } from '@/config/constants';
import { api, ApiResponse } from '@/lib/api';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: Record<string, unknown>;
  is_read: boolean;
  action_url?: string;
  action_text?: string;
  created_at: string;
}

interface NotificationListResponse {
  notifications: NotificationItem[];
  unread_count: number;
  total_count: number;
}

interface NotificationStats {
  total_notifications: number;
  unread_count: number;
  today_count: number;
  this_week_count: number;
  by_type: Record<string, number>;
  by_priority: Record<string, number>;
}

const priorityColors: Record<NotificationItem['priority'], string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-yellow-100 text-yellow-700',
  urgent: 'bg-red-100 text-red-700',
};

const Notifications = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);

  const unreadCount = useMemo(() => items.filter(i => !i.is_read).length, [items]);

  const loadData = async () => {
    const listRes: ApiResponse<NotificationListResponse> = await api.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
    if (listRes.success && listRes.data) {
      setItems(listRes.data.notifications || []);
    }
    const statsRes: ApiResponse<NotificationStats> = await api.get(API_ENDPOINTS.NOTIFICATIONS.STATS);
    if (statsRes.success && statsRes.data) {
      setStats(statsRes.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const markAllRead = async () => {
    await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    // Optimistic update
    setItems(prev => prev.map(n => ({ ...n, is_read: true })));
    loadData();
  };

  const clearAll = async () => {
    await api.delete(API_ENDPOINTS.NOTIFICATIONS.CLEAR_ALL);
    setItems([]);
    loadData();
  };

  const sendTest = async () => {
    await api.post(API_ENDPOINTS.NOTIFICATIONS.TEST);
    loadData();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay on top of important updates across your workspace.</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={sendTest}>
            <Bell className="mr-2 h-4 w-4" />
            Send Test
          </Button>
          <Button variant="outline" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
          <Button variant="destructive" onClick={clearAll}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Total</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{stats.total_notifications}</CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Unread</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{stats.unread_count}</CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Today</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{stats.today_count}</CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">This Week</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{stats.this_week_count}</CardContent>
          </Card>
        </div>
      )}

      {/* List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">All Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          )}
          {items.map((n) => (
            <div key={n.id} className={`p-4 rounded-lg border flex items-start justify-between ${n.is_read ? 'bg-white' : 'bg-gray-50'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[n.priority]}`}>{n.priority}</span>
                  <span className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                <h3 className="font-medium text-gray-900 mt-1">{n.title}</h3>
                <p className="text-sm text-gray-700 mt-1">{n.message}</p>
                {n.action_url && n.action_text && (
                  <a href={n.action_url} className="text-sm text-blue-600 hover:underline mt-2 inline-block">{n.action_text}</a>
                )}
              </div>
              {!n.is_read && (
                <Button size="sm" variant="outline" onClick={async () => {
                  await api.put(API_ENDPOINTS.NOTIFICATIONS.DETAIL(n.id), { is_read: true });
                  setItems(prev => prev.map(item => item.id === n.id ? { ...item, is_read: true } : item));
                }}>
                  Mark read
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
