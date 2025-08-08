import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
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
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import EngagementChart from '@/components/influencer-dashboard/EngagementChart';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const analyticsData = useSelector((state: RootState) => state.analytics.data);
  const navigate = useNavigate();

  const overviewStats = [
    {
      title: 'Total Followers',
      value: '45.2K',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Total Reach',
      value: '125.4K',
      change: '+18.2%',
      changeType: 'positive',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'Engagement Rate',
      value: '4.8%',
      change: '+2.1%',
      changeType: 'positive',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Total Clicks',
      value: '8.9K',
      change: '-3.2%',
      changeType: 'negative',
      icon: Share,
      color: 'text-purple-600'
    }
  ];

  const platformStats = [
    {
      platform: 'Instagram',
      followers: '12.5K',
      engagement: '5.2%',
      reach: '45.2K',
      color: '#E4405F'
    },
    {
      platform: 'Twitter',
      followers: '8.3K',
      engagement: '3.8%',
      reach: '28.1K',
      color: '#1DA1F2'
    },
    {
      platform: 'Facebook',
      followers: '15.2K',
      engagement: '4.1%',
      reach: '52.1K',
      color: '#1877F2'
    },
    {
      platform: 'LinkedIn',
      followers: '9.2K',
      engagement: '6.2%',
      reach: '18.9K',
      color: '#0A66C2'
    }
  ];

  const topPosts = [
    {
      id: '1',
      title: 'Summer Collection Launch',
      platform: 'Instagram',
      engagement: '892',
      reach: '15.6K',
      date: '2025-01-15',
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Behind the Scenes',
      platform: 'Twitter',
      engagement: '456',
      reach: '9.8K',
      date: '2025-01-14',
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Monday Motivation',
      platform: 'Facebook',
      engagement: '1234',
      reach: '18.9K',
      date: '2025-01-13',
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your social media performance and insights</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-2">
          <div className="flex flex-row space-x-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <Button className="mt-2 mb-5 sm:my-0 bg-red-500 hover:bg-red-600 w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

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
                    <TrendingUp className={`h-4 w-4 mr-1 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                      }`} />
                    <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
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
                    <span className="text-gray-600">Reach:</span>
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
            {topPosts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/dashboard/analytics/posts/${post.id}`)}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{post.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {post.platform}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Engagement:</span>
                      <span className="font-medium">{post.engagement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reach:</span>
                      <span className="font-medium">{post.reach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{post.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
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
                      Behind-the-scenes content performs 40% better than product posts.
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
                      Posts with 5-10 hashtags get 25% more engagement.
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
                      Your follower growth has increased 15% this month.
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
