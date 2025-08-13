import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Users,
  Send,
  Save,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Link as LinkIcon,
  Loader2,
  X,
  Eye
} from 'lucide-react';
import { socialSetsApi } from '@/lib/socialSetsApi';
import { postsApi } from '@/lib/postsApi';
import type { SocialSet } from '@/types';

interface PostData {
  content: string;
  scheduledTime?: string;
  tags: string[];
  mentions: string[];
  socialSetId: string;
  platformSettings: {
    [platform: string]: {
      enabled: boolean;
      customContent?: string;
      hashtags?: string[];
    };
  };
  media: File[];
}

interface PostPreview {
  platform: string;
  content: string;
  characterCount: number;
  characterLimit: number;
  hashtags: string[];
  mentions: string[];
}

const Posts = () => {
  const { toast } = useToast();
  const [socialSets, setSocialSets] = useState<SocialSet[]>([]);
  const [selectedSocialSet, setSelectedSocialSet] = useState<SocialSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSocialSets, setLoadingSocialSets] = useState(true);
  
  const [postData, setPostData] = useState<PostData>({
    content: '',
    scheduledTime: '',
    tags: [],
    mentions: [],
    socialSetId: '',
    platformSettings: {},
    media: []
  });

  const [previews, setPreviews] = useState<PostPreview[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const loadSocialSets = React.useCallback(async () => {
    try {
      setLoadingSocialSets(true);
      const sets = await socialSetsApi.getSocialSets();
      setSocialSets(sets);
      
      // Set the first active social set as default
      const activeSet = sets.find(set => set.isActive) || sets[0];
      if (activeSet) {
        setSelectedSocialSet(activeSet);
        setPostData(prev => ({
          ...prev,
          socialSetId: activeSet.id,
          platformSettings: initializePlatformSettings(activeSet)
        }));
      }
    } catch (error) {
      console.error('Failed to load social sets:', error);
      toast({
        title: "Error",
        description: "Failed to load social sets.",
        variant: "destructive",
      });
    } finally {
      setLoadingSocialSets(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSocialSets();
  }, [loadSocialSets]);

  const initializePlatformSettings = (socialSet: SocialSet) => {
    const settings: PostData['platformSettings'] = {};
    socialSet.platforms.forEach(platform => {
      settings[platform.name] = {
        enabled: true,
        customContent: '',
        hashtags: []
      };
    });
    return settings;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-pink-100 text-pink-800';
      case 'twitter':
        return 'bg-blue-100 text-blue-800';
      case 'facebook':
        return 'bg-blue-100 text-blue-700';
      case 'linkedin':
        return 'bg-blue-100 text-blue-900';
      case 'youtube':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCharacterLimit = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return 280;
      case 'instagram':
        return 2200;
      case 'facebook':
        return 63206;
      case 'linkedin':
        return 3000;
      default:
        return 280;
    }
  };

  const handleSocialSetChange = (socialSetId: string) => {
    const socialSet = socialSets.find(set => set.id === socialSetId);
    if (socialSet) {
      setSelectedSocialSet(socialSet);
      setPostData(prev => ({
        ...prev,
        socialSetId,
        platformSettings: initializePlatformSettings(socialSet)
      }));
    }
  };

  const handlePlatformToggle = (platform: string, enabled: boolean) => {
    setPostData(prev => ({
      ...prev,
      platformSettings: {
        ...prev.platformSettings,
        [platform]: {
          ...prev.platformSettings[platform],
          enabled
        }
      }
    }));
  };

  const handleCustomContentChange = (platform: string, content: string) => {
    setPostData(prev => ({
      ...prev,
      platformSettings: {
        ...prev.platformSettings,
        [platform]: {
          ...prev.platformSettings[platform],
          customContent: content
        }
      }
    }));
  };

  const generatePreviews = () => {
    if (!selectedSocialSet) return [];

    return selectedSocialSet.platforms
      .filter(platform => postData.platformSettings[platform.name]?.enabled)
      .map(platform => {
        const platformSettings = postData.platformSettings[platform.name];
        const content = platformSettings?.customContent || postData.content;
        const characterLimit = getCharacterLimit(platform.name);
        
        return {
          platform: platform.name,
          content,
          characterCount: content.length,
          characterLimit,
          hashtags: postData.tags,
          mentions: postData.mentions
        };
      });
  };

  const handlePreview = () => {
    const newPreviews = generatePreviews();
    setPreviews(newPreviews);
    setShowPreview(true);
  };

  const handleSchedulePost = async () => {
    if (!selectedSocialSet || !postData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a social set and enter post content.",
        variant: "destructive",
      });
      return;
    }

    const enabledPlatforms = Object.entries(postData.platformSettings)
      .filter(([, settings]) => settings.enabled)
      .map(([platform]) => platform);

    if (enabledPlatforms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please enable at least one platform for posting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const postPayload = {
        content: postData.content,
        scheduled_time: postData.scheduledTime || undefined,
        social_set_id: postData.socialSetId,
        platform_settings: postData.platformSettings,
        hashtags: postData.tags,
        mentions: postData.mentions,
        media_urls: postData.media.map(file => file.name) // This would be URLs after upload
      };

      let result;
      if (postData.scheduledTime) {
        // Schedule the post
        result = await postsApi.createPost(postPayload);
        toast({
          title: "Post Scheduled",
          description: `Your post has been scheduled for ${enabledPlatforms.length} platform(s).`,
        });
      } else {
        // Post immediately
        result = await postsApi.postNow(postPayload);
        toast({
          title: "Posted Successfully",
          description: `Your post has been published to ${enabledPlatforms.length} platform(s).`,
        });
      }

      console.log('Post created:', result);

      // Reset form
      setPostData({
        content: '',
        scheduledTime: '',
        tags: [],
        mentions: [],
        socialSetId: selectedSocialSet.id,
        platformSettings: initializePlatformSettings(selectedSocialSet),
        media: []
      });
      
    } catch (error) {
      console.error('Failed to schedule/post:', error);
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedSocialSet || !postData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a social set and enter post content.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const draftPayload = {
        content: postData.content,
        social_set_id: postData.socialSetId,
        platform_settings: postData.platformSettings,
        hashtags: postData.tags,
        mentions: postData.mentions,
        media_urls: postData.media.map(file => file.name) // This would be URLs after upload
      };

      const result = await postsApi.saveDraft(draftPayload);
      console.log('Draft saved:', result);
      
      toast({
        title: "Draft Saved",
        description: "Your post has been saved as a draft.",
      });
      
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingSocialSets) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading social sets...</span>
        </div>
      </div>
    );
  }

  if (socialSets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Create Post</h1>
            <p className="text-gray-600 mt-2">Create and schedule posts across multiple platforms</p>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-4">No Social Sets Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              You need to create social sets first before you can post to multiple platforms. Social sets help you organize your social media accounts.
            </p>
            <Button 
              className="bg-red-500 hover:bg-red-600"
              onClick={() => window.location.href = '/dashboard/influencers'}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Social Set
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create Post</h1>
          <p className="text-gray-600 mt-2">Create and schedule posts across multiple platforms</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={loading || !postData.content.trim()}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            onClick={handlePreview}
            disabled={!postData.content.trim()}
            variant="outline"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Social Set Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Social Set
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Choose Social Set</Label>
                  <Select value={postData.socialSetId} onValueChange={handleSocialSetChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a social set" />
                    </SelectTrigger>
                    <SelectContent>
                      {socialSets.map(socialSet => (
                        <SelectItem key={socialSet.id} value={socialSet.id}>
                          <div className="flex items-center space-x-2">
                            <span>{socialSet.name}</span>
                            {socialSet.isActive && (
                              <Badge variant="secondary" className="text-xs">Active</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSocialSet && (
                  <div className="flex flex-wrap gap-2">
                    {selectedSocialSet.platforms.map(platform => (
                      <Badge key={platform.id} className={getPlatformColor(platform.name)}>
                        {getPlatformIcon(platform.name)}
                        <span className="ml-1 capitalize">{platform.name}</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Post Content */}
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="What's on your mind? Write your post content here..."
                  value={postData.content}
                  onChange={(e) => setPostData(prev => ({ ...prev, content: e.target.value }))}
                  className="mt-2 min-h-[120px]"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{postData.content.length} characters</span>
                  <span>Will be adapted for each platform</span>
                </div>
              </div>

              <div>
                <Label htmlFor="scheduledTime">Schedule (Optional)</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={postData.scheduledTime}
                  onChange={(e) => setPostData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Platform Settings */}
          {selectedSocialSet && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedSocialSet.platforms.map(platform => (
                    <div key={platform.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(platform.name)}
                          <span className="font-medium capitalize">{platform.name}</span>
                          <Badge className={getPlatformColor(platform.name)}>
                            {getCharacterLimit(platform.name)} chars
                          </Badge>
                        </div>
                        <Switch
                          checked={postData.platformSettings[platform.name]?.enabled || false}
                          onCheckedChange={(enabled) => handlePlatformToggle(platform.name, enabled)}
                        />
                      </div>

                      {postData.platformSettings[platform.name]?.enabled && (
                        <div>
                          <Label className="text-sm">Custom content for {platform.name} (optional)</Label>
                          <Textarea
                            placeholder={`Customize content specifically for ${platform.name}...`}
                            value={postData.platformSettings[platform.name]?.customContent || ''}
                            onChange={(e) => handleCustomContentChange(platform.name, e.target.value)}
                            className="mt-2"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={handleSchedulePost}
                disabled={loading || !postData.content.trim()}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {postData.scheduledTime ? 'Schedule Post' : 'Post Now'}
              </Button>
            </CardContent>
          </Card>

          {/* Post Preview */}
          {showPreview && previews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Preview
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowPreview(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {previews.map(preview => (
                  <div key={preview.platform} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getPlatformIcon(preview.platform)}
                        <span className="font-medium capitalize">{preview.platform}</span>
                      </div>
                      <Badge 
                        variant={preview.characterCount > preview.characterLimit ? "destructive" : "secondary"}
                      >
                        {preview.characterCount}/{preview.characterLimit}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 break-words">{preview.content}</p>
                    {preview.hashtags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {preview.hashtags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
