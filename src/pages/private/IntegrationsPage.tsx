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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check connection status
    const checkConnections = async () => {
      // Check Twitter
      const twitterRes: ApiResponse<VerifyResp> = await api.verifyTwitterCredentials();
      setIsTwitterConnected(Boolean(twitterRes.success && twitterRes.data && twitterRes.data.account));
      
      // Check LinkedIn
      const linkedInRes: ApiResponse<LinkedInVerifyResp> = await api.verifyLinkedInCredentials();
      setIsLinkedInConnected(Boolean(linkedInRes.success && linkedInRes.data && linkedInRes.data.account));
    };
    checkConnections();
  }, []);

  const handleConnectTwitter = async () => {
    setLoading(true);
    const res = await api.getTwitterAuthorizeUrl();
    setLoading(false);
    if (res.success && res.data?.authorize_url) {
      window.location.href = res.data.authorize_url;
    }
  };

  const handleDisconnectTwitter = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    setLoading(true);
    const res = await api.getLinkedInAuthorizeUrl();
    setLoading(false);
    if (res.success && res.data?.authorize_url) {
      window.location.href = res.data.authorize_url;
    }
  };

  const handleDisconnectLinkedIn = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const integrations = [
    { name: 'Twitter', logo: '/social media/x-logo.png', connected: isTwitterConnected },
    { name: 'Facebook', logo: '/social media/facebook-logo.png', connected: false },
    { name: 'Instagram', logo: '/social media/instagram-logo.png', connected: false },
    { name: 'LinkedIn', logo: '/social media/linkedin-logo.png', connected: isLinkedInConnected },
    { name: 'TikTok', logo: '/social media/tiktok-logo.png', connected: false },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600 mt-1">Connect your social media accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={integration.logo} alt={integration.name} className="h-8 w-8" />
                <CardTitle>{integration.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {integration.name === 'Twitter' ? (
                integration.connected ? (
                  <Button variant="destructive" className="w-full" onClick={handleDisconnectTwitter} disabled={loading}>
                    {loading ? 'Disconnecting...' : 'Disconnect'}
                  </Button>
                ) : (
                  <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleConnectTwitter} disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" />
                    {loading ? 'Redirecting...' : 'Connect'}
                  </Button>
                )
              ) : integration.name === 'LinkedIn' ? (
                integration.connected ? (
                  <Button variant="destructive" className="w-full" onClick={handleDisconnectLinkedIn} disabled={loading}>
                    {loading ? 'Disconnecting...' : 'Disconnect'}
                  </Button>
                ) : (
                  <Button className="w-full bg-blue-700 hover:bg-blue-800" onClick={handleConnectLinkedIn} disabled={loading}>
                    <Plus className="mr-2 h-4 w-4" />
                    {loading ? 'Redirecting...' : 'Connect'}
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
