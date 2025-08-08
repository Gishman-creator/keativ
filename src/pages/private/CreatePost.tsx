import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Loader2 } from 'lucide-react';
import { postsApi, socialAccountsApi, type SocialAccount, type PostCreateWithMedia } from '@/lib/api';
import { SOCIAL_PLATFORMS } from '@/config/constants';
import { toast } from 'sonner';

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [platform, setPlatform] = useState<string>('twitter');
  const [mediaUrl, setMediaUrl] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());
  const [scheduledTime, setScheduledTime] = useState<string>('12:00');
  const [timezone] = useState<string>('UTC');
  const [postType, setPostType] = useState<'post' | 'story' | 'reel' | 'video'>('post');
  const [socialAccountId, setSocialAccountId] = useState<string>('');
  // New: Local file state for image/video
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  useEffect(() => {
    const loadAccounts = async () => {
      setLoadingAccounts(true);
      const res = await socialAccountsApi.getAccounts();
      if (res.success && Array.isArray(res.data)) {
        setAccounts(res.data);
      }
      setLoadingAccounts(false);
    };
    loadAccounts();
  }, []);

  const scheduledISO = useMemo(() => {
    if (!scheduledDate) return '';
    const [h, m] = scheduledTime.split(':').map((v) => parseInt(v, 10));
    const dt = new Date(scheduledDate);
    dt.setHours(h, m, 0, 0);
    return dt.toISOString();
  }, [scheduledDate, scheduledTime]);

  const canSubmit = content.trim().length > 0 && platform && scheduledISO;

  const onSubmit = async () => {
    if (!scheduledISO) {
      toast.error('Please pick a valid date and time');
      return;
    }
    setLoading(true);

    // Base payload shared across both JSON and multipart
    const basePayload: Record<string, unknown> = {
      content,
      caption,
      hashtags,
      // If a file is chosen, ignore media_url in multipart path
      media_url: mediaUrl || undefined,
      platform,
      post_type: postType,
      scheduled_time: scheduledISO,
      timezone,
      status: 'scheduled',
    };
    if (socialAccountId) basePayload['social_account'] = socialAccountId;

    let res;
    if (imageFile || videoFile) {
      // Use multipart upload when a file is provided
      const mediaPayload: PostCreateWithMedia = {
        ...(basePayload as PostCreateWithMedia),
        image: imageFile ?? undefined,
        video: videoFile ?? undefined,
      };
      res = await postsApi.createPostWithMedia(mediaPayload);
    } else {
      res = await postsApi.createPost(basePayload);
    }

    setLoading(false);

    if (res.success) {
      toast.success('Post scheduled successfully');
      navigate('/dashboard/calendar');
      // reset local state
      setImageFile(null);
      setVideoFile(null);
    } else {
      toast.error(res.error || 'Failed to create post');
    }
  };

  // Handlers to ensure only one of image/video is selected
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setVideoFile(null);
  };
  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setVideoFile(file);
    if (file) setImageFile(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">Create Post</h1>
          <p className="text-gray-600 mt-1">Compose content and schedule it for your connected platforms.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={!canSubmit || loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            {loading ? 'Saving...' : 'Schedule Post'}
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Post Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post content..." rows={5} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Caption (optional)</Label>
              <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Add a caption" />
            </div>
            <div className="space-y-2">
              <Label>Hashtags (comma separated)</Label>
              <Input value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="#marketing, #growth" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Post Type</Label>
              <Select value={postType} onValueChange={(v: 'post' | 'story' | 'reel' | 'video') => setPostType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="reel">Reel</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Media URL (optional)</Label>
              <Input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://..." disabled={!!imageFile || !!videoFile} />
            </div>
          </div>

          {/* New: File upload inputs for image or video */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Upload Image (optional)</Label>
              <Input type="file" accept="image/*" onChange={onImageChange} />
              {imageFile && (
                <p className="text-sm text-muted-foreground">Selected: {imageFile.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Upload Video (optional)</Label>
              <Input type="file" accept="video/*" onChange={onVideoChange} />
              {videoFile && (
                <p className="text-sm text-muted-foreground">Selected: {videoFile.name}</p>
              )}
            </div>
            <p className="md:col-span-2 text-xs text-muted-foreground">Choose either an image or a video file. Media URL is disabled when a file is selected.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal', !scheduledDate && 'text-muted-foreground')}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Account (optional)</Label>
              <Select value={socialAccountId} onValueChange={setSocialAccountId} disabled={loadingAccounts}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingAccounts ? 'Loading...' : 'Select account'} />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((a) => a.is_active && a.platform === platform)
                    .map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.username}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
