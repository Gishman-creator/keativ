import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Bell,
  Shield,
  Settings as SettingsIcon,
  UserCheck,
  CreditCard,
  Save,
  Upload,
  Trash2,
  Key,
  Check,
  X
} from 'lucide-react';
import { RootState } from '../../redux/store';

const Settings = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeSection, setActiveSection] = useState('account');

  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    businessName: user?.businessName || '',
    role: user?.role || '',
    bio: '',
    website: '',
    location: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    mentionAlerts: true,
    postReminders: true,
    collaboratorUpdates: false
  });

  const [preferences, setPreferences] = useState({
    timeFormat: '12',
    timezone: 'America/New_York',
    language: 'en',
    theme: 'light',
    defaultView: 'calendar'
  });

  const [billingData] = useState({
    currentPlan: 'Professional Plan',
    price: '$149.99',
    period: 'year',
    nextBilling: '25 Dec 2023',
    features: [
      'Get Enterprise Plan',
      'Access All Feature',
      'Get 2TB Cloud Storage'
    ],
    billingHistory: [
      { id: 'FLZ9810', date: '25 Dec 2023', amount: '$149.99', plan: 'Professional Plan', status: 'Success' },
      { id: 'FLZ9810', date: '05 Jul 2023', amount: '$149.99', plan: 'Professional Plan', status: 'Success' }
    ]
  });

  const sidebarItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'billing', label: 'Billings', icon: CreditCard }
  ];

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center">
        <div className="bg-white px-6 py-4 border-b border-gray-200 w-full">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Customize until match to your workflows</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-teal-600 hover:bg-teal-700">Save</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === item.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeSection === 'account' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Account</h2>
                <p className="text-gray-600">Get notified what's happening right now, you can turn off at any time</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">My Profile</h3>

                <div className="flex items-center space-x-6 mb-8">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-lg">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex space-x-3">
                    <Button className="bg-teal-600 hover:bg-teal-700">Upload new</Button>
                    <Button variant="outline" className="text-red-600 hover:text-red-700">Delete</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                    <Input
                      id="firstName"
                      value="Alexandro"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                    <Input
                      id="lastName"
                      value="Bernard"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                    <Input
                      id="phone"
                      value="+123 4232 1312"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                      id="email"
                      value="Alexandro.bern@gmail.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">Birth Date</Label>
                    <Input
                      id="birthDate"
                      value="20-12-2019"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value="••••••••"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Delete account</h4>
                  <p className="text-gray-600 mb-4">
                    When you delete your account, you lose access to Front account services, and we permanently delete your personal data. You can cancel the deletion for 14 days.
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="destructive">Delete Account</Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Billings</h2>
                <p className="text-gray-600">Pick a billing plan that suits you</p>
              </div>

              {/* Billing Plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Basic Plan */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Plan</h3>
                  <p className="text-gray-600 text-sm mb-4">Suitable plan for starter business</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">$99.99</span>
                    <span className="text-gray-600 ml-1">/year</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
                      Customer Segmentations
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
                      Google Integrations
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
                      Activity Reminder
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Choose Plan</Button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Plan</h3>
                  <p className="text-gray-600 text-sm mb-4">Best plan for mid-sized businesses</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">$119.99</span>
                    <span className="text-gray-600 ml-1">/year</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
                      Get a Basic Plans
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
                      Access All Feature
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
                      Get 1TB Cloud Storage
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Choose Plan</Button>
                </div>

                {/* Professional Plan - Active */}
                <div className="bg-teal-600 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Professional Plan</h3>
                  <p className="text-teal-100 text-sm mb-4">Suitable plan for starter</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">$149.99</span>
                    <span className="text-teal-100 ml-1">/year</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-sm text-teal-100">
                      <Check className="w-4 h-4 mr-3" />
                      Get Enterprise Plan
                    </li>
                    <li className="flex items-center text-sm text-teal-100">
                      <Check className="w-4 h-4 mr-3" />
                      Access All Feature
                    </li>
                    <li className="flex items-center text-sm text-teal-100">
                      <Check className="w-4 h-4 mr-3" />
                      Get 2TB Cloud Storage
                    </li>
                  </ul>
                  <Button className="w-full bg-white text-teal-600 hover:bg-gray-100">Active plan</Button>
                </div>
              </div>

              {/* Billing History */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">No.</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Invoice</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Created Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Plan</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingData.billingHistory.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-4 px-4">0{index + 1}</td>
                          <td className="py-4 px-4 font-medium">Invoice#{item.id}</td>
                          <td className="py-4 px-4">{item.date}</td>
                          <td className="py-4 px-4">{item.amount}</td>
                          <td className="py-4 px-4">{item.plan}</td>
                          <td className="py-4 px-4">
                            <Badge className="bg-green-100 text-green-800">{item.status}</Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 w-8 h-8 p-0">
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;