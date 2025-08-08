import React from 'react';
import { cn } from '@/lib/utils';
import { AppWindow, Bell, CreditCard, Globe } from 'lucide-react';

const sidebarItems = [
  { key: 'account', label: 'Account', icon: AppWindow },
  { key: 'notification', label: 'Notification', icon: Bell },
  { key: 'integrations', label: 'Integrations', icon: Globe },
  { key: 'billing', label: 'Billing', icon: CreditCard },
];

interface SettingsSidebarProps {
  activeKey: string;
  onSelect: (key: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeKey, onSelect }) => {
  const brandColors = {
    primary: '#EF4444', // Red
  };

  return (
    <aside className="w-64 border-r border-gray-200 min-h-screen py-8 px-4 flex-col gap-8 hidden md:flex">
      <nav className="flex flex-col gap-1">
        {sidebarItems.map(item => (
          <li key={item.key} className="list-none">
            <button
              className={cn(
                'w-full text-left px-3 py-2 rounded-md transition-colors font-medium flex items-center gap-2',
                activeKey === item.key
                  ? 'text-red-500'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
              onClick={() => onSelect(item.key)}
            >
              {item.icon && <item.icon size={16} />}
              {item.label}
            </button>
          </li>
        ))}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;
