import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { mockPosts } from '../../data/mockData';
import React from 'react';

interface UpcomingPostsCardProps {
  handleCreatePostClick: () => void;
}

const UpcomingPostsCard: React.FC<UpcomingPostsCardProps> = ({ handleCreatePostClick }) => {
  const posts = useSelector((state: RootState) => state.posts.posts);

  const platformLogos: { [key: string]: string } = {
    instagram: '/social media/instagram-logo.png',
    twitter: '/social media/x-logo.png',
    facebook: '/social media/facebook-logo.png',
    linkedin: '/social media/linkedin-logo.png',
    tiktok: '/social media/tiktok-logo.png',
  };

  const upcomingPosts = posts
    .filter(post => post.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 3);

  return (
    <Card className="border-0 shadow-sm">
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
            <Button className="mt-2" size="sm" onClick={handleCreatePostClick}>Create Your First Post</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingPostsCard;
