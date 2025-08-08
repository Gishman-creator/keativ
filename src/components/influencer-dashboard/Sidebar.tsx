import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  MessageCircle,
  Image,
  Users,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, className }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle, badge: 2 },
    { name: 'Media Library', href: '/dashboard/media', icon: Image },
    { name: 'Influencers', href: '/dashboard/influencers', icon: Users },
    { name: 'Social Sets', href: '/dashboard/social-sets', icon: Layers },
  ];

  const settingsItem = { name: 'Settings', href: '/dashboard/settings', icon: Settings };

  const renderLink = (item: typeof navItems[0]) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href;
    return (
      <Link
        key={item.name}
        to={item.href}
        className={cn(
          'flex items-center w-full text-sm font-medium transition-colors mx-auto',
          isCollapsed
            ? 'justify-center w-9 h-9 p-2 rounded-full'
            : 'h-10 w-full px-3 space-x-3 rounded-lg',
          isActive
            ? isCollapsed
              ? 'bg-red-500 text-white w-11 h-11 p-3 rounded-full'
              : 'bg-red-100 text-red-600'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        )}
        title={isCollapsed ? item.name : undefined}
      >
        <Icon className={cn('h-6 w-6 transition-all', isActive && isCollapsed ? 'h-7 w-7' : '')} />
        {!isCollapsed && <span className="flex-1">{item.name}</span>}
        {!isCollapsed && item.badge && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className={cn(`bg-gray-50 ${isCollapsed ? 'w-20' : 'w-64'} h-[calc(100vh-4rem)] fixed left-0 top-16 border-r border-gray-200 transition-all duration-300 z-40 flex flex-col`, className)}>
      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="w-6 h-6 p-0 rounded-full border shadow-md"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      <div className="flex-grow flex flex-col p-4 space-y-2 items-center">
        <nav className="w-full flex-grow space-y-2">
          {navItems.map((item) => renderLink(item))}
        </nav>
        <div className="w-full">
          {renderLink(settingsItem)}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
