import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Lock, Upload, Trash2, Eye, EyeOff, Building, Calendar, CheckCircle, XCircle, Link, FileText, Smartphone, Activity, Download } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { authApi, UserProfileData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { loginSuccess } from '@/redux/slices/authSlice';
import type { User as AppUser } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
};

const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  businessName: "Acme Corporation",
  avatar: "/professional-headshot.png",
  dateJoined: "2023-03-15",
  postsCount: 127,
  connectedAccounts: 3,
  emailVerified: true,
}

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Profile: React.FC = () => {
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
    <div className="space-y-8">
      {/* My Profile Section */}
      <div className='mb-4'>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
        <p className="text-gray-600">Update your photo and personal details here.</p>
        <div className="flex items-center gap-4 mb-6 mt-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover" />
            <AvatarFallback className="text-xl">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-x-2 flex items-center">
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
                const avatarUrl = (res && 'data' in res && (res as { data?: { avatar?: string } }).data?.avatar) || undefined;
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
            <Button style={{ backgroundColor: '#8B5CF6' }} className="text-white text-sm px-4 py-2 flex items-center gap-1 w-full sm:w-auto" disabled={uploadingAvatar} onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} /> {uploadingAvatar ? 'Uploading…' : 'Change Image'}
            </Button>
            <Button variant="outline" className="text-gray-700 text-sm px-4 py-2 w-full sm:w-auto">Remove Image</Button>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
              <Input
                id="firstName"
                {...registerProfile('firstName')}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
              <Input
                id="lastName"
                {...registerProfile('lastName')}
                className="mt-1 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input id="email" type="email" {...registerProfile('email', { required: 'Email is required.' })} />
              {profileErrors.email && <p className="text-red-500 text-sm">{profileErrors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company Name
              </Label>
              <Input id="companyName" {...registerProfile('companyName')} />
            </div>
          </div>
          <Button type="submit" className="mt-4">Save Profile Changes</Button>
        </form>
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Overview</h2>
        <p className="text-gray-600">Your account statistics and verification status.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Date Joined</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(mockUser.dateJoined).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Total Posts</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{mockUser.postsCount}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Link className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Connected Accounts</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{mockUser.connectedAccounts}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Email Status</span>
            </div>
            <div className="flex items-center gap-2">
              {mockUser.emailVerified ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Verified
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    Unverified
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Account Security Section */}
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Security</h2>
        <p className="text-gray-600">Manage your account security settings.</p>
        <div className="space-y-4 mt-6">
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
              <Input id="newPassword" type="password" {...registerPassword('newPassword', { required: 'New password is required.', minLength: { value: 8, message: 'Password must be at least 8 characters.' } })} />
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
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="flex items-center justify-between pt-8 pb-2 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            <p className="font-medium">Two-Factor Authentication</p>
          </div>
          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
        </div>
        <Button variant="outline">Setup 2FA</Button>
      </div>

      {/* Active Sessions Section */}
      <div className="flex items-center justify-between py-2 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <p className="font-medium">Active Sessions</p>
          </div>
          <p className="text-sm text-gray-600">Manage your active login sessions</p>
        </div>
        <Button variant="outline">View Sessions</Button>
      </div>

      {/* Download account data Section */}
      <div className="flex items-center justify-between pt-2 pb-4 rounded-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <p className="font-medium">Download account data</p>
          </div>
          <p className="text-sm text-gray-600">Download a copy of your account data</p>
        </div>
        <Button variant="outline">Request Download</Button>
      </div>

      <Separator />

      {/* Delete my account Section */}
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Delete my account</h2>
        <p className="text-gray-600">Permanently delete your account and all associated data.</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6">
          <p className="text-gray-500 max-w-2xl text-sm mb-2 sm:mb-0">This action is irreversible. All your data, including posts, messages, and settings, will be permanently removed from our platform.</p>
          <Button variant="destructive" className="text-sm px-4 py-2 w-1/2 sm:w-auto mt-2 md:mt-0">Delete Account</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
