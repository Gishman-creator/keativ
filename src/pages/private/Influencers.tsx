import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, Users, CheckCircle, XCircle } from 'lucide-react';
import { api } from '@/lib/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface InfluencerApplication {
  id: string;
  name: string;
  email: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  youtube_handle?: string;
  follower_count?: number;
  niche?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function Influencers() {
  const [applications, setApplications] = useState<InfluencerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const res = await api.get<{ results: InfluencerApplication[] } | InfluencerApplication[]>(`${API_BASE}/api/influencers/applications/`);
    if (res.success && res.data) {
      if (Array.isArray(res.data)) {
        setApplications(res.data);
      } else if (res.data.results) {
        setApplications(res.data.results);
      }
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    const res = await api.patch(`${API_BASE}/api/influencers/applications/${id}/`, { status: newStatus });
    if (res.success) {
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    }
  };

  const filtered = statusFilter === 'all' ? applications : applications.filter(a => a.status === statusFilter);

  const getStatusColor = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold font-heading text-gray-900">Influencer Applications</h1>
          <p className="text-gray-600 mt-1">Review and manage inbound creator applications</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            Applications ({filtered.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              className="text-sm border-gray-200 rounded-lg px-2 py-1 outline-none"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-400">Loading applications…</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No applications found matching the current filter.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-3">Creator</th>
                    <th className="px-6 py-3">Followers</th>
                    <th className="px-6 py-3">Socials</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{app.name}</div>
                        <div className="text-gray-500">{app.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {app.follower_count ? (app.follower_count / 1000).toFixed(1) + 'k' : '—'}
                        {app.niche && <div className="text-xs text-gray-400 mt-0.5">{app.niche}</div>}
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        {app.instagram_handle && <div className="text-xs text-pink-600">IG: {app.instagram_handle}</div>}
                        {app.tiktok_handle && <div className="text-xs text-gray-800">TT: {app.tiktok_handle}</div>}
                        {app.youtube_handle && <div className="text-xs text-red-600">YT: {app.youtube_handle}</div>}
                        {!app.instagram_handle && !app.tiktok_handle && !app.youtube_handle && <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`border uppercase text-[10px] ${getStatusColor(app.status)}`}>
                          {app.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {app.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => updateStatus(app.id, 'approved')}>
                              <CheckCircle className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => updateStatus(app.id, 'rejected')}>
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
