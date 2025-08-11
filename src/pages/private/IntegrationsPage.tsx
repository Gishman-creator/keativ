import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { api, ApiResponse, TwitterAccount } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface VerifyResp { success: boolean; message: string; account?: TwitterAccount }

const IntegrationsPage = () => {
  const navigate = useNavigate();
  const [isTwitterConnected, setIsTwitterConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check connection status
    const check = async () => {
      const res: ApiResponse<VerifyResp> = await api.verifyTwitterCredentials();
      setIsTwitterConnected(Boolean(res.success && res.data && res.data.account));
    };
    check();
  }, []);

  const handleConnectTwitter = async () => {
    setLoading(true);
    const res = await api.getTwitterAuthorizeUrl();
    setLoading(false);
    if (res.success && res.data?.authorize_url) {
      window.location.href = res.data.authorize_url;
    }
  };

  const handleDisconnectTwitter = () => {
    // Optional: implement disconnect endpoint later
    navigate('/dashboard/integrations');
  };

  const integrations = [
    { name: 'Twitter', logo: '/social media/x-logo.png', connected: isTwitterConnected },
    { name: 'Facebook', logo: '/social media/facebook-logo.png', connected: false },
    { name: 'Instagram', logo: '/social media/instagram-logo.png', connected: false },
    { name: 'LinkedIn', logo: '/social media/linkedin-logo.png', connected: false },
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
                  <Button variant="destructive" className="w-full" onClick={handleDisconnectTwitter}>Disconnect</Button>
                ) : (
                  <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={handleConnectTwitter} disabled={loading}>
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
