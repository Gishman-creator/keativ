import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { authApi, UserProfileData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { loginSuccess } from '@/redux/slices/authSlice';
import type { User as AppUser } from '@/types';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Smartphone,
  Mail,
  Building,
  Calendar,
  Activity,
  Settings,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
};

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const SettingsPage = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors },
    reset: resetProfileForm,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
  companyName: user?.businessName || '',
    }
  });

  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors },
    watch,
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>();

  const newPassword = watch('newPassword');

  React.useEffect(() => {
    if (user) {
      resetProfileForm({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
  companyName: user.businessName || '',
      });
    }
  }, [user, resetProfileForm]);

  // Ensure company name is populated by fetching current user if missing in Redux state
  React.useEffect(() => {
    const ensureCompanyName = async () => {
      if (!user) return;
      const hasCompany = !!(user.businessName && user.businessName.trim().length > 0);
      if (hasCompany) return;
      const resp = await authApi.getCurrentUser();
      if (resp.success && resp.data) {
        const root = (resp.data as unknown as { company_name?: string }).company_name;
        const nested = (resp.data as unknown as { profile?: { company_name?: string } }).profile?.company_name;
        const businessName = root || nested || '';
        if (businessName) {
          const updated: AppUser = { ...user, businessName } as AppUser;
          dispatch(loginSuccess(updated));
          resetProfileForm((prev) => ({ ...prev, companyName: businessName }));
        }
      }
    };
    ensureCompanyName();
  }, [user, dispatch, resetProfileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    const profileData: UserProfileData = {
      company_name: data.companyName,
    };
    const response = await authApi.updateProfile(profileData);
    if (response.success && response.data) {
      // Support both shapes: profile-only response ({ company_name }) or user-with-profile ({ profile: { company_name } })
      let newCompanyName = user?.businessName || '';
      const root = (response.data as unknown as { company_name?: string }).company_name;
      const nested = (response.data as unknown as { profile?: { company_name?: string } }).profile?.company_name;
      if (root) newCompanyName = root;
      else if (nested) newCompanyName = nested;
      const updatedUser: AppUser = {
        ...user!,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        businessName: newCompanyName,
      };
      dispatch(loginSuccess(updatedUser));
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: response.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log('Password data:', data);
    toast({
        title: "Password Change",
        description: "Password change functionality is not yet implemented.",
        variant: "default",
    });
    resetPasswordForm();
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account, preferences, and integrations.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover" />
                  <AvatarFallback className="text-lg">
                    {user?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    {user?.businessName && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Building className="h-4 w-4" /> {user.businessName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingAvatar(true);
                      const res = await authApi.uploadAvatar(file);
                      setUploadingAvatar(false);
                      const avatarUrl = (res && 'data' in res && (res as { data?: { avatar?: string }}).data?.avatar) || undefined;
                      if (avatarUrl) {
                        const updated: AppUser = { ...(user as AppUser), avatar: avatarUrl };
                        dispatch(loginSuccess(updated));
                        toast({ title: 'Avatar updated', description: 'Your profile photo was updated.' });
                      } else {
                        const errMsg = (res && 'error' in (res as { error?: string }) && (res as { error?: string }).error) || 'Please try again.';
                        toast({ title: 'Upload failed', description: errMsg, variant: 'destructive' });
                      }
                    }}
                  />
                  <Button variant="outline" size="sm" disabled={uploadingAvatar} onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingAvatar ? 'Uploading…' : 'Upload Photo'}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>

              <Separator />

              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...registerProfile('firstName')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...registerProfile('lastName')} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input id="email" type="email" {...registerProfile('email', { required: 'Email is required.' })} />
                  {profileErrors.email && <p className="text-red-500 text-sm">{profileErrors.email.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company Name
                  </Label>
                  <Input id="companyName" {...registerProfile('companyName')} />
                </div>
                
                <Button type="submit">Save Profile Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          {/* Account Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-semibold">January 2024</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Posts Created</p>
                      <p className="font-semibold">127</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Connected Accounts</p>
                      <p className="font-semibold">3</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Account Status</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verified</span>
                  <Badge variant="default" className="bg-green-100 text-green-700">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Two-Factor Authentication</span>
                  <Badge variant="secondary">Not Setup</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account Type</span>
                  <Badge variant="default">Premium</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="currentPassword" 
                      type={showPassword ? "text" : "password"} 
                      {...registerPassword('currentPassword', { required: 'Current password is required.' })} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordErrors.currentPassword && <p className="text-red-500 text-sm">{passwordErrors.currentPassword.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" {...registerPassword('newPassword', { required: 'New password is required.', minLength: { value: 8, message: 'Password must be at least 8 characters.'} })} />
                  {passwordErrors.newPassword && <p className="text-red-500 text-sm">{passwordErrors.newPassword.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" {...registerPassword('confirmPassword', { 
                      required: 'Please confirm your new password.',
                      validate: value => value === newPassword || "Passwords do not match."
                  })} />
                  {passwordErrors.confirmPassword && <p className="text-red-500 text-sm">{passwordErrors.confirmPassword.message}</p>}
                </div>
                
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Post Performance</p>
                      <p className="text-sm text-gray-600">Get notified when your posts perform well</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Scheduled Posts</p>
                      <p className="text-sm text-gray-600">Reminders about upcoming scheduled posts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Account Activity</p>
                      <p className="text-sm text-gray-600">Important updates about your account</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Messages</p>
                      <p className="text-sm text-gray-600">Get notified of new direct messages</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mentions & Comments</p>
                      <p className="text-sm text-gray-600">When someone mentions or comments on your posts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Button variant="outline">Setup 2FA</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-sm text-gray-600">Manage your active login sessions</p>
                    </div>
                  </div>
                  <Button variant="outline">View Sessions</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Download Data</p>
                      <p className="text-sm text-gray-600">Download a copy of your account data</p>
                    </div>
                  </div>
                  <Button variant="outline">Request Download</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Danger Zone</h4>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-800">Delete Account</p>
                      <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Premium Plan</h3>
                    <p className="opacity-90">Active until March 15, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$29/mo</p>
                    <p className="opacity-90">Billed monthly</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Plan Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-700">✓</Badge>
                    <span className="text-sm">Unlimited Posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-700">✓</Badge>
                    <span className="text-sm">Advanced Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-700">✓</Badge>
                    <span className="text-sm">Team Collaboration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-700">✓</Badge>
                    <span className="text-sm">Priority Support</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Payment Method</h4>
                <div className="p-4 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/27</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline">Billing History</Button>
                <Button variant="ghost" className="text-red-600">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
