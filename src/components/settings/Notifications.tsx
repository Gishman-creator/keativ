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
            <h3 className="text-lg font-semibold text-gray-900">Notifications from us</h3>
            <p className="text-gray-600 text-sm">Receive the latest news, updates and industry tutorials from us.</p>
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
                News and updates
                <p className="text-gray-500 text-sm font-normal">News about product and feature updates.</p>
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
                Tips and tutorials
                <p className="text-gray-500 text-sm font-normal">Tips on getting more out of Untitled.</p>
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
                User research
                <p className="text-gray-500 text-sm font-normal">Get involved in our beta testing program or participate in paid product user research.</p>
              </Label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8"></div>

        {/* Comments */}
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="w-full sm:w-1/2 pr-4 mb-5 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
            <p className="text-gray-600 text-sm">These are notifications for comments on your posts and replies to your comments.</p>
          </div>
          <div className="w-full sm:w-1/2 space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="comments-doNotNotify"
                className="mt-1"
                checked={notificationSettings.commentsOption === 'doNotNotify'}
                onCheckedChange={(checked: boolean) => onNotificationChange('commentsOption', checked ? 'doNotNotify' : 'allComments')}
              />
              <Label htmlFor="comments-doNotNotify" className="text-base font-medium text-gray-700">Do not notify me</Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="comments-mentionsOnly"
                className="mt-1"
                checked={notificationSettings.commentsOption === 'mentionsOnly'}
                onCheckedChange={(checked: boolean) => onNotificationChange('commentsOption', checked ? 'mentionsOnly' : 'allComments')}
              />
              <Label htmlFor="comments-mentionsOnly" className="text-base font-medium text-gray-700">
                Mentions only
                <p className="text-gray-500 text-sm font-normal">Only notify me if I'm mentioned in a comment.</p>
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
                All comments
                <p className="text-gray-500 text-sm font-normal">Notify me for all comments on my posts.</p>
              </Label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8"></div>

        {/* Reminders */}
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="w-full sm:w-1/2 pr-4 mb-5 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-900">Reminders</h3>
            <p className="text-gray-600 text-sm">These are notifications to remind you of updates you might have missed.</p>
          </div>
          <div className="w-full sm:w-1/2 space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="reminders-doNotNotify"
                className="mt-1"
                checked={notificationSettings.remindersOption === 'doNotNotify'}
                onCheckedChange={(checked: boolean) => onNotificationChange('remindersOption', checked ? 'doNotNotify' : 'allReminders')}
              />
              <Label htmlFor="reminders-doNotNotify" className="text-base font-medium text-gray-700">Do not notify me</Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="reminders-importantRemindersOnly"
                className="mt-1"
                checked={notificationSettings.remindersOption === 'importantRemindersOnly'}
                onCheckedChange={(checked: boolean) => onNotificationChange('remindersOption', checked ? 'importantRemindersOnly' : 'allReminders')}
              />
              <Label htmlFor="reminders-importantRemindersOnly" className="text-base font-medium text-gray-700">
                Important reminders only
                <p className="text-gray-500 text-sm font-normal">Only notify me if the reminder is tagged as important.</p>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="reminders-allReminders"
                className="mt-1"
                checked={notificationSettings.remindersOption === 'allReminders'}
                onCheckedChange={(checked: boolean) => onNotificationChange('remindersOption', checked ? 'allReminders' : 'doNotNotify')}
              />
              <Label htmlFor="reminders-allReminders" className="text-base font-medium text-gray-700">
                All reminders
                <p className="text-gray-500 text-sm font-normal">Notify me for all reminders.</p>
              </Label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8"></div>

        {/* More activity about you */}
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="w-full sm:w-1/2 pr-4 mb-5 sm:mb-0">
            <h3 className="text-lg font-semibold text-gray-900">More activity about you</h3>
            <p className="text-gray-600 text-sm">These are notifications for posts on your profile, likes and other reactions to your posts, and more.</p>
          </div>
          <div className="w-full sm:w-1/2 space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="activity-doNotNotify"
                className="mt-1"
                checked={notificationSettings.moreActivityOption === 'doNotNotify'}
                onCheckedChange={(checked: boolean) => onNotificationChange('moreActivityOption', checked ? 'doNotNotify' : 'allActivity')}
              />
              <Label htmlFor="activity-doNotNotify" className="text-base font-medium text-gray-700">Do not notify me</Label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="activity-allActivity"
                className="mt-1"
                checked={notificationSettings.moreActivityOption === 'allActivity'}
                onCheckedChange={(checked: boolean) => onNotificationChange('moreActivityOption', checked ? 'allActivity' : 'doNotNotify')}
              />
              <Label htmlFor="activity-allActivity" className="text-base font-medium text-gray-700">
                All reminders
                <p className="text-gray-500 text-sm font-normal">Notify me for all other activity.</p>
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
