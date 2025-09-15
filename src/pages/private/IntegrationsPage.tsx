import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { api, ApiResponse, TwitterAccount, SocialAccount, LinkedInAccount, FacebookAccount, TikTokAccount } from '@/lib/api';

interface VerifyResp { success: boolean; message: string; account?: TwitterAccount }
interface LinkedInVerifyResp { success: boolean; message: string; account?: LinkedInAccount }
interface FacebookVerifyResp { success: boolean; message: string; account?: FacebookAccount }

const IntegrationsPage = () => {
  const navigate = useNavigate();
  const [isTwitterConnected, setIsTwitterConnected] = useState<boolean>(false);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState<boolean>(false);
  const [isFacebookConnected, setIsFacebookConnected] = useState<boolean>(false);
  const [isTikTokConnected, setIsTikTokConnected] = useState<boolean>(false);
  const [isSlackConnected, setIsSlackConnected] = useState<boolean>(false);
  const [isCanvaConnected, setIsCanvaConnected] = useState<boolean>(false);
  const [isGoogleDriveConnected, setIsGoogleDriveConnected] = useState<boolean>(false);
  const [isDropboxConnected, setIsDropboxConnected] = useState<boolean>(false);
  const [isZapierConnected, setIsZapierConnected] = useState<boolean>(false);
  // Per-integration loading flags to avoid cross-button coupling
  const [twitterLoading, setTwitterLoading] = useState<boolean>(false);
  const [linkedInLoading, setLinkedInLoading] = useState<boolean>(false);
  const [facebookLoading, setFacebookLoading] = useState<boolean>(false);
  const [tiktokLoading, setTiktokLoading] = useState<boolean>(false);
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
      
      // Check Facebook
      const facebookRes: ApiResponse<FacebookVerifyResp> = await api.verifyFacebookCredentials();
      setIsFacebookConnected(Boolean(facebookRes.success && facebookRes.data && facebookRes.data.account));
      
      // Check TikTok
      const tiktokRes: ApiResponse<TikTokAccount[]> = await api.getTikTokAccounts();
      setIsTikTokConnected(Boolean(tiktokRes.success && tiktokRes.data && tiktokRes.data.length > 0));
      
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
    try {
      const res = await api.getTwitterAuthorizeUrl();
      if (res.success && res.data?.authorize_url) {
        // Use popup for OAuth instead of full page redirect
        const popup = window.open(res.data.authorize_url, 'twitter-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        // Listen for popup to complete OAuth
        const messageHandler = async (event: MessageEvent) => {
          if (event.data?.source === 'twitter-oauth') {
            try {
              const payload = JSON.parse(event.data.data || '{}');
              if (payload.success) {
                // Bind tokens using the API
                const bindRes = await api.bindTwitterTokens(payload);
                if (bindRes.success) {
                  setIsTwitterConnected(true);
                  console.log('Twitter connected successfully');
                } else {
                  console.error('Failed to bind Twitter tokens:', bindRes.error);
                }
              } else {
                console.error('Twitter OAuth failed:', payload);
              }
            } catch (e) {
              console.error('Failed to parse Twitter OAuth response:', e);
            }
            window.removeEventListener('message', messageHandler);
            if (popup && !popup.closed) {
              popup.close();
            }
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Fallback: check if popup was closed manually
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            // Recheck connection status in case it was successful
            setTimeout(async () => {
              const twitterRes = await api.verifyTwitterCredentials();
              setIsTwitterConnected(Boolean(twitterRes.success && twitterRes.data && twitterRes.data.account));
            }, 1000);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error connecting Twitter:', error);
    } finally {
      setTwitterLoading(false);
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
    try {
      const res = await api.getLinkedInAuthorizeUrl();
      if (res.success && res.data?.authorize_url) {
        // Use popup for OAuth instead of full page redirect
        const popup = window.open(res.data.authorize_url, 'linkedin-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        // Listen for popup to complete OAuth
        const messageHandler = async (event: MessageEvent) => {
          if (event.data?.source === 'linkedin-oauth') {
            try {
              const payload = JSON.parse(event.data.data || '{}');
              if (payload.success) {
                // Bind tokens using the API
                const bindRes = await api.bindLinkedInTokens(payload);
                if (bindRes.success) {
                  setIsLinkedInConnected(true);
                  console.log('LinkedIn connected successfully');
                } else {
                  console.error('Failed to bind LinkedIn tokens:', bindRes.error);
                }
              } else {
                console.error('LinkedIn OAuth failed:', payload);
              }
            } catch (e) {
              console.error('Failed to parse LinkedIn OAuth response:', e);
            }
            window.removeEventListener('message', messageHandler);
            if (popup && !popup.closed) {
              popup.close();
            }
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Fallback: check if popup was closed manually
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            // Recheck connection status in case it was successful
            setTimeout(async () => {
              const linkedInRes = await api.verifyLinkedInCredentials();
              setIsLinkedInConnected(Boolean(linkedInRes.success && linkedInRes.data && linkedInRes.data.account));
            }, 1000);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error connecting LinkedIn:', error);
    } finally {
      setLinkedInLoading(false);
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

  const handleConnectFacebook = async () => {
    setFacebookLoading(true);
    try {
      const res = await api.getFacebookAuthorizeUrl();
      if (res.success && res.data?.authorize_url) {
        // Use popup for OAuth instead of full page redirect
        const popup = window.open(res.data.authorize_url, 'facebook-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        // Listen for popup to complete OAuth
        const messageHandler = async (event: MessageEvent) => {
          if (event.data?.source === 'facebook-oauth') {
            try {
              const payload = JSON.parse(event.data.data || '{}');
              if (payload.success) {
                // Bind tokens using the API
                const bindRes = await api.bindFacebookTokens(payload);
                if (bindRes.success) {
                  setIsFacebookConnected(true);
                  console.log('Facebook connected successfully');
                } else {
                  console.error('Failed to bind Facebook tokens:', bindRes.error);
                }
              } else {
                console.error('Facebook OAuth failed:', payload);
              }
            } catch (e) {
              console.error('Failed to parse Facebook OAuth response:', e);
            }
            window.removeEventListener('message', messageHandler);
            if (popup && !popup.closed) {
              popup.close();
            }
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Fallback: check if popup was closed manually
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            // Recheck connection status in case it was successful
            setTimeout(async () => {
              const facebookRes = await api.verifyFacebookCredentials();
              setIsFacebookConnected(Boolean(facebookRes.success && facebookRes.data && facebookRes.data.account));
            }, 1000);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error connecting Facebook:', error);
    } finally {
      setFacebookLoading(false);
    }
  };

  const handleDisconnectFacebook = async () => {
    try {
      setFacebookLoading(true);
      // First get the current user's social accounts to find the Facebook account ID
      const accountsRes = await api.get<SocialAccount[]>('/api/auth/social-accounts/');
      if (accountsRes.success && accountsRes.data) {
        const facebookAccount = accountsRes.data.find(account => 
          account.platform === 'facebook' || account.platform === 'Facebook'
        );
        
        if (facebookAccount) {
          // Call the remove endpoint with the correct URL pattern
          const removeRes = await api.delete(`/api/auth/social-accounts/${facebookAccount.id}/remove/`);
          if (removeRes.success) {
            setIsFacebookConnected(false);
            console.log('Facebook account disconnected successfully');
          } else {
            console.error('Failed to disconnect Facebook account:', removeRes.error);
          }
        } else {
          console.error('Facebook account not found');
        }
      } else {
        console.error('Failed to fetch social accounts:', accountsRes.error);
      }
    } catch (error) {
      console.error('Error disconnecting Facebook account:', error);
    } finally {
      setFacebookLoading(false);
    }
  };

  const handleConnectTikTok = async () => {
    setTiktokLoading(true);
    try {
      const res = await api.getTikTokAuthUrl();
      if (res.success && res.data?.authorize_url) {
        // Use popup for OAuth instead of full page redirect
        const popup = window.open(res.data.authorize_url, 'tiktok-oauth', 'width=600,height=700,scrollbars=yes,resizable=yes');
        
        // Listen for popup to complete OAuth
        const messageHandler = async (event: MessageEvent) => {
          if (event.data?.source === 'tiktok-oauth') {
            try {
              const payload = JSON.parse(event.data.data || '{}');
              if (payload.success) {
                // Bind tokens using the API
                const bindRes = await api.tiktokCallback(payload);
                if (bindRes.success) {
                  setIsTikTokConnected(true);
                  console.log('TikTok connected successfully');
                } else {
                  console.error('Failed to bind TikTok tokens:', bindRes.error);
                }
              } else {
                console.error('TikTok OAuth failed:', payload);
              }
            } catch (e) {
              console.error('Failed to parse TikTok OAuth response:', e);
            }
            window.removeEventListener('message', messageHandler);
            if (popup && !popup.closed) {
              popup.close();
            }
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Fallback: check if popup was closed manually
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            // Recheck connection status in case it was successful
            setTimeout(async () => {
              const tiktokRes = await api.getTikTokAccounts();
              setIsTikTokConnected(Boolean(tiktokRes.success && tiktokRes.data && tiktokRes.data.length > 0));
            }, 1000);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error connecting TikTok:', error);
    } finally {
      setTiktokLoading(false);
    }
  };

  const handleDisconnectTikTok = async () => {
    try {
      setTiktokLoading(true);
      // First get the current user's social accounts to find the TikTok account ID
      const accountsRes = await api.get<SocialAccount[]>('/api/auth/social-accounts/');
      if (accountsRes.success && accountsRes.data) {
        const tiktokAccount = accountsRes.data.find(account => 
          account.platform === 'tiktok' || account.platform === 'TikTok'
        );
        
        if (tiktokAccount) {
          // Call the remove endpoint with the correct URL pattern
          const removeRes = await api.delete(`/api/auth/social-accounts/${tiktokAccount.id}/remove/`);
          if (removeRes.success) {
            setIsTikTokConnected(false);
            console.log('TikTok account disconnected successfully');
          } else {
            console.error('Failed to disconnect TikTok account:', removeRes.error);
          }
        } else {
          console.error('TikTok account not found');
        }
      } else {
        console.error('Failed to fetch social accounts:', accountsRes.error);
      }
    } catch (error) {
      console.error('Error disconnecting TikTok account:', error);
    } finally {
      setTiktokLoading(false);
    }
  };

  const integrations = [
    { key: 'twitter', name: 'Twitter', logo: '/social media/x-logo.png', connected: isTwitterConnected },
    { key: 'facebook', name: 'Facebook', logo: '/social media/facebook-logo.png', connected: isFacebookConnected },
    { key: 'instagram', name: 'Instagram', logo: '/social media/instagram-logo.png', connected: false },
    { key: 'linkedin', name: 'LinkedIn', logo: '/social media/linkedin-logo.png', connected: isLinkedInConnected },
    { key: 'slack', name: 'Slack', logo: '/integrated apps/slack-logo.png', connected: isSlackConnected },
    { key: 'canva', name: 'Canva', logo: '/integrated apps/canva-logo.png', connected: isCanvaConnected },
    { key: 'google-drive', name: 'Google Drive', logo: '/integrated apps/google-drive-logo.png', connected: isGoogleDriveConnected },
    { key: 'dropbox', name: 'Dropbox', logo: '/integrated apps/dropbox-logo.png', connected: isDropboxConnected },
    { key: 'zapier', name: 'Zapier', logo: '/logo.png', connected: isZapierConnected },
    { key: 'tiktok', name: 'TikTok', logo: '/social media/tiktok-logo.png', connected: isTikTokConnected },
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
                <img src={integration.logo} alt={integration.name} className="h-8 w-8 object-cover" />
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
              ) : integration.name === 'Facebook' ? (
                integration.connected ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => navigate('/dashboard/integrations/facebook/manage')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Account
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1" 
                      onClick={handleDisconnectFacebook} 
                      disabled={facebookLoading}
                    >
                      {facebookLoading ? 'Disconnecting...' : 'Disconnect'}
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleConnectFacebook} disabled={facebookLoading}>
                    <Plus className="mr-2 h-4 w-4" />
                    {facebookLoading ? 'Redirecting...' : 'Connect'}
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
              ) : integration.name === 'TikTok' ? (
                integration.connected ? (
                  <Button variant="destructive" className="w-full" onClick={handleDisconnectTikTok} disabled={tiktokLoading}>
                    {tiktokLoading ? 'Disconnecting...' : 'Disconnect'}
                  </Button>
                ) : (
                  <Button className="w-full bg-black hover:bg-gray-800" onClick={handleConnectTikTok} disabled={tiktokLoading}>
                    <Plus className="mr-2 h-4 w-4" />
                    {tiktokLoading ? 'Redirecting...' : 'Connect'}
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
