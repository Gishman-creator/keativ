import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Calendar, 
  
  
  TrendingUp,
  Users,
  Eye,
  Heart,
  
  Plus
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import EngagementChart from '../../components/EngagementChart';
import TwitterCard from '../../components/TwitterCard';
import { useEffect, useMemo, useState } from 'react';
import { API_ENDPOINTS } from '@/config/constants';
import { api, ApiResponse } from '@/lib/api';

// Types for backend responses
interface AnalyticsDashboard {
  platform_stats: Record<string, { impressions: number; reach: number; engagement: number }>;
  total_posts: number;
  total_followers: number;
}

interface PostsDashboard {
  total_posts: number;
  scheduled_posts: number;
  published_posts: number;
  failed_posts: number;
  platform_stats: Record<string, number>;
  recent_posts: number;
  social_sets_count: number;
  templates_count: number;
}

interface CalendarPostItem {
  id: string;
  title: string;
  start: string | null;
  platform: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  color?: string;
}

const Dashboard = () => {
  const activeSocialSet = useSelector((state: RootState) => state.socialSets.activeSocialSet);
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [postStats, setPostStats] = useState<PostsDashboard | null>(null);
  const [calendarPosts, setCalendarPosts] = useState<CalendarPostItem[]>([]);

  const platformLogos: { [key: string]: string } = {
    instagram: '/social media/instagram-logo.png',
    twitter: '/social media/x-logo.png',
    facebook: '/social media/facebook-logo.png',
    linkedin: '/social media/linkedin-logo.png',
    tiktok: '/social media/tiktok-logo.png',
  };

  useEffect(() => {
    // Guard: only fetch when authenticated
    if (!api.getToken()) {
      return;
    }

    // Fetch analytics dashboard
    const loadAnalytics = async () => {
      const res: ApiResponse<AnalyticsDashboard> = await api.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
      if (res.success && res.data) setAnalytics(res.data);
    };

    // Fetch posts dashboard stats
    const loadPostStats = async () => {
      const res: ApiResponse<PostsDashboard> = await api.get(API_ENDPOINTS.POSTS.DASHBOARD);
      if (res.success && res.data) setPostStats(res.data);
    };

    // Fetch calendar posts for next 30 days
    const loadCalendar = async () => {
      const now = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 30);
      const startParam = now.toISOString().slice(0, 10);
      const endParam = end.toISOString().slice(0, 10);
      const url = `${API_ENDPOINTS.POSTS.CALENDAR}?start_date=${startParam}&end_date=${endParam}`;
      const res: ApiResponse<{ posts: CalendarPostItem[] }> = await api.get(url);
      if (res.success && res.data?.posts) setCalendarPosts(res.data.posts);
    };

    loadAnalytics();
    loadPostStats();
    loadCalendar();
  }, []);

  // Compute totals for cards
  const { totalFollowers, totalReach, engagementRate, scheduledCount } = useMemo(() => {
    const reach = analytics ? Object.values(analytics.platform_stats || {}).reduce((sum, p) => sum + (p.reach || 0), 0) : 0;
    const engagement = analytics ? Object.values(analytics.platform_stats || {}).reduce((sum, p) => sum + (p.engagement || 0), 0) : 0;
    const rate = reach > 0 ? ((engagement / reach) * 100) : 0;
    const scheduled = postStats?.scheduled_posts ?? 0;
    return {
      totalFollowers: analytics?.total_followers ?? 0,
      totalReach: reach,
      engagementRate: rate,
      scheduledCount: scheduled,
    };
  }, [analytics, postStats]);

  const stats = [
    {
      title: 'Total Followers',
      value: totalFollowers.toLocaleString(),
      change: '',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Total Reach (7d)',
      value: totalReach.toLocaleString(),
      change: '',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'Engagement Rate',
      value: `${engagementRate.toFixed(1)}%`,
      change: '',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Scheduled Posts',
      value: scheduledCount.toString(),
      change: '',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  const upcomingPosts = useMemo(() => {
    const now = new Date();
    return calendarPosts
      .filter(p => p.status === 'scheduled' && p.start && new Date(p.start) >= now)
      .sort((a, b) => (new Date(a.start || 0).getTime()) - (new Date(b.start || 0).getTime()))
      .slice(0, 3);
  }, [calendarPosts]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with {activeSocialSet?.name || 'your social media'}.
          </p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600">
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{stat.change || ' '}</span>
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
        {/* Analytics Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Engagement Overview</CardTitle>
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardHeader>
          <CardContent className='px-0'>
            <EngagementChart />
          </CardContent>
        </Card>

        {/* Upcoming Posts */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Posts</CardTitle>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-gray-900">{post.title}</h4>
                </div>
                {/* Calendar endpoint does not include content snippet; title already trimmed */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {post.platform && (
                      <img
                        src={platformLogos[post.platform]}
                        alt={post.platform}
                        className="h-5 w-5"
                      />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {(() => {
                      const currentYear = new Date().getFullYear();
                      const dateVal = post.start ? new Date(post.start) : new Date();
                      const postYear = dateVal.getFullYear();
                      const dateOptions: Intl.DateTimeFormatOptions = {
                        month: 'short',
                        day: 'numeric',
                      };
                      if (currentYear !== postYear) {
                        dateOptions.year = 'numeric';
                      }
                      return dateVal.toLocaleDateString('en-US', dateOptions);
                    })()}
                  </span>
                </div>
              </div>
            ))}
            {upcomingPosts.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No upcoming posts</p>
                <Button className="mt-2" size="sm">Create Your First Post</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Twitter Test Card - can be removed later */}
      <div className="mt-6">
        <TwitterCard />
      </div>
    </div>
  );
};

export default Dashboard;
