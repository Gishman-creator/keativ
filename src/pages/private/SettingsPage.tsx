import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { authApi, UserProfileData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { loginSuccess } from '@/redux/slices/authSlice';
import type { User as AppUser } from '@/types';

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

  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors },
    reset: resetProfileForm,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: user?.name.split(' ')[0] || '',
      lastName: user?.name.split(' ').slice(1).join(' ') || '',
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
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        companyName: user.businessName || '',
      });
    }
  }, [user, resetProfileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    const profileData: UserProfileData = {
        company_name: data.companyName,
    };
    
    const response = await authApi.updateProfile(profileData);

    if (response.success && response.data) {
      const updatedUser: AppUser = {
        ...user!,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        businessName: response.data.profile?.company_name ?? user?.businessName ?? '',
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
    // Implement password change API call
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
        <p className="text-gray-600 mt-1">Manage your account and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...registerProfile('email', { required: 'Email is required.' })} />
              {profileErrors.email && <p className="text-red-500 text-sm">{profileErrors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" {...registerProfile('companyName')} />
            </div>
            <Button type="submit">Save Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" {...registerPassword('currentPassword', { required: 'Current password is required.' })} />
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
    </div>
  );
};

export default SettingsPage;
