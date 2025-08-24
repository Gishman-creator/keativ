import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Plug,
  Workflow,
  Plus,
  CreditCard,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: number };

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, className }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Planner', href: '/dashboard/planner', icon: Calendar },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle
      // , badge: 2
     },
    { name: 'Media Library', href: '/dashboard/media', icon: Image },
    { name: 'Influencers', href: '/dashboard/influencers', icon: Users },
    { name: 'Social Sets', href: '/dashboard/social-sets', icon: Layers },
    { name: 'Automations', href: '/dashboard/automations', icon: Workflow },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'CRM', href: '/dashboard/crm', icon: Building2 },
  ];

  const settingsItem: NavItem = { name: 'Settings', href: '/dashboard/settings', icon: Settings };

  const isItemActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const renderLink = (item: NavItem) => {
    const Icon = item.icon;
    const active = isItemActive(item.href);
  const isPlanner = item.href === '/dashboard/planner';
    return (
      <div key={item.name} className={cn('flex items-center', isCollapsed ? 'justify-center' : '')}>
        <Link
          to={item.href}
          className={cn(
            'flex items-center w-full text-sm font-medium transition-colors mx-auto',
            isCollapsed
              ? 'justify-center w-9 h-9 p-2 rounded-full'
              : 'h-10 w-full px-3 space-x-3 rounded-lg',
            active
              ? isCollapsed
                ? 'bg-red-500 text-white w-11 h-11 p-3 rounded-full'
                : 'bg-red-100 text-red-600'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}
          title={isCollapsed ? item.name : undefined}
          aria-current={active ? 'page' : undefined}
        >
          <Icon className={cn('h-6 w-6 transition-all', active && isCollapsed ? 'h-7 w-7' : '')} />
          {!isCollapsed && <span className="flex-1">{item.name}</span>}
          {!isCollapsed && item.badge !== undefined && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {item.badge}
            </span>
          )}
        </Link>
    {!isCollapsed && isPlanner && (
          <button
      onClick={() => navigate('/dashboard/posts/new')}
            className="ml-2 inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
            aria-label="Create post"
            title="Create post"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={cn(`bg-gray-50 ${isCollapsed ? 'w-20' : 'w-64'} h-[calc(100vh-4rem)] fixed left-0 top-16 border-r border-gray-200 transition-all duration-300 z-40 flex flex-col `, className)}>
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

      <div className="flex-1 flex flex-col p-4 gap-2">
        <nav className="w-full flex-1 space-y-2 overflow-y-auto pr-1">
          {navItems.map((item) => renderLink(item))}
        </nav>
        <div className="w-full shrink-0 pt-2 border-t border-gray-200">
          {renderLink(settingsItem)}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
