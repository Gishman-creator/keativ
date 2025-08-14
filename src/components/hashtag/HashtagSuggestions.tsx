import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Hash, Plus, X } from 'lucide-react';
import { api, ApiResponse } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/constants';
import { useToast } from '@/hooks/use-toast';

interface HashtagSuggestionsProps {
  content: string;
  platform?: string;
  currentHashtags: string[];
  onHashtagAdd: (hashtag: string) => void;
  onHashtagRemove: (hashtag: string) => void;
}

const HashtagSuggestions: React.FC<HashtagSuggestionsProps> = ({
  content,
  platform = 'instagram',
  currentHashtags,
  onHashtagAdd,
  onHashtagRemove
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const { toast } = useToast();

  const fetchSuggestions = useCallback(async () => {
    if (!content.trim() || content.length < 10) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res: ApiResponse<{ hashtags: string[] }> = await api.post(API_ENDPOINTS.INTEGRATIONS.HASHTAG_SUGGEST, { content, platform });
      if (res.success && res.data?.hashtags) {
        // Filter out hashtags that are already being used
        const newSuggestions = res.data.hashtags.filter(
          (hashtag: string) => !currentHashtags.some(current => 
            current.toLowerCase().replace('#', '') === hashtag.toLowerCase().replace('#', '')
          )
        );
        setSuggestions(newSuggestions);
        setHasRequested(true);
      } else {
        setSuggestions([]);
        if (res.error) {
          toast({
            title: 'Error',
            description: 'Failed to get hashtag suggestions',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching hashtag suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [content, platform, currentHashtags, toast]);

  // Auto-fetch when content changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content && content.length >= 10) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setHasRequested(false);
      }
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [content, platform, fetchSuggestions]);

  const handleAddHashtag = (hashtag: string) => {
    const cleanHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    onHashtagAdd(cleanHashtag);
    // Remove from suggestions after adding
    setSuggestions(prev => prev.filter(h => h !== hashtag));
  };

  const handleRemoveHashtag = (hashtag: string) => {
    onHashtagRemove(hashtag);
    // Optionally re-add to suggestions if it was originally suggested
    // We won't do this to keep UI clean, but user can regenerate suggestions
  };

  if (!content || content.length < 10) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 text-center text-gray-500">
          <Hash className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">Write some content first to get hashtag suggestions</p>
          <p className="text-xs text-gray-400 mt-1">Minimum 10 characters needed</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <Hash className="h-4 w-4 mr-2" />
            Hashtag Suggestions
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={fetchSuggestions}
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
      <CardContent className="space-y-3">
        {/* Current Hashtags */}
        {currentHashtags.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Current Hashtags:</p>
            <div className="flex flex-wrap gap-1">
              {currentHashtags.map((hashtag, index) => (
                <Badge 
                  key={index} 
                  variant="default" 
                  className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                  onClick={() => handleRemoveHashtag(hashtag)}
                >
                  {hashtag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-600">Getting suggestions...</span>
          </div>
        )}

        {/* Suggestions */}
        {!loading && suggestions.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Suggested Hashtags:</p>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((hashtag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => handleAddHashtag(hashtag)}
                >
                  #{hashtag.replace('#', '')}
                  <Plus className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* No suggestions */}
        {!loading && hasRequested && suggestions.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No new hashtag suggestions found</p>
            <p className="text-xs text-gray-400 mt-1">Try different content or refresh</p>
          </div>
        )}

        {/* Help text */}
        <div className="text-xs text-gray-400 pt-2 border-t">
          💡 Click suggested hashtags to add them, or click current hashtags to remove them
        </div>
      </CardContent>
    </Card>
  );
};

export default HashtagSuggestions;
