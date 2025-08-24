import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ExternalLink, CheckCircle, Unplug } from 'lucide-react';
import { api, ApiResponse, TwitterAccount, SocialAccount, LinkedInAccount } from '@/lib/api';

interface VerifyResp { success: boolean; message: string; account?: TwitterAccount }
interface LinkedInVerifyResp { success: boolean; message: string; account?: LinkedInAccount }

interface IntegrationCardProps {
  logo: string;
  name: string;
  description: string;
  link?: string; // Optional link for external sites
  connected: boolean;
  connectHandler: () => void;
  disconnectHandler: () => void;
  loading: boolean;
  isGeneric?: boolean; // To differentiate between specific handlers and generic ones
}

// Custom HoverTitle component for the disconnect icon
const HoverTitle: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [showTitle, setShowTitle] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setShowTitle(true)}
      onMouseLeave={() => setShowTitle(false)}
    >
      {children}
      {showTitle && (
        <div className="absolute top-full mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap z-10">
          {title}
        </div>
      )}
    </div>
  );
};

const IntegrationCard: React.FC<IntegrationCardProps> = ({ logo, name, description, link, connected, connectHandler, disconnectHandler, loading, isGeneric }) => {
  return (
    <Card className="p-6 flex flex-col border border-gray-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col items-start gap-2">
          <img src={logo} alt={`${name} logo`} className="w-12 h-12 object-contain mb-2 rounded-sm" />
        </div>
        {connected && (
          <HoverTitle title="Disconnect">
            <Button variant="ghost" size="icon" disabled={loading} onClick={disconnectHandler} className="text-gray-500 hover:text-red-500 hover:bg-transparent">
              <Unplug size={20} />
            </Button>
          </HoverTitle>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
        {connected ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-700 font-medium">Connected</span>
          </div>
        ) : (
          <button className="text-gray-600 text-sm flex items-center gap-2 hover:text-gray-800" onClick={connectHandler} disabled={loading}>
            <Plus size={16} />
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>
    </Card>
  );
};

const Integrations: React.FC = () => {
  const [isTwitterConnected, setIsTwitterConnected] = useState<boolean>(false);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState<boolean>(false);
  const [isSlackConnected, setIsSlackConnected] = useState<boolean>(false);
  const [isCanvaConnected, setIsCanvaConnected] = useState<boolean>(false);
  const [isGoogleDriveConnected, setIsGoogleDriveConnected] = useState<boolean>(false);
  const [isDropboxConnected, setIsDropboxConnected] = useState<boolean>(false);
  const [isZapierConnected, setIsZapierConnected] = useState<boolean>(false);
  const [isFacebookConnected, setIsFacebookConnected] = useState<boolean>(false);
  const [isInstagramConnected, setIsInstagramConnected] = useState<boolean>(false);
  const [isTikTokConnected, setIsTikTokConnected] = useState<boolean>(false);

  const [twitterLoading, setTwitterLoading] = useState<boolean>(false);
  const [linkedInLoading, setLinkedInLoading] = useState<boolean>(false);
  const [genericLoading, setGenericLoading] = useState<string | null>(null);

  useEffect(() => {
    const checkConnections = async () => {
      const twitterRes: ApiResponse<VerifyResp> = await api.verifyTwitterCredentials();
      setIsTwitterConnected(Boolean(twitterRes.success && twitterRes.data && twitterRes.data.account));
      
      const linkedInRes: ApiResponse<LinkedInVerifyResp> = await api.verifyLinkedInCredentials();
      setIsLinkedInConnected(Boolean(linkedInRes.success && linkedInRes.data && linkedInRes.data.account));

      const checkSimple = async (endpoint: string, setter: (v: boolean) => void) => {
        try {
          const res = await api.get<{ connected?: boolean }>(endpoint);
          setter(Boolean(res.success && (res.data?.connected)));
        } catch {
          setter(false);
        }
      };

      await Promise.all([
        checkSimple('/api/integrations/slack/', setIsSlackConnected),
        checkSimple('/api/integrations/canva/', setIsCanvaConnected),
        checkSimple('/api/integrations/google-drive/', setIsGoogleDriveConnected),
        checkSimple('/api/integrations/dropbox/', setIsDropboxConnected),
        checkSimple('/api/integrations/zapier/', setIsZapierConnected),
        checkSimple('/api/integrations/facebook/', setIsFacebookConnected),
        checkSimple('/api/integrations/instagram/', setIsInstagramConnected),
        checkSimple('/api/integrations/tiktok/', setIsTikTokConnected),
      ]);
    };
    checkConnections();
  }, []);

  const handleConnectTwitter = async () => {
    setTwitterLoading(true);
    const res = await api.getTwitterAuthorizeUrl();
    setTwitterLoading(false);
    if (res.success && res.data?.authorize_url) {
      window.location.href = res.data.authorize_url;
    }
  };

  const handleDisconnectTwitter = async () => {
    try {
      setTwitterLoading(true);
      const accountsRes = await api.get<SocialAccount[]>('/api/auth/social-accounts/');
      if (accountsRes.success && accountsRes.data) {
        const twitterAccount = accountsRes.data.find(account => 
          account.platform === 'twitter' || account.platform === 'Twitter/X'
        );
        
        if (twitterAccount) {
          const removeRes = await api.delete(`/api/auth/social-accounts/${twitterAccount.id}/remove/`);
          if (removeRes.success) {
            setIsTwitterConnected(false);
            console.log('Twitter account disconnected successfully');
          } else {
            console.error('Failed to disconnect Twitter account:', removeRes.error);
          }
        } else {
          console.error('Twitter account not found');
        }
      } else {
        console.error('Failed to fetch social accounts:', accountsRes.error);
      }
    } catch (error) {
      console.error('Error disconnecting Twitter account:', error);
    } finally {
      setTwitterLoading(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    setLinkedInLoading(true);
    const res = await api.getLinkedInAuthorizeUrl();
    setLinkedInLoading(false);
    if (res.success && res.data?.authorize_url) {
      window.location.href = res.data.authorize_url;
    }
  };

  const handleDisconnectLinkedIn = async () => {
    try {
      setLinkedInLoading(true);
      const accountsRes = await api.get<SocialAccount[]>('/api/auth/social-accounts/');
      if (accountsRes.success && accountsRes.data) {
        const linkedInAccount = accountsRes.data.find(account => 
          account.platform === 'linkedin' || account.platform === 'LinkedIn'
        );
        
        if (linkedInAccount) {
          const removeRes = await api.delete(`/api/auth/social-accounts/${linkedInAccount.id}/remove/`);
          if (removeRes.success) {
            setIsLinkedInConnected(false);
            console.log('LinkedIn account disconnected successfully');
          } else {
            console.error('Failed to disconnect LinkedIn account:', removeRes.error);
          }
        } else {
          console.error('LinkedIn account not found');
        }
      } else {
        console.error('Failed to fetch social accounts:', accountsRes.error);
      }
    } catch (error) {
      console.error('Error disconnecting LinkedIn account:', error);
    } finally {
      setLinkedInLoading(false);
    }
  };

  const handleGenericConnect = async (key: string, setter: (v: boolean) => void) => {
    setGenericLoading(key);
    try {
      const endpoint = `/api/integrations/${key.replace('google-drive','google-drive')}/`;
      const res = await api.post<{ message?: string }>(endpoint, {} as Record<string, unknown>);
      if (res.success) {
        setter(true);
      }
    } finally {
      setGenericLoading(null);
    }
  };

  const handleGenericDisconnect = async (key: string, setter: (v: boolean) => void) => {
    setGenericLoading(key);
    try {
      const endpoint = `/api/integrations/${key.replace('google-drive','google-drive')}/`;
      const res = await api.post<{ message?: string }>(endpoint, { action: 'disconnect' } as Record<string, unknown>);
      if (res.success) {
        setter(false);
      }
    } finally {
      setGenericLoading(null);
    }
  };

  const integrationsData: IntegrationCardProps[] = [
    {
      logo: '/social media/x-logo.png',
      name: 'Twitter',
      description: 'Connect your Twitter/X account to schedule posts and manage your audience.',
      connected: isTwitterConnected,
      connectHandler: handleConnectTwitter,
      disconnectHandler: handleDisconnectTwitter,
      loading: twitterLoading,
    },
    {
      logo: '/social media/facebook-logo.png',
      name: 'Facebook',
      description: 'Integrate with Facebook to manage pages, schedule posts, and analyze performance.',
      connected: isFacebookConnected,
      connectHandler: () => handleGenericConnect('facebook', setIsFacebookConnected),
      disconnectHandler: () => handleGenericDisconnect('facebook', setIsFacebookConnected),
      loading: genericLoading === 'facebook',
      isGeneric: true,
    },
    {
      logo: '/social media/instagram-logo.png',
      name: 'Instagram',
      description: 'Link your Instagram account to schedule visual content and track engagement.',
      connected: isInstagramConnected,
      connectHandler: () => handleGenericConnect('instagram', setIsInstagramConnected),
      disconnectHandler: () => handleGenericDisconnect('instagram', setIsInstagramConnected),
      loading: genericLoading === 'instagram',
      isGeneric: true,
    },
    {
      logo: '/social media/linkedin-logo.png',
      name: 'LinkedIn',
      description: 'Connect your LinkedIn profile or page to share professional content and expand your network.',
      connected: isLinkedInConnected,
      connectHandler: handleConnectLinkedIn,
      disconnectHandler: handleDisconnectLinkedIn,
      loading: linkedInLoading,
    },
    {
      logo: '/integrated apps/slack-logo.png',
      name: 'Slack',
      description: 'A channel-based messaging platform for team collaboration and communication.',
      connected: isSlackConnected,
      connectHandler: () => handleGenericConnect('slack', setIsSlackConnected),
      disconnectHandler: () => handleGenericDisconnect('slack', setIsSlackConnected),
      loading: genericLoading === 'slack',
      isGeneric: true,
    },
    {
      logo: '/integrated apps/canva-logo.png',
      name: 'Canva',
      description: 'Graphic design platform for creating social media graphics, presentations, posters, documents and other visual content.',
      connected: isCanvaConnected,
      connectHandler: () => handleGenericConnect('canva', setIsCanvaConnected),
      disconnectHandler: () => handleGenericDisconnect('canva', setIsCanvaConnected),
      loading: genericLoading === 'canva',
      isGeneric: true,
    },
    {
      logo: '/integrated apps/google-drive-logo.png',
      name: 'Google Drive',
      description: 'Securely store, share, and access your files from anywhere.',
      connected: isGoogleDriveConnected,
      connectHandler: () => handleGenericConnect('google-drive', setIsGoogleDriveConnected),
      disconnectHandler: () => handleGenericDisconnect('google-drive', setIsGoogleDriveConnected),
      loading: genericLoading === 'google-drive',
      isGeneric: true,
    },
    {
      logo: '/integrated apps/dropbox-logo.png',
      name: 'Dropbox',
      description: 'Cloud storage, file synchronization, personal cloud, and client software.',
      connected: isDropboxConnected,
      connectHandler: () => handleGenericConnect('dropbox', setIsDropboxConnected),
      disconnectHandler: () => handleGenericDisconnect('dropbox', setIsDropboxConnected),
      loading: genericLoading === 'dropbox',
      isGeneric: true,
    },
    {
      logo: '/integrated apps/zapier-logo.png', // Assuming a generic logo for Zapier if no specific one is provided
      name: 'Zapier',
      description: 'Automate your workflows by connecting Keativ with thousands of other apps via Zapier.',
      connected: isZapierConnected,
      connectHandler: () => handleGenericConnect('zapier', setIsZapierConnected),
      disconnectHandler: () => handleGenericDisconnect('zapier', setIsZapierConnected),
      loading: genericLoading === 'zapier',
      isGeneric: true,
    },
    {
      logo: '/social media/tiktok-logo.png',
      name: 'TikTok',
      description: 'Connect your TikTok account to schedule short-form video content and reach a wider audience.',
      connected: isTikTokConnected,
      connectHandler: () => handleGenericConnect('tiktok', setIsTikTokConnected),
      disconnectHandler: () => handleGenericDisconnect('tiktok', setIsTikTokConnected),
      loading: genericLoading === 'tiktok',
      isGeneric: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integrations</h2>
        <p className="text-gray-600">Connect your favorite apps to enhance your workflow.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationsData.map((integration, index) => (
          <IntegrationCard key={index} {...integration} />
        ))}
      </div>
    </div>
  );
};

export default Integrations;
