import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User
  // , Mail, Lock, Shield, LogOut, Trash2
   } from 'lucide-react';
// import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface ProfileProps {
  profileData: {
    fullName: string;
    email: string;
    businessName: string;
    role: string;
    bio: string;
    website: string;
    location: string;
  };
  onProfileChange: (field: string, value: string | boolean) => void;
  userAvatar?: string;
  userInitials?: string;
}

const Profile: React.FC<ProfileProps> = ({ profileData, onProfileChange, userAvatar, userInitials }) => {
  return (
    <div className="space-y-8">
      {/* My Profile Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
        <p className="text-gray-600">Update your photo and personal details here.</p>
        <div className="flex items-center gap-4 mb-6 mt-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userAvatar} alt="User Avatar" className="object-cover" />
            <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button style={{ backgroundColor: '#8B5CF6' }} className="text-white text-sm px-4 py-2 flex items-center gap-1 w-full sm:w-auto">
              <User size={16} /> Change Image
            </Button>
            <Button variant="outline" className="text-gray-700 text-sm px-4 py-2 w-full sm:w-auto">Remove Image</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
            <Input
              id="firstName"
              value={profileData.fullName.split(' ')[0] || ''}
              onChange={(e) => onProfileChange('fullName', `${e.target.value} ${profileData.fullName.split(' ')[1] || ''}`)}
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
            <Input
              id="lastName"
              value={profileData.fullName.split(' ')[1] || ''}
              onChange={(e) => onProfileChange('fullName', `${profileData.fullName.split(' ')[0] || ''} ${e.target.value}`)}
              className="mt-1 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Account Security Section */}
      <div className="pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Security</h2>
        <p className="text-gray-600">Manage your account security settings.</p>
        <div className="space-y-4 mt-6">
          <div className="flex  flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => onProfileChange('email', e.target.value)}
                className="mt-1 text-sm w-64"
                readOnly
              />
            </div>
            <Button variant="outline" className="text-sm px-4 py-2 mt-2 sm:mt-0">Change email</Button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value="********"
                className="mt-1 text-sm w-64"
                readOnly
              />
            </div>
            <Button variant="outline" className="text-sm px-4 py-2 mt-2 sm:mt-0">Change password</Button>
          </div>
          <div className="flex items-start justify-between pt-4">
            <div className='w-3/4'>
              <h3 className="text-base font-medium text-gray-900">2-Step Verifications</h3>
              <p className="text-gray-500 text-sm">Add an additional layer of security to your account during login.</p>
            </div>
            <Switch
              checked={true} // Assuming it's always on for now based on image
              onCheckedChange={(checked) => onProfileChange('twoStepVerification', checked)}
            />
          </div>
        </div>
      </div>

      {/* Log out of all devices Section */}
      <div className="pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Log out of all devices</h2>
        <p className="text-gray-600">Log out of all other active sessions on other devices besides this one.</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6">
          <p className="text-gray-500 max-w-2xl text-sm mb-2 sm:mb-0">Protect your account by logging out from all active sessions on other devices, ensuring your data remains secure.</p>
          <Button variant="outline" className="text-sm px-4 py-2 w-1/2 sm:w-auto mt-2 md:mt-0">Log out</Button>
        </div>
      </div>

      {/* Delete my account Section */}
      <div className="pt-8">
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
