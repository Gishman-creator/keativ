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
import EngagementChart from '../../components/influencer-dashboard/EngagementChart';
import SchedulePostPage from '@/components/influencer-dashboard/dashboard/schedule-post-page'; // Import the SchedulePostPage component
import React, { useState } from 'react';
import { X } from 'lucide-react'; // Import X icon for close button
import { cn } from '@/lib/utils'; // Import cn for conditional class names
import UpcomingPostsCard from '@/components/influencer-dashboard/UpcomingPostsCard'; // Import the new component

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

  const [showSchedulePostPage, setShowSchedulePostPage] = useState(false);

  const handleCreatePostClick = () => {
    setShowSchedulePostPage(true);
  };

  const handleCloseSchedulePostPage = () => {
    setShowSchedulePostPage(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center flex-shrink-0">
        <div className="mb-3 md:mb-0">
          <h1 className="font-heading text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with {activeSocialSet?.name || 'your social media'}.
          </p>
        </div>
        <div className="mb-5 md:mb-0"> {/* Added a div to contain the button and align it to the right on small screens */}
          <Button className="bg-red-500 hover:bg-red-600" onClick={handleCreatePostClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
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
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Engagement Overview</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
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
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Posts</CardTitle>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </CardHeader>
          <UpcomingPostsCard handleCreatePostClick={handleCreatePostClick} />
        </Card>
      </div>

      {/* Schedule Post Modal Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center h-screen justify-center transition-opacity duration-300",
          showSchedulePostPage ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="relative rounded-lg shadow-xl w-fit max-w-6xl max-h-[90vh] overflow-hidden">
          <SchedulePostPage onClose={handleCloseSchedulePostPage} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
