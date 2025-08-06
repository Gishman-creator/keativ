import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  TrendingUp, 
  Heart, 
  MessageCircle,
  Plus,
  Eye
} from 'lucide-react';
import { mockInfluencers } from '../../data/mockData';

const Influencers = () => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700';
      case 'negative':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">Influencers</h1>
          <p className="text-gray-600 mt-1">Track and manage influencer relationships and mentions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-red-500 hover:bg-red-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Influencer
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search influencers..."
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">All Platforms</Button>
              <Button variant="outline" size="sm">Instagram</Button>
              <Button variant="outline" size="sm">Twitter</Button>
              <Button variant="outline" size="sm">TikTok</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Influencer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-600">Total Influencers</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-sm text-gray-600">Total Mentions</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">4.2%</p>
            <p className="text-sm text-gray-600">Avg Engagement</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">+18%</p>
            <p className="text-sm text-gray-600">Growth This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Influencers List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Tracked Influencers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInfluencers.map((influencer) => (
              <div key={influencer.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={influencer.avatar} alt={influencer.name} />
                      <AvatarFallback>
                        {influencer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg text-gray-900">{influencer.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {influencer.platform}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{influencer.handle}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{formatNumber(influencer.followers)} followers</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{influencer.engagementRate}% engagement</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {influencer.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSentimentColor(influencer.sentiment)}`}
                      >
                        {influencer.sentiment}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MessageCircle className="h-4 w-4" />
                        <span>{influencer.recentMentions} mentions</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="mr-1 h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Mentions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-lg font-semibold">Recent Mentions</CardTitle>
          <Button variant="outline" size="sm">
            View All Mentions
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                influencer: 'Alex Creative',
                platform: 'Instagram',
                content: 'Just tried out @zenith for social media management and I\'m impressed! The interface is so clean and intuitive.',
                timestamp: '2 hours ago',
                engagement: '234 likes, 12 comments'
              },
              {
                influencer: 'Design Guru',
                platform: 'Twitter',
                content: 'Loving the new features in @zenith! The analytics dashboard is exactly what I needed for my clients.',
                timestamp: '5 hours ago',
                engagement: '89 likes, 23 retweets'
              },
              {
                influencer: 'Creative Studio',
                platform: 'LinkedIn',
                content: 'We\'ve been using Zenith for our social media management and it\'s been a game-changer for our workflow.',
                timestamp: '1 day ago',
                engagement: '156 likes, 34 comments'
              }
            ].map((mention, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{mention.influencer}</span>
                    <Badge variant="outline" className="text-xs">
                      {mention.platform}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-green-100 text-green-700"
                    >
                      Positive
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{mention.timestamp}</span>
                </div>
                <p className="text-gray-700 mb-3">{mention.content}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{mention.engagement}</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Heart className="mr-1 h-4 w-4" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="mr-1 h-4 w-4" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Influencers;