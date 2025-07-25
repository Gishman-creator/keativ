import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Calendar, 
  MessageCircle, 
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share,
  Plus
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { mockAnalytics, mockPosts } from '../../data/mockData';
import EngagementChart from '../../components/EngagementChart';

const Dashboard = () => {
  const activeSocialSet = useSelector((state: RootState) => state.socialSets.activeSocialSet);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const platformLogos: { [key: string]: string } = {
    instagram: '/social media/instagram-logo.png',
    twitter: '/social media/x-logo.png',
    facebook: '/social media/facebook-logo.png',
    linkedin: '/social media/linkedin-logo.png',
    tiktok: '/social media/tiktok-logo.png',
  };

  const stats = [
    {
      title: 'Total Followers',
      value: '45.2K',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Total Reach',
      value: '125.4K',
      change: '+18.2%',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      title: 'Engagement Rate',
      value: '4.8%',
      change: '+2.1%',
      icon: Heart,
      color: 'text-red-600'
    },
    {
      title: 'Scheduled Posts',
      value: '23',
      change: '+5',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  const upcomingPosts = posts
    .filter(post => post.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
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
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
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
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{post.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {post.platforms.map((platform) => (
                      <img
                        key={platform}
                        src={platformLogos[platform]}
                        alt={platform}
                        className="h-5 w-5"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {(() => {
                      const currentYear = new Date().getFullYear();
                      const postYear = new Date(post.scheduledDate).getFullYear();
                      const dateOptions: Intl.DateTimeFormatOptions = {
                        month: 'short',
                        day: 'numeric',
                      };
                      if (currentYear !== postYear) {
                        dateOptions.year = 'numeric';
                      }
                      return new Date(post.scheduledDate).toLocaleDateString('en-US', dateOptions);
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
    </div>
  );
};

export default Dashboard;
