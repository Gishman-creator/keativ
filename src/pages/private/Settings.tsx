import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Profile from '@/components/influencer-dashboard/settings/Profile';
import Notifications from '@/components/influencer-dashboard/settings/Notifications';
import Billing from '@/components/influencer-dashboard/settings/Billing';
import Integrations from '@/components/influencer-dashboard/settings/Integrations'; // Import the new Integrations component
import SettingsSidebar from '@/components/influencer-dashboard/settings/SettingsSidebar';
import SettingsTopNav from '@/components/influencer-dashboard/settings/SettingsTopNav';
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

const sidebarTabMap = {
  account: 'profile',
  notification: 'notifications',
  billing: 'billing',
  integrations: 'integrations', // Add new mapping for integrations
};

const Settings = () => {

  const [notificationSettings, setNotificationSettings] = useState({
    newsAndUpdates: true,
    tipsAndTutorials: true,
    userResearch: false,
    commentsOption: 'allComments' as 'doNotNotify' | 'mentionsOnly' | 'allComments',
    remindersOption: 'allReminders' as 'doNotNotify' | 'importantRemindersOnly' | 'allReminders',
    moreActivityOption: 'doNotNotify' as 'doNotNotify' | 'allActivity',
  });

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
      <div className="px-4 md:px-6 py-4 md:border-b md:border-gray-200 w-full sm:w-auto">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: brandFonts.headers, color: brandColors.text }}>Settings</h1>
          <p className="text-gray-600 text-sm">Customize until match to your workflows</p>
        </div>
      </div>
      <SettingsTopNav activeKey={activeSidebarKey} onSelect={(key) => setActiveSidebarKey(key as keyof typeof sidebarTabMap)} />
      <div className="flex min-h-[calc(100vh-14rem)]">
        <div className="sticky top-0 h-full hidden md:block">
          <SettingsSidebar activeKey={activeSidebarKey} onSelect={(key) => setActiveSidebarKey(key as keyof typeof sidebarTabMap)} />
        </div>
        <main className="flex-1 overflow-y-auto border-l border-gray-200">
          <div className="mx-auto px-6 py-8">
            {/* Tab Content */}
            <div className="mt-2">
              {activeTab === 'profile' && (
                <Profile />
              )}
              {activeTab === 'notifications' && (
                <Notifications notificationSettings={notificationSettings} onNotificationChange={handleNotificationChange} />
              )}
              {activeTab === 'billing' && (
                <Billing />
              )}
              {activeTab === 'integrations' && (
                <Integrations />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Settings;
