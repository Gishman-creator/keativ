import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Facebook, 
  Settings, 
  BarChart, 
  Shield, 
  RefreshCw, 
  TestTube, 
  User, 
  CheckCircle, 
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface FacebookAccountDetails {
  id: string;
  username: string;
  display_name: string;
  profile_image_url: string;
  platform_user_id: string;
  is_verified: boolean;
  followers_count: number;
  signature: string;
  connected_at: string;
  facebook_info: {
    user_id: string;
    email: string;
    name: string;
  };
}

interface FacebookPage {
  id: string;
  name: string;
  category: string;
  has_manage_posts: boolean;
  has_page_token: boolean;
}

interface FacebookPermission {
  permission: string;
  status: string;
}

interface PostingAnalytics {
  total_posts: number;
  published_posts: number;
  failed_posts: number;
  scheduled_posts: number;
  success_rate: number;
}

interface RecentPost {
  id: string;
  content: string;
  status: string;
  created_at: string;
  scheduled_time?: string;
  published_at?: string;
}

export default function FacebookAccountManagement() {
  const [account, setAccount] = useState<FacebookAccountDetails | null>(null);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [permissions, setPermissions] = useState<FacebookPermission[]>([]);
  const [analytics, setAnalytics] = useState<PostingAnalytics | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [refreshingToken, setRefreshingToken] = useState(false);

  // Form states
  const [signature, setSignature] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    loadAccountDetails();
    loadAnalytics();
  }, []);

  const loadAccountDetails = async () => {
    try {
      const response = await api.getFacebookAccountDetails();
      if (response.success && response.data) {
        setAccount(response.data.account);
        setPages(response.data.pages || []);
        setPermissions(response.data.permissions || []);
        setSignature(response.data.account.signature || '');
        setDisplayName(response.data.account.display_name || '');
      } else {
        toast.error(response.message || 'Failed to load account details');
      }
    } catch (error) {
      console.error('Error loading Facebook account details:', error);
      toast.error('Failed to load account details');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await api.getFacebookPostingAnalytics();
      if (response.success && response.data) {
        setAnalytics(response.data.analytics);
        setRecentPosts(response.data.recent_posts || []);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const updateAccountSettings = async () => {
    setUpdating(true);
    try {
      const response = await api.updateFacebookAccount({
        signature,
        display_name: displayName
      });
      
      if (response.success) {
        toast.success('Account settings updated successfully');
        loadAccountDetails(); // Reload to get updated data
      } else {
        toast.error(response.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account settings');
    } finally {
      setUpdating(false);
    }
  };

  const refreshToken = async () => {
    setRefreshingToken(true);
    try {
      const response = await api.refreshFacebookToken();
      if (response.success) {
        toast.success('Token refreshed successfully');
        loadAccountDetails(); // Reload account details
      } else {
        toast.error(response.message || 'Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      toast.error('Failed to refresh token');
    } finally {
      setRefreshingToken(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      const response = await api.testFacebookConnection();
      if (response.success && response.data) {
        const status = response.data.connection_status;
        toast.success(`Connection test completed! Account: ${status.account_name}`);
      } else {
        toast.error(response.message || 'Connection test failed');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Failed to test connection');
    } finally {
      setTestingConnection(false);
    }
  };

  const getPermissionStatus = (permissionName: string) => {
    const permission = permissions.find(p => p.permission === permissionName);
    return permission?.status || 'not_found';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-500">Published</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!account) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Facebook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Facebook Account Connected</h3>
            <p className="text-gray-500 mb-4">Connect your Facebook account to manage it through Keativ.</p>
            <Button onClick={() => window.location.href = '/integrations'}>
              Connect Facebook Account
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facebook Account Management</h1>
          <p className="text-gray-500">Manage your Facebook account settings and monitor posting activity</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={testConnection} disabled={testingConnection}>
            {testingConnection ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <TestTube className="h-4 w-4 mr-2" />}
            Test Connection
          </Button>
          <Button variant="outline" onClick={refreshToken} disabled={refreshingToken}>
            {refreshingToken ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh Token
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                {account.profile_image_url && (
                  <img
                    src={account.profile_image_url}
                    alt={account.username}
                    className="h-16 w-16 rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{account.username}</h3>
                  <p className="text-gray-500">{account.facebook_info.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {account.is_verified ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="h-3 w-3 mr-1" />
                        Not Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Platform User ID</Label>
                  <p className="text-sm">{account.platform_user_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Connected</Label>
                  <p className="text-sm">{new Date(account.connected_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Display Name</Label>
                  <p className="text-sm">{account.display_name || 'Not set'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Signature</Label>
                  <p className="text-sm">{account.signature || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Quick Stats (Last 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analytics.total_posts}</div>
                    <div className="text-sm text-gray-500">Total Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analytics.published_posts}</div>
                    <div className="text-sm text-gray-500">Published</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{analytics.failed_posts}</div>
                    <div className="text-sm text-gray-500">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{analytics.success_rate}%</div>
                    <div className="text-sm text-gray-500">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Customize your Facebook account settings and posting preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  maxLength={200}
                />
                <p className="text-sm text-gray-500">This name will be displayed in your account information</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Post Signature</Label>
                <Textarea
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Optional signature to append to your posts"
                  maxLength={120}
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  This signature will be automatically added to the end of your posts ({120 - signature.length} characters remaining)
                </p>
              </div>

              <Button onClick={updateAccountSettings} disabled={updating}>
                {updating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Facebook Pages</CardTitle>
              <CardDescription>
                Manage your Facebook pages for posting content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pages.length > 0 ? (
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{page.name}</h4>
                        <p className="text-sm text-gray-500">{page.category}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {page.has_manage_posts ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Can Manage Posts
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              No Manage Permission
                            </Badge>
                          )}
                          {page.has_page_token ? (
                            <Badge variant="default">Has Page Token</Badge>
                          ) : (
                            <Badge variant="outline">No Page Token</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Facebook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pages Found</h3>
                  <p className="text-gray-500 mb-4">
                    You don't have any Facebook pages or they're not accessible with current permissions.
                  </p>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Facebook posting requires a Facebook Page. Personal timeline posting is heavily restricted.
                      Create a Facebook Page to enable posting through Keativ.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Facebook Permissions
              </CardTitle>
              <CardDescription>
                Review the permissions granted to Keativ for your Facebook account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['email', 'public_profile', 'pages_show_list', 'pages_read_engagement', 'pages_manage_posts'].map((requiredPerm) => {
                  const status = getPermissionStatus(requiredPerm);
                  return (
                    <div key={requiredPerm} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{requiredPerm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                        <p className="text-sm text-gray-500">
                          {requiredPerm === 'pages_manage_posts' && 'Required for posting to Facebook pages'}
                          {requiredPerm === 'pages_read_engagement' && 'Required for reading page engagement data'}
                          {requiredPerm === 'pages_show_list' && 'Required for listing your Facebook pages'}
                          {requiredPerm === 'public_profile' && 'Basic profile information'}
                          {requiredPerm === 'email' && 'Your email address'}
                        </p>
                      </div>
                      <div>
                        {status === 'granted' ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Granted
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            {status === 'not_found' ? 'Missing' : status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {permissions.some(p => p.status !== 'granted') && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Some required permissions are missing. You may need to reconnect your Facebook account 
                    to grant the necessary permissions for full functionality.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Posting Analytics (Last 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analytics.total_posts}</div>
                    <div className="text-sm text-gray-600">Total Posts</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analytics.published_posts}</div>
                    <div className="text-sm text-gray-600">Published</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{analytics.failed_posts}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{analytics.success_rate}%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>

                {recentPosts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Posts</h3>
                    <div className="space-y-3">
                      {recentPosts.map((post) => (
                        <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm mb-2">{post.content}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                              {post.scheduled_time && (
                                <span>Scheduled: {new Date(post.scheduled_time).toLocaleDateString()}</span>
                              )}
                              {post.published_at && (
                                <span>Published: {new Date(post.published_at).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            {getStatusBadge(post.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
