import { useState } from 'react';
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
  Share2,
  X,
} from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface MobileSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
          'h-10 w-full px-3 space-x-3 rounded-lg', // Always expanded in mobile sidebar
          isActive
            ? 'text-red-600'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        )}
        onClick={() => setIsOpen(false)} // Close sidebar on link click
      >
        <Icon className={cn('h-6 w-6 transition-all')} />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
          <div className="flex items-center justify-between h-16 border-b border-gray-200 px-5">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Share2 className="h-6 w-6 text-red-500" />
              <span className="font-heading text-lg font-bold text-gray-900">
                Keativ
              </span>
            </Link>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-6 w-6" />
              </Button>
            </SheetClose>
          </div>
          <div className="flex-grow flex flex-col p-4 space-y-2">
            <nav className="w-full flex-grow space-y-2">
              {navItems.map((item) => renderLink(item))}
            </nav>
            <div className="w-full">
              {renderLink(settingsItem)}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
