import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { postsApi, socialAccountsApi, type PostCreateWithMedia, type Post, type SocialAccount } from '@/lib/api';
import { socialSetsApi } from '@/lib/socialSetsApi';
import { type SocialSet } from '@/types';
import { toast } from 'sonner';

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  defaultDate?: Date;
}

export function CreatePostDialog({ open, onClose, onCreated, defaultDate }: CreatePostDialogProps) {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<string>('twitter');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(defaultDate ?? new Date());
  const [scheduledTime, setScheduledTime] = useState<string>('12:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // New: caption and media fields
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [socialSets, setSocialSets] = useState<SocialSet[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('main_brand');
  const [socialAccountId, setSocialAccountId] = useState<string>('');
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);

  useEffect(() => {
    if (open) {
      const loadData = async () => {
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
          console.error("Failed to load accounts or brands in dialog:", err);
        }
        setLoadingAccounts(false);
        setLoadingBrands(false);
      };
      loadData();
    }
  }, [open]);

  // Filter accounts based on platform and the selected Brand (Social Set)
  const filteredAccounts = useMemo(() => {
    const platformActiveAccounts = accounts.filter(
      (a) => a.is_active && a.platform === platform
    );

    if (selectedBrandId === 'main_brand') {
      const assignedAccountIds = new Set(
        socialSets.flatMap((set) => set.platforms.map((p) => p.id))
      );
      return platformActiveAccounts.filter((a) => !assignedAccountIds.has(a.id));
    } else {
      const selectedSet = socialSets.find((set) => set.id === selectedBrandId);
      if (!selectedSet) return [];
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

  const handleSubmit = async () => {
    if (!scheduledDate) {
      toast.error('Please pick a date');
      return;
    }
    const [hours, minutes] = scheduledTime.split(':').map((v) => parseInt(v, 10));
    const dt = new Date(scheduledDate);
    dt.setHours(hours, minutes, 0, 0);
    const when = dt.toISOString();

    setIsSubmitting(true);

    // Base for multipart
    const baseForMedia: Omit<PostCreateWithMedia, 'image' | 'video'> = {
      content,
      caption: caption || '',
      platform,
      post_type: 'post',
      scheduled_time: when,
      status: 'scheduled',
    };
    if (socialAccountId) baseForMedia['social_account'] = socialAccountId;
    if (selectedBrandId && selectedBrandId !== 'main_brand') {
      baseForMedia['social_set'] = selectedBrandId;
    }

    let res;
    if (imageFile || videoFile) {
      // Multipart path when a local file is provided
      const mediaPayload: PostCreateWithMedia = {
        ...baseForMedia,
        image: imageFile ?? undefined,
        video: videoFile ?? undefined,
      };
      res = await postsApi.createPostWithMedia(mediaPayload);
    } else {
      const jsonPayload: Partial<Post> = {
        content,
        caption: caption || '',
        platform,
        post_type: 'post',
        scheduled_time: when,
        status: 'scheduled',
        social_account: socialAccountId || undefined,
        social_set: (selectedBrandId && selectedBrandId !== 'main_brand') ? selectedBrandId : undefined,
      };
      res = await postsApi.createPost(jsonPayload);
    }

    setIsSubmitting(false);

    if (res.success) {
      toast.success('Post scheduled');
      onCreated?.();
      onClose();
      setContent('');
      setCaption('');
      setMediaUrl('');
      setImageFile(null);
      setVideoFile(null);
      setSocialAccountId('');
      setSelectedBrandId('main_brand');
    } else {
      toast.error((res.error as string) || 'Failed to create post');
    }
  };

  // New: ensure only one media file is selected at a time
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    if (f) setVideoFile(null);
  };
  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setVideoFile(f);
    if (f) setImageFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : null)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule a new post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" placeholder="Write your post..." value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          {/* New: caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Input id="caption" placeholder="Add a caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
          {/* New: media URL and file inputs */}
          <div className="space-y-2">
            <Label htmlFor="mediaUrl">Media URL (optional)</Label>
            <Input id="mediaUrl" placeholder="https://..." value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} disabled={!!imageFile || !!videoFile} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Upload Image (optional)</Label>
              <Input type="file" accept="image/*" onChange={onImageChange} />
              {imageFile && <p className="text-xs text-muted-foreground">Selected: {imageFile.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Upload Video (optional)</Label>
              <Input type="file" accept="video/*" onChange={onVideoChange} />
              {videoFile && <p className="text-xs text-muted-foreground">Selected: {videoFile.name}</p>}
            </div>
            <p className="sm:col-span-2 text-xs text-muted-foreground">Choose either an image or a video. Media URL is disabled when a file is selected.</p>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !scheduledDate && 'text-muted-foreground'
                  )}
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? 'Saving...' : 'Schedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
