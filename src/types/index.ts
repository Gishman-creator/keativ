export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  role?: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export interface SocialSet {
  id: string;
  name: string;
  description?: string;
  platforms: Platform[];
  userId: string;
  isActive?: boolean;
  accountCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Platform {
  id: string;
  name: string;
  type: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube';
  isConnected: boolean;
  accountName?: string;
  followers?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  mediaUrls: string[];
  platforms: string[];
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  socialSetId: string;
  hashtags: string[];
  location?: string;
  taggedUsers?: string[];
}

export interface AnalyticsData {
  platform: string;
  followers: number;
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
}

// Influencer System Types
export interface InfluencerProfile {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  bio: string;
  niche: string;
  secondary_niches?: string[];
  total_followers: number;
  avg_engagement_rate: number;
  tier: 'nano' | 'micro' | 'macro' | 'mega';
  location?: string;
  languages?: string[];
  is_verified: boolean;
  is_available: boolean;
  image_rate?: number;
  video_rate?: number;
  story_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  budget: number;
  campaign_type: 'sponsored_post' | 'product_review' | 'brand_ambassador' | 'event_promotion' | 'giveaway' | 'other';
  target_niches: string[];
  requirements?: string;
  deliverables?: string;
  is_paid: boolean;
  application_deadline?: string;
  start_date?: string;
  end_date?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  creator: {
    id: string;
    username: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CampaignApplication {
  id: string;
  campaign: Campaign;
  influencer: InfluencerProfile;
  message: string;
  proposed_rate?: number;
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
}

export interface InfluencerPortfolio {
  id: string;
  title: string;
  description: string;
  media_url?: string;
  media_type: 'image' | 'video';
  platform: string;
  engagement_metrics?: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  campaign_type?: string;
  created_at: string;
}

export interface Collaboration {
  id: string;
  type: 'influencer' | 'brand';
  collaboration_type: 'campaign' | 'long_term' | 'one_time' | 'ambassador';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  brand_name?: string;
  influencer_name?: string;
  campaign_title?: string;
  deliverables: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface Influencer {
  id: string;
  name: string;
  platform: string;
  handle: string;
  followers: number;
  engagementRate: number;
  category: string;
  avatar: string;
  recentMentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface Message {
  id: string;
  platform: string;
  from: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  avatar?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: Date;
  source: 'local' | 'gdrive' | 'dropbox';
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  lastActive: Date;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  display_name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: {
    max_social_accounts: number;
    max_scheduled_posts: number;
    max_team_members: number;
    analytics_retention_days: number;
    api_rate_limit: number;
    gohighlevel_integration: boolean;
    advanced_analytics: boolean;
    priority_support: boolean;
    white_label: boolean;
  };
}
