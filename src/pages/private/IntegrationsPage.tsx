import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { api, ApiResponse, TwitterAccount, SocialAccount, LinkedInAccount } from '@/lib/api';

interface VerifyResp { success: boolean; message: string; account?: TwitterAccount }
interface LinkedInVerifyResp { success: boolean; message: string; account?: LinkedInAccount }

const IntegrationsPage = () => {
  const [isTwitterConnected, setIsTwitterConnected] = useState<boolean>(false);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState<boolean>(false);
  const [isSlackConnected, setIsSlackConnected] = useState<boolean>(false);
  const [isCanvaConnected, setIsCanvaConnected] = useState<boolean>(false);
  const [isGoogleDriveConnected, setIsGoogleDriveConnected] = useState<boolean>(false);
  const [isDropboxConnected, setIsDropboxConnected] = useState<boolean>(false);
  const [isZapierConnected, setIsZapierConnected] = useState<boolean>(false);
  // Per-integration loading flags to avoid cross-button coupling
  const [twitterLoading, setTwitterLoading] = useState<boolean>(false);
  const [linkedInLoading, setLinkedInLoading] = useState<boolean>(false);
  // Removed slackLoading placeholder (not needed with generic connect)
  const [genericLoading, setGenericLoading] = useState<string | null>(null);

  useEffect(() => {
    // Check connection status
    const checkConnections = async () => {
      // Check Twitter
      const twitterRes: ApiResponse<VerifyResp> = await api.verifyTwitterCredentials();
      setIsTwitterConnected(Boolean(twitterRes.success && twitterRes.data && twitterRes.data.account));
      
      // Check LinkedIn
      const linkedInRes: ApiResponse<LinkedInVerifyResp> = await api.verifyLinkedInCredentials();
      setIsLinkedInConnected(Boolean(linkedInRes.success && linkedInRes.data && linkedInRes.data.account));
      // Generic small helper
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
      // First get the current user's social accounts to find the Twitter account ID
      const accountsRes = await api.get<SocialAccount[]>('/api/auth/social-accounts/');
      if (accountsRes.success && accountsRes.data) {
        const twitterAccount = accountsRes.data.find(account => 
          account.platform === 'twitter' || account.platform === 'Twitter/X'
        );
        
        if (twitterAccount) {
          // Call the remove endpoint with the correct URL pattern
          const removeRes = await api.delete(`/api/auth/social-accounts/${twitterAccount.id}/remove/`);
          if (removeRes.success) {
            setIsTwitterConnected(false);
            // You could show a success message here if you want
            console.log('Twitter account disconnected successfully');
          } else {
            console.error('Failed to disconnect Twitter account:', removeRes.error);
            // You could show an error message to the user here
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
      // First get the current user's social accounts to find the LinkedIn account ID
      const accountsRes = await api.get<SocialAccount[]>('/api/auth/social-accounts/');
      if (accountsRes.success && accountsRes.data) {
        const linkedInAccount = accountsRes.data.find(account => 
          account.platform === 'linkedin' || account.platform === 'LinkedIn'
        );
        
        if (linkedInAccount) {
          // Call the remove endpoint with the correct URL pattern
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

  const integrations = [
    { key: 'twitter', name: 'Twitter', logo: '/social media/x-logo.png', connected: isTwitterConnected },
    { key: 'facebook', name: 'Facebook', logo: '/social media/facebook-logo.png', connected: false },
    { key: 'instagram', name: 'Instagram', logo: '/social media/instagram-logo.png', connected: false },
    { key: 'linkedin', name: 'LinkedIn', logo: '/social media/linkedin-logo.png', connected: isLinkedInConnected },
    { key: 'slack', name: 'Slack', logo: '/integrated apps/slack-logo.png', connected: isSlackConnected },
    { key: 'canva', name: 'Canva', logo: '/integrated apps/canva-logo.png', connected: isCanvaConnected },
    { key: 'google-drive', name: 'Google Drive', logo: '/integrated apps/google-drive-logo.png', connected: isGoogleDriveConnected },
    { key: 'dropbox', name: 'Dropbox', logo: '/integrated apps/dropbox-logo.png', connected: isDropboxConnected },
    { key: 'zapier', name: 'Zapier', logo: '/logo.png', connected: isZapierConnected },
    { key: 'tiktok', name: 'TikTok', logo: '/social media/tiktok-logo.png', connected: false },
  ];

  const handleGenericConnect = async (key: string) => {
    setGenericLoading(key);
    try {
      const endpoint = `/api/integrations/${key.replace('google-drive','google-drive')}/`; // simple mapping
      const res = await api.post<{ message?: string }>(endpoint, {} as Record<string, unknown>);
      if (res.success) {
        switch (key) {
          case 'slack': setIsSlackConnected(true); break;
          case 'canva': setIsCanvaConnected(true); break;
          case 'google-drive': setIsGoogleDriveConnected(true); break;
          case 'dropbox': setIsDropboxConnected(true); break;
          case 'zapier': setIsZapierConnected(true); break;
          default: break;
        }
      }
    } finally {
      setGenericLoading(null);
    }
  };

  const handleGenericDisconnect = async (key: string) => {
    setGenericLoading(key);
    try {
      const endpoint = `/api/integrations/${key.replace('google-drive','google-drive')}/`;
      const res = await api.post<{ message?: string }>(endpoint, { action: 'disconnect' } as Record<string, unknown>);
      if (res.success) {
        switch (key) {
          case 'slack': setIsSlackConnected(false); break;
          case 'canva': setIsCanvaConnected(false); break;
          case 'google-drive': setIsGoogleDriveConnected(false); break;
          case 'dropbox': setIsDropboxConnected(false); break;
          case 'zapier': setIsZapierConnected(false); break;
          default: break;
        }
      }
    } finally {
      setGenericLoading(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600 mt-1">Connect your social media accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.key}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={integration.logo} alt={integration.name} className="h-8 w-8" />
                <CardTitle>{integration.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {integration.name === 'Twitter' ? (
                integration.connected ? (
                  <Button variant="destructive" className="w-full" onClick={handleDisconnectTwitter} disabled={twitterLoading}>
                    {twitterLoading ? 'Disconnecting...' : 'Disconnect'}
                  </Button>
                ) : (
                  <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleConnectTwitter} disabled={twitterLoading}>
                    <Plus className="mr-2 h-4 w-4" />
                    {twitterLoading ? 'Redirecting...' : 'Connect'}
                  </Button>
                )
              ) : integration.name === 'LinkedIn' ? (
                integration.connected ? (
                  <Button variant="destructive" className="w-full" onClick={handleDisconnectLinkedIn} disabled={linkedInLoading}>
                    {linkedInLoading ? 'Disconnecting...' : 'Disconnect'}
                  </Button>
                ) : (
                  <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={handleConnectLinkedIn} disabled={linkedInLoading}>
                    <Plus className="mr-2 h-4 w-4" />
                    {linkedInLoading ? 'Redirecting...' : 'Connect'}
                  </Button>
                )
              ) : ['Slack','Canva','Google Drive','Dropbox','Zapier'].includes(integration.name) ? (
                integration.connected ? (
                  <div className="flex gap-2">
                    <Button variant="secondary" className="w-full" disabled>
                      Connected
                    </Button>
                    <Button variant="destructive" disabled={genericLoading === integration.key} onClick={() => handleGenericDisconnect(integration.key)}>
                      {genericLoading === integration.key ? '...' : 'Disconnect'}
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled={genericLoading === integration.key} onClick={() => handleGenericConnect(integration.key)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {genericLoading === integration.key ? 'Connecting...' : 'Connect'}
                  </Button>
                )
              ) : (
                integration.connected ? (
                  <Button variant="destructive" className="w-full">Disconnect</Button>
                ) : (
                  <Button className="w-full" disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                )
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
