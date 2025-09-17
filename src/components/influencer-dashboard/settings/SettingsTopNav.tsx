import React from 'react';
import { cn } from '@/lib/utils';
import { AppWindow, Bell, CreditCard, Globe } from 'lucide-react';

const sidebarItems = [
  { key: 'account', label: 'Account', icon: AppWindow },
  { key: 'notification', label: 'Notification', icon: Bell },
  { key: 'integrations', label: 'Integrations', icon: Globe },
  { key: 'billing', label: 'Billing', icon: CreditCard },
];

interface SettingsTopNavProps {
  activeKey: string;
  onSelect: (key: string) => void;
}

const SettingsTopNav: React.FC<SettingsTopNavProps> = ({ activeKey, onSelect }) => {
  return (
    <nav className="flex bg-gray-50 sticky z-20 top-0 overflow-x-auto whitespace-nowrap border-b border-gray-200 md:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {sidebarItems.map(item => (
        <button
          key={item.key}
          className={cn(
            'flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors relative',
            activeKey === item.key
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-600 hover:text-gray-900'
          )}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default SettingsTopNav;
