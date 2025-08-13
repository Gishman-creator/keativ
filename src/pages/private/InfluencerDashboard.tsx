import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Briefcase,
  Eye,
  Heart,
  MessageCircle,
  Trophy,
  Star,
  Calendar,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { InfluencerProfile, CampaignApplication, InfluencerPortfolio } from '@/types';
import { influencerApi } from '@/lib/influencerApi';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  total_applications: number;
  active_campaigns: number;
  total_earnings: number;
  portfolio_items: number;
}

interface DashboardData {
  profile: InfluencerProfile;
  stats: DashboardStats;
  recent_applications: CampaignApplication[];
  portfolio_highlights: InfluencerPortfolio[];
}

function InfluencerDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await influencerApi.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      if(error instanceof Error) {
        toast({
          title: 'Access Restricted',
          description: error.message,
          variant: 'destructive',
        });
      }else{
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSyncFollowers = async () => {
    try {
      setSyncing(true);
      const result = await influencerApi.syncFollowers();
      toast({
        title: 'Success',
        description: `Synced successfully! ${result.total_followers} followers detected`,
      });
      // Refresh dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to sync followers:', error);
      toast({
        title: 'Error',
        description: 'Failed to sync follower data',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
        <div className='container mx-auto px-4 py-8'>
      <div className="flex items-center justify-center h-96">
      
        <div className="text-center max-w-md">
            <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
              <Users className="w-full h-full" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Influencer Dashboard Access Required</h3>
            <p className="text-gray-600 mb-4">
              This dashboard requires influencer account privileges. Contact support to upgrade your account 
              and access detailed analytics, campaign management, and portfolio features.
            </p>
            <Button 
              onClick={fetchDashboardData} 
              variant="outline"
              className="mr-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <Button variant="outline">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { profile, stats, recent_applications, portfolio_highlights } = dashboardData;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'nano': return 'bg-green-100 text-green-800';
      case 'micro': return 'bg-blue-100 text-blue-800';
      case 'macro': return 'bg-purple-100 text-purple-800';
      case 'mega': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Influencer Dashboard</h1>
          <p className="text-gray-600">Manage your influencer profile and campaigns</p>
        </div>
        <Button 
          onClick={handleSyncFollowers} 
          disabled={syncing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          Sync Data
        </Button>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.user.first_name} />
              <AvatarFallback>
                {profile.user.first_name[0]}{profile.user.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">
                  {profile.user.first_name} {profile.user.last_name}
                </h2>
                {profile.is_verified && <Star className="h-5 w-5 text-yellow-500 fill-current" />}
                <Badge className={getTierColor(profile.tier)} variant="secondary">
                  {profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1)} Influencer
                </Badge>
              </div>
              <p className="text-gray-600">@{profile.user.username}</p>
              <p className="text-sm text-gray-700 mt-2">{profile.bio}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {formatNumber(profile.total_followers)} followers
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {(profile.avg_engagement_rate * 100).toFixed(1)}% engagement
                </span>
                <Badge variant="outline">{profile.niche}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold">{stats.total_applications}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">{stats.active_campaigns}</p>
              </div>
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">${stats.total_earnings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Items</p>
                <p className="text-2xl font-bold">{stats.portfolio_items}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Recent Applications</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Highlights</TabsTrigger>
          <TabsTrigger value="analytics">Quick Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest campaign applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recent_applications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent applications</p>
              ) : (
                recent_applications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{application.campaign.title}</h4>
                      <p className="text-sm text-gray-600">{application.campaign.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">${application.campaign.budget.toLocaleString()}</Badge>
                        <Badge variant="outline">{application.campaign.campaign_type}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={application.status === 'accepted' ? 'default' : 
                                application.status === 'rejected' ? 'destructive' : 'secondary'}
                      >
                        {application.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(application.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Highlights</CardTitle>
              <CardDescription>Your best performing content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio_highlights.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 col-span-full">No portfolio items yet</p>
                ) : (
                  portfolio_highlights.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        {item.media_url ? (
                          <img 
                            src={item.media_url} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Eye className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{item.platform}</p>
                        {item.engagement_metrics && (
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {formatNumber(item.engagement_metrics.likes)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {formatNumber(item.engagement_metrics.comments)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Quick Analytics</CardTitle>
              <CardDescription>Key performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-gray-600">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Engagement Rate</span>
                  <span className="text-sm text-gray-600">{(profile.avg_engagement_rate * 100).toFixed(1)}%</span>
                </div>
                <Progress value={profile.avg_engagement_rate * 100} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Analytics
                </Button>
                <Button size="sm">
                  Update Profile
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default InfluencerDashboardPage;