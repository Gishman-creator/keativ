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
import { Calendar as CalendarIcon, Plus, Loader2, Repeat, Clock, RefreshCw } from 'lucide-react';
import { postsApi, socialAccountsApi, type SocialAccount, type PostCreateWithMedia } from '@/lib/api';
import { socialSetsApi } from '@/lib/socialSetsApi';
import { type SocialSet } from '@/types';
import { SOCIAL_PLATFORMS } from '@/config/constants';
import { toast } from 'sonner';
import HashtagSuggestions from '@/components/hashtag/HashtagSuggestions';
import PostSuggestions from '@/components/posts/PostSuggestions';
import ContentEnhancer from '@/components/content/ContentEnhancer';

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtagsArray, setHashtagsArray] = useState<string[]>([]);
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

  // Queue & Evergreen Scheduling
  const [useQueue, setUseQueue] = useState(false);
  const [queueSlotISO, setQueueSlotISO] = useState<string>('');
  const [loadingQueueSlot, setLoadingQueueSlot] = useState(false);
  const [isEvergreen, setIsEvergreen] = useState(false);
  const [recycleIntervalDays, setRecycleIntervalDays] = useState<number>(30);
  const [maxRecycleCount, setMaxRecycleCount] = useState<number | undefined>(undefined);

  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [socialSets, setSocialSets] = useState<SocialSet[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('main_brand');
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Fetch next queue slot when Queue mode is active
  useEffect(() => {
    if (!useQueue) return;
    const fetchSlot = async () => {
      setLoadingQueueSlot(true);
      try {
        const res = await postsApi.getNextQueueSlot(platform);
        if (res.data?.next_available_slot) {
          const slotIso = res.data.next_available_slot;
          setQueueSlotISO(slotIso);
          const dt = new Date(slotIso);
          setScheduledDate(dt);
          const h = dt.getHours().toString().padStart(2, '0');
          const m = dt.getMinutes().toString().padStart(2, '0');
          setScheduledTime(`${h}:${m}`);
        }
      } catch (err) {
        console.error("Failed to fetch next queue slot:", err);
      } finally {
        setLoadingQueueSlot(false);
      }
    };
    fetchSlot();
  }, [useQueue, platform]);

  useEffect(() => {
    const loadAccountsAndBrands = async () => {
      setLoadingAccounts(true);
      setLoadingBrands(true);
      try {
        const accRes = await socialAccountsApi.getAccounts();
        if (accRes.success && Array.isArray(accRes.data)) {
          setAccounts(accRes.data);
        }
        const sets = await socialSetsApi.getSocialSets();
        setSocialSets(sets);
      } catch (err) {
        console.error("Failed to load accounts or social sets:", err);
      }
      setLoadingAccounts(false);
      setLoadingBrands(false);
    };
    loadAccountsAndBrands();
  }, []);

  // Filter accounts based on platform and the selected Brand (Social Set)
  const filteredAccounts = useMemo(() => {
    const platformActiveAccounts = accounts.filter(
      (a) => a.is_active && a.platform === platform
    );

    if (selectedBrandId === 'main_brand') {
      // Find all account IDs assigned to any brand (social set)
      const assignedAccountIds = new Set(
        socialSets.flatMap((set) => set.platforms.map((p) => p.id))
      );
      // Filter platform accounts that are NOT assigned to any brand (default)
      return platformActiveAccounts.filter((a) => !assignedAccountIds.has(a.id));
    } else {
      // Find the selected social set
      const selectedSet = socialSets.find((set) => set.id === selectedBrandId);
      if (!selectedSet) return [];
      // Filter platform accounts that ARE assigned to this brand
      const setAccountIds = new Set(selectedSet.platforms.map((p) => p.id));
      return platformActiveAccounts.filter((a) => setAccountIds.has(a.id));
    }
  }, [accounts, platform, selectedBrandId, socialSets]);

  // Reset socialAccountId if it is not in the newly filtered list
  useEffect(() => {
    if (socialAccountId && !filteredAccounts.some((a) => a.id === socialAccountId)) {
      setSocialAccountId('');
    }
  }, [filteredAccounts, socialAccountId]);

  const scheduledISO = useMemo(() => {
    if (!scheduledDate) return '';
    const [h, m] = scheduledTime.split(':').map((v) => parseInt(v, 10));
    const dt = new Date(scheduledDate);
    dt.setHours(h, m, 0, 0);
    return dt.toISOString();
  }, [scheduledDate, scheduledTime]);

  const finalScheduledISO = (useQueue && queueSlotISO) ? queueSlotISO : scheduledISO;
  const canSubmit = content.trim().length > 0 && platform && finalScheduledISO;

  const onSubmit = async () => {
    if (!finalScheduledISO) {
      toast.error('Please pick a valid date and time or enable Queue');
      return;
    }
    setLoading(true);

    // Base payload shared across both JSON and multipart
    const basePayload: Record<string, unknown> = {
      content,
      caption,
      hashtags: hashtagsArray.join(', '),
      // If a file is chosen, ignore media_url in multipart path
      media_url: mediaUrl || undefined,
      platform,
      post_type: postType,
      scheduled_time: finalScheduledISO,
      timezone,
      status: 'scheduled',
      is_evergreen: isEvergreen,
      recycle_interval_days: isEvergreen ? recycleIntervalDays : undefined,
      max_recycle_count: isEvergreen ? (maxRecycleCount || null) : undefined,
    };
    if (socialAccountId) basePayload['social_account'] = socialAccountId;
    if (selectedBrandId && selectedBrandId !== 'main_brand') {
      basePayload['social_set'] = selectedBrandId;
    }

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

  // Hashtag handlers
  const handleHashtagAdd = (hashtag: string) => {
    if (!hashtagsArray.includes(hashtag)) {
      setHashtagsArray(prev => [...prev, hashtag]);
    }
  };

  const handleHashtagRemove = (hashtag: string) => {
    setHashtagsArray(prev => prev.filter(h => h !== hashtag));
  };

  // Handler for optimal time selection
  const handleOptimalTimeSelect = (date: Date) => {
    setScheduledDate(date);
    setScheduledTime(format(date, 'HH:mm'));
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

          {/* Dynamic Queue & Evergreen Controls */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="queue-checkbox"
                  checked={useQueue}
                  onChange={(e) => setUseQueue(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="queue-checkbox" className="text-sm font-medium flex items-center gap-1.5 cursor-pointer">
                  <Clock className="h-4 w-4 text-primary" />
                  Add to Next Queue Slot
                </label>
              </div>

              {useQueue && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/80 border rounded-md px-3 py-1.5 shadow-sm">
                  {loadingQueueSlot ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Finding next available slot...</span>
                    </>
                  ) : queueSlotISO ? (
                    <>
                      <span className="font-semibold text-foreground">Auto-assigned:</span>
                      <span>{format(new Date(queueSlotISO), "EEE, MMM d, yyyy 'at' h:mm a")}</span>
                      <button
                        type="button"
                        onClick={() => {
                          postsApi.getNextQueueSlot(platform).then((res) => {
                            if (res.data?.next_available_slot) {
                              setQueueSlotISO(res.data.next_available_slot);
                              const dt = new Date(res.data.next_available_slot);
                              setScheduledDate(dt);
                              const h = dt.getHours().toString().padStart(2, '0');
                              const m = dt.getMinutes().toString().padStart(2, '0');
                              setScheduledTime(`${h}:${m}`);
                            }
                          });
                        }}
                        className="ml-1 text-primary hover:underline flex items-center gap-1"
                        title="Refresh next slot"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <span>No vacant slot found; using default</span>
                  )}
                </div>
              )}
            </div>

            {/* Evergreen Recycling Toggle & Config */}
            <div className="border-t pt-3 space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="evergreen-checkbox"
                  checked={isEvergreen}
                  onChange={(e) => setIsEvergreen(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="evergreen-checkbox" className="text-sm font-medium flex items-center gap-1.5 cursor-pointer">
                  <Repeat className="h-4 w-4 text-emerald-600" />
                  Evergreen Content (Auto-Recycle)
                </label>
              </div>

              {isEvergreen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-7">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Recycle Every</Label>
                    <Select
                      value={recycleIntervalDays.toString()}
                      onValueChange={(val) => setRecycleIntervalDays(parseInt(val, 10))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 Days (Weekly)</SelectItem>
                        <SelectItem value="14">14 Days (Bi-weekly)</SelectItem>
                        <SelectItem value="30">30 Days (Monthly)</SelectItem>
                        <SelectItem value="60">60 Days (2 Months)</SelectItem>
                        <SelectItem value="90">90 Days (Quarterly)</SelectItem>
                        <SelectItem value="180">180 Days (Half-Year)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Max Recycles</Label>
                    <Select
                      value={maxRecycleCount ? maxRecycleCount.toString() : "unlimited"}
                      onValueChange={(val) => setMaxRecycleCount(val === "unlimited" ? undefined : parseInt(val, 10))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unlimited">Unlimited (Continuous)</SelectItem>
                        <SelectItem value="1">1 Time</SelectItem>
                        <SelectItem value="3">3 Times</SelectItem>
                        <SelectItem value="5">5 Times</SelectItem>
                        <SelectItem value="10">10 Times</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Label>Brand</Label>
              <Select value={selectedBrandId} onValueChange={setSelectedBrandId} disabled={loadingBrands}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingBrands ? 'Loading...' : 'Select Brand'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main_brand">Main Brand (Default)</SelectItem>
                  {socialSets.map((set) => (
                    <SelectItem key={set.id} value={set.id}>
                      {set.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account (optional)</Label>
              <Select value={socialAccountId} onValueChange={setSocialAccountId} disabled={loadingAccounts}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingAccounts ? 'Loading...' : 'Select account'} />
                </SelectTrigger>
                <SelectContent>
                  {filteredAccounts.map((a) => (
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

      {/* Content Enhancement Suggestions */}
      <ContentEnhancer
        originalContent={content}
        platform={platform}
        onContentSelect={setContent}
      />

      {/* Hashtag Suggestions */}
      <HashtagSuggestions
        content={content}
        platform={platform}
        currentHashtags={hashtagsArray}
        onHashtagAdd={handleHashtagAdd}
        onHashtagRemove={handleHashtagRemove}
      />

      {/* Post Suggestions - Optimal Times */}
      <PostSuggestions
        platform={platform}
        onTimeSelect={handleOptimalTimeSelect}
      />
    </div>
  );
};

export default CreatePost;
