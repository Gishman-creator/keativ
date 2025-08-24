import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface NotificationsProps {
  notificationSettings: {
    newsAndUpdates: boolean;
    tipsAndTutorials: boolean;
    userResearch: boolean;
    commentsOption: 'doNotNotify' | 'mentionsOnly' | 'allComments';
    remindersOption: 'doNotNotify' | 'importantRemindersOnly' | 'allReminders';
    moreActivityOption: 'doNotNotify' | 'allActivity';
  };
  onNotificationChange: (field: string, value: boolean | string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notificationSettings, onNotificationChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
        <p className="text-gray-600">Get notified what's happening right now, you can turn off at any time</p>
      </div>

      <div className="space-y-8">
        {/* Notifications from us */}
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="w-full sm:w-1/2 pr-4 mb-5 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
            <p className="text-gray-600 text-sm">Automated email notifications will be sent to your inbox to keep you informed.</p>
          </div>
          <div className="w-full sm:w-1/2 space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="newsAndUpdates"
                className="mt-1"
                checked={notificationSettings.newsAndUpdates}
                onCheckedChange={(checked: boolean) => onNotificationChange('newsAndUpdates', checked)}
              />
              <Label htmlFor="newsAndUpdates" className="text-base font-medium text-gray-700">
                Post Performance
                <p className="text-gray-500 text-sm font-normal">Get notified when your posts perform well.</p>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="tipsAndTutorials"
                className="mt-1"
                checked={notificationSettings.tipsAndTutorials}
                onCheckedChange={(checked: boolean) => onNotificationChange('tipsAndTutorials', checked)}
              />
              <Label htmlFor="tipsAndTutorials" className="text-base font-medium text-gray-700">
                Scheduled Posts
                <p className="text-gray-500 text-sm font-normal">Reminders about upcoming scheduled posts.</p>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="userResearch"
                className="mt-1"
                checked={notificationSettings.userResearch}
                onCheckedChange={(checked: boolean) => onNotificationChange('userResearch', checked)}
              />
              <Label htmlFor="userResearch" className="text-base font-medium text-gray-700">
                Account Activity
                <p className="text-gray-500 text-sm font-normal">Important updates about your account.</p>
              </Label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8"></div>

        {/* Comments */}
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="w-full sm:w-1/2 pr-4 mb-5 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
            <p className="text-gray-600 text-sm">Enhance your mobile experience with real-time push notifications.</p>
          </div>
          <div className="w-full sm:w-1/2 space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="comments-mentionsOnly"
                className="mt-1"
                checked={notificationSettings.commentsOption === 'mentionsOnly'}
                onCheckedChange={(checked: boolean) => onNotificationChange('commentsOption', checked ? 'mentionsOnly' : 'allComments')}
              />
              <Label htmlFor="comments-mentionsOnly" className="text-base font-medium text-gray-700">
                New Messages
                <p className="text-gray-500 text-sm font-normal">Get notified of new direct messages.</p>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="comments-allComments"
                className="mt-1"
                checked={notificationSettings.commentsOption === 'allComments'}
                onCheckedChange={(checked: boolean) => onNotificationChange('commentsOption', checked ? 'allComments' : 'doNotNotify')}
              />
              <Label htmlFor="comments-allComments" className="text-base font-medium text-gray-700">
                Mentions & Comments
                <p className="text-gray-500 text-sm font-normal">When someone mentions or comments on your posts.</p>
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
