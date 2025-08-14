import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, TrendingUp, Calendar, Lightbulb } from 'lucide-react';
import { api, ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/constants';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface OptimalTime {
  hour: number;
  minute: number;
  day_of_week: number; // 0 = Monday, 6 = Sunday
  engagement_score: number;
}

interface PostSuggestionsProps {
  platform: string;
  onTimeSelect?: (date: Date) => void;
}

const PostSuggestions: React.FC<PostSuggestionsProps> = ({
  platform,
  onTimeSelect
}) => {
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { toast } = useToast();

  const fetchOptimalTimes = useCallback(async () => {
    setLoading(true);
    try {
      const res: ApiResponse<{ optimal_times: OptimalTime[] }> = await api.get(API_ENDPOINTS.INTEGRATIONS.OPTIMAL_TIMES);
      if (res.success && res.data?.optimal_times) {
        // Filter by platform if needed, or use all times
        setOptimalTimes(res.data.optimal_times.slice(0, 6)); // Show top 6 times
        setHasLoaded(true);
      } else {
        setOptimalTimes([]);
        if (res.error) {
          toast({
            title: 'Error',
            description: 'Failed to get optimal posting times',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching optimal times:', error);
      setOptimalTimes([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOptimalTimes();
  }, [platform, fetchOptimalTimes]);

  const getDayName = (dayIndex: number) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[dayIndex] || 'N/A';
  };

  const formatTime = (hour: number, minute: number) => {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return format(date, 'h:mm a');
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 40) return { label: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Low', color: 'bg-gray-100 text-gray-800' };
  };

  const handleTimeSelect = (optimalTime: OptimalTime) => {
    if (!onTimeSelect) return;

    // Create a date for the next occurrence of this day/time
    const now = new Date();
    const targetDate = new Date(now);
    
    // Find the next occurrence of the target day
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const targetDay = optimalTime.day_of_week === 6 ? 0 : optimalTime.day_of_week + 1; // Convert our format to Date's format
    
    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget <= 0) {
      daysUntilTarget += 7; // Next week
    }
    
    targetDate.setDate(now.getDate() + daysUntilTarget);
    targetDate.setHours(optimalTime.hour, optimalTime.minute, 0, 0);
    
    onTimeSelect(targetDate);
    
    toast({
      title: 'Time Selected',
      description: `Set to ${getDayName(optimalTime.day_of_week)} at ${formatTime(optimalTime.hour, optimalTime.minute)}`,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Optimal Posting Times
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={fetchOptimalTimes}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              'Refresh'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !hasLoaded ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-600">Analyzing engagement patterns...</span>
          </div>
        ) : optimalTimes.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              Based on your audience engagement data for {platform}:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {optimalTimes.map((time, index) => {
                const engagement = getEngagementLevel(time.engagement_score);
                return (
                  <Card 
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                    onClick={() => handleTimeSelect(time)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-sm">
                            {getDayName(time.day_of_week)}
                          </span>
                        </div>
                        <Badge className={engagement.color} variant="secondary">
                          {engagement.label}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-mono">
                          {formatTime(time.hour, time.minute)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">
                          Engagement Score: {time.engagement_score.toFixed(0)}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${time.engagement_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {onTimeSelect && (
              <div className="text-xs text-gray-400 pt-2 border-t">
                💡 Click on any time slot to auto-schedule your post
              </div>
            )}
          </div>
        ) : hasLoaded ? (
          <div className="text-center py-6 text-gray-500">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No optimal posting times data available</p>
            <p className="text-xs text-gray-400 mt-1">
              Post more content to get personalized suggestions
            </p>
          </div>
        ) : null}

        {/* General Tips */}
        {hasLoaded && (
          <Card className="mt-4 bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-1" />
                Pro Tips for {platform}
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                {platform === 'instagram' && (
                  <>
                    <li>• Post during lunch hours (11 AM - 1 PM) for higher engagement</li>
                    <li>• Wednesday and Friday tend to have the best reach</li>
                    <li>• Include 5-10 relevant hashtags for optimal discovery</li>
                  </>
                )}
                {platform === 'twitter' && (
                  <>
                    <li>• Tweet during commute hours (8-9 AM, 5-6 PM) for more views</li>
                    <li>• Weekdays generally outperform weekends</li>
                    <li>• Use 1-2 hashtags maximum for better engagement</li>
                  </>
                )}
                {platform === 'linkedin' && (
                  <>
                    <li>• Post Tuesday-Thursday for professional audience</li>
                    <li>• Morning hours (8-10 AM) work best for B2B content</li>
                    <li>• Include industry-relevant hashtags and tag connections</li>
                  </>
                )}
                {platform === 'facebook' && (
                  <>
                    <li>• Weekend posts often get more personal engagement</li>
                    <li>• Mid-morning (10-11 AM) shows consistent performance</li>
                    <li>• Visual content with captions perform better than text-only</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default PostSuggestions;
