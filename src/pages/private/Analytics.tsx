import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle,
  Share,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import EngagementChart from '@/components/EngagementChart';
import { API_ENDPOINTS } from '@/config/constants';
import { api } from '@/lib/api';

interface DashboardResponse {
  platform_stats: Record<string, { impressions: number; reach: number; engagement: number }>,
  total_posts: number,
  total_followers: number
}

interface BestPostItem {
  post_id: string;
  platform: string;
  metric_type: string;
  metric_value?: number;
  engagement_rate?: number;
  content?: string;
  created_at?: string;
}

const Analytics = () => {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [bestPosts, setBestPosts] = useState<BestPostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      const [dash, best] = await Promise.all([
        api.get<DashboardResponse>(API_ENDPOINTS.ANALYTICS.DASHBOARD),
        api.get<BestPostItem[]>(API_ENDPOINTS.ANALYTICS.BEST_POSTS),
      ]);
      if (!isMounted) return;
      if (dash.success && dash.data) setDashboard(dash.data);
      if (best.success && Array.isArray(best.data)) setBestPosts(best.data);
      if (!dash.success || !best.success) setError(dash.error || best.error || 'Failed to load analytics');
      setLoading(false);
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const overviewStats = useMemo(() => {
    const totalFollowers = dashboard?.total_followers ?? 0;
    const totalReach = Object.values(dashboard?.platform_stats || {}).reduce((acc, s) => acc + (s.reach || 0), 0);
    const totalEngagement = Object.values(dashboard?.platform_stats || {}).reduce((acc, s) => acc + (s.engagement || 0), 0);
    return [
      {
        title: 'Total Followers',
        value: Intl.NumberFormat().format(totalFollowers),
        change: '+0%','changeType': 'positive', icon: Users, color: 'text-blue-600'
      },
      {
        title: 'Total Reach (7d)',
        value: Intl.NumberFormat().format(totalReach),
        change: '+0%','changeType': 'positive', icon: Eye, color: 'text-green-600'
      },
      {
        title: 'Engagement Sum (7d)',
        value: Intl.NumberFormat().format(totalEngagement),
        change: '+0%','changeType': 'positive', icon: Heart, color: 'text-red-600'
      },
      {
        title: 'Total Posts',
        value: Intl.NumberFormat().format(dashboard?.total_posts ?? 0),
        change: '+0%','changeType': 'positive', icon: Share, color: 'text-purple-600'
      }
    ];
  }, [dashboard]);

  const platformStats = useMemo(() => {
    return Object.entries(dashboard?.platform_stats || {}).map(([platform, stats]) => ({
      platform,
      followers: '-',
      engagement: `${stats.engagement ?? 0}`,
      reach: `${stats.reach ?? 0}`,
      color: '#0A66C2',
    }));
  }, [dashboard]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your social media performance and insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-red-500 hover:bg-red-600">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`h-4 w-4 mr-1 ${
                      stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Engagement Over Time</CardTitle>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <EngagementChart height={600} />
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Platform Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformStats.map((platform, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{platform.platform}</span>
                  </div>
                  <Badge variant="outline">{platform.engagement}</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Followers:</span>
                    <span className="font-medium">{platform.followers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reach (7d):</span>
                    <span className="font-medium">{platform.reach}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-lg font-semibold">Top Performing Posts</CardTitle>
          <Button variant="outline" size="sm">
            View All Posts
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bestPosts.slice(0, 6).map((post) => (
              <div key={post.post_id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{post.content?.slice(0, 60) || 'Post'}</h3>
                    <Badge variant="outline" className="text-xs">
                      {post.platform}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Engagement Rate:</span>
                      <span className="font-medium">{post.engagement_rate ? `${post.engagement_rate.toFixed(2)}%` : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Metric:</span>
                      <span className="font-medium">{post.metric_type} {post.metric_value ?? ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations (static placeholders) */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">AI Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Best Posting Time</h4>
                    <p className="text-sm text-blue-700">
                      Your audience is most active on weekdays between 2-4 PM. 
                      Consider scheduling more posts during this time.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Heart className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Content Performance</h4>
                    <p className="text-sm text-green-700">
                      Behind-the-scenes content performs better than product posts. 
                      Try sharing more process content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-900 mb-1">Hashtag Strategy</h4>
                    <p className="text-sm text-purple-700">
                      Posts with 5-10 hashtags get more engagement. 
                      Consider using trending hashtags in your niche.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900 mb-1">Audience Growth</h4>
                    <p className="text-sm text-orange-700">
                      Your follower growth has increased this month. 
                      Keep up the consistent posting schedule!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;