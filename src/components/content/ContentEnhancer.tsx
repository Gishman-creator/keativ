/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/constants';
import ApiClient from '@/lib/api';

interface ContentEnhancerProps {
  originalContent: string;
  platform: string;
  onContentSelect?: (content: string) => void;
}

const ContentEnhancer: React.FC<ContentEnhancerProps> = ({
  originalContent,
  platform,
  onContentSelect
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!originalContent.trim() || originalContent.length < 5) {
      toast({
        title: 'Content too short',
        description: 'Write some content first to get suggestions',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const apiClient = new ApiClient();
      const response = await apiClient.post(API_ENDPOINTS.POSTS.AI_CONTENT_SUGGESTIONS, {
        content: originalContent,
        platform,
      });
      if (response.success && response.data) {
        // Combine analytics based and general suggestions into a single list
        const { analytics_based_suggestions = [], general_suggestions = [] } = response.data as any;
        const combined = [...analytics_based_suggestions, ...general_suggestions];
        setSuggestions(combined.slice(0, 4)); // limit to 4 suggestions for UI consistency
      } else {
        console.error('API error generating suggestions:', response.error);
        toast({
          title: 'Error',
          description: response.error || 'Failed to generate content suggestions',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate content suggestions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // const generateMockSuggestions = (content: string, platform: string): string[] => {
  //   const suggestions = [];
    
  //   // Add platform-specific suggestions
  //   if (platform === 'twitter') {
  //     suggestions.push(
  //       `🚀 ${content} #Innovation`,
  //       `💡 Here's a thought: ${content}`,
  //       `${content} \n\nWhat do you think? 🤔`
  //     );
  //   } else if (platform === 'instagram') {
  //     suggestions.push(
  //       `✨ ${content} ✨\n\n#InstaGood #Content`,
  //       `${content} 📸\n\n#LifeStyle #Inspiration`,
  //       `Feeling inspired! ${content} 💫\n\n#Mood #Vibes`
  //     );
  //   } else if (platform === 'linkedin') {
  //     suggestions.push(
  //       `Professional insight: ${content}\n\n#Leadership #Growth`,
  //       `${content}\n\nThoughts on this approach? I'd love to hear your perspective.`,
  //       `Key takeaway: ${content}\n\n#Business #Strategy`
  //     );
  //   } else {
  //     suggestions.push(
  //       `Enhanced: ${content}`,
  //       `${content} - What are your thoughts?`,
  //       `Consider this: ${content}`
  //     );
  //   }

  //   // Add some general improvements
  //   if (content.length < 100) {
  //     suggestions.push(`${content}\n\nHere's why this matters...`);
  //   }
    
  //   if (!content.includes('?')) {
  //     suggestions.push(`${content}\n\nWhat's your experience with this?`);
  //   }

  //   return suggestions.slice(0, 4); // Limit to 4 suggestions
  // };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy content',
        variant: 'destructive',
      });
    }
  };

  const selectContent = (content: string) => {
    if (onContentSelect) {
      onContentSelect(content);
      toast({
        title: 'Content Updated',
        description: 'Your post content has been updated with the suggestion',
      });
    }
  };

  if (!originalContent || originalContent.length < 5) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 text-center text-gray-500">
          <Zap className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">Write some content first to get AI-powered suggestions</p>
          <p className="text-xs text-gray-400 mt-1">Minimum 5 characters needed</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Content Suggestions
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={generateSuggestions}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              'Generate'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-600">Creating suggestions...</span>
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-600 mb-3">
              AI-generated suggestions for {platform}:
            </p>
            {suggestions.map((suggestion, index) => (
              <Card 
                key={index} 
                className="border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Suggestion {index + 1}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(suggestion, index)}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      {onContentSelect && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => selectContent(suggestion)}
                        >
                          Use
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap text-gray-800">
                    {suggestion}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No suggestions generated yet</p>
            <p className="text-xs text-gray-400 mt-1">Click Generate to get AI-powered content ideas</p>
          </div>
        )}

        {/* Help text */}
        <div className="text-xs text-gray-400 pt-2 border-t">
          💡 Click "Use" to replace your content, or "Copy" to save suggestions for later
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentEnhancer;
