import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Profile from '@/components/settings/Profile';
import Notifications from '@/components/settings/Notifications';
import Billing from '@/components/settings/Billing';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import { RootState } from '../../redux/store';
import { Button } from '@/components/ui/button';


// Assume these are the branding colors and fonts
const brandColors = {
  primary: '#EF4444', // Red
  secondary: '#8B5CF6', // Purple
  accent: '#F3F4F6', // Light Gray
  text: '#2D3748', // Dark Gray
  background: '#FFFFFF', // White
};

const brandFonts = {
  body: 'Poppins, sans-serif',
  headers: 'Roboto Slab, serif',
};

const tabOptions = [
  { key: 'profile', label: 'Profile' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'billing', label: 'Billing' },
];

const sidebarTabMap = {
  account: 'profile',
  notification: 'notifications',
  billing: 'billing',
};

const Settings = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // State for form data
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    businessName: user?.businessName || '',
    role: user?.role || '',
    bio: '',
    website: '',
    location: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newsAndUpdates: true,
    tipsAndTutorials: true,
    userResearch: false,
    commentsOption: 'allComments' as 'doNotNotify' | 'mentionsOnly' | 'allComments',
    remindersOption: 'allReminders' as 'doNotNotify' | 'importantRemindersOnly' | 'allReminders',
    moreActivityOption: 'doNotNotify' as 'doNotNotify' | 'allActivity',
  });

  // Hardcoded billing data for now, could be fetched from an API
  const billingData = {
    currentPlan: 'Professional Plan',
    price: '$149.99',
    period: 'year',
    nextBilling: '25 Dec 2023',
    features: [
      'Get Enterprise Plan',
      'Access All Feature',
      'Get 2TB Cloud Storage',
    ],
    billingHistory: [
      { id: 'FLZ9810', date: '25 Dec 2023', amount: '$149.99', plan: 'Professional Plan', status: 'Success' },
      { id: 'FLZ9810', date: '05 Jul 2023', amount: '$149.99', plan: 'Professional Plan', status: 'Success' },
    ],
  };

  // Handlers for form changes
  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field: string, value: boolean | string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const [activeSidebarKey, setActiveSidebarKey] = useState<keyof typeof sidebarTabMap>('account');
  const activeTab = sidebarTabMap[activeSidebarKey] || 'profile';

  return (
    <>
      {/* Header for the page */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: brandFonts.headers, color: brandColors.text }}>Settings</h1>
          <p className="text-gray-600 text-sm">Customize until match to your workflows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-red-500 text-white">Save</Button>
        </div>
      </div>
      <div className="flex min-h-screen" style={{ fontFamily: brandFonts.body, color: brandColors.text }}>
        <div className="sticky top-16 h-full">
          <SettingsSidebar activeKey={activeSidebarKey} onSelect={(key) => setActiveSidebarKey(key as keyof typeof sidebarTabMap)} />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto px-6 py-8">
            {/* Tab Content */}
            <div className="mt-2">
              {activeTab === 'profile' && (
                <Profile profileData={profileData} onProfileChange={handleProfileChange} userAvatar={user?.avatar} userInitials={user?.name?.split(' ').map(n => n[0]).join('')} />
              )}
              {activeTab === 'notifications' && (
                <Notifications notificationSettings={notificationSettings} onNotificationChange={handleNotificationChange} />
              )}
              {activeTab === 'billing' && (
                <Billing billingData={billingData} />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Settings;
