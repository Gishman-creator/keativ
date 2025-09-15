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
  Plug,
  Workflow,
  Plus,
  CreditCard,
  Building2,
  Globe,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
  className?: string;
  onToggle: () => void; // Add onToggle prop
}

type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: number };

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed: propIsCollapsed, className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(!propIsCollapsed);
  const [isHovered, setIsHovered] = useState(false); // Re-introduce isHovered state
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Determine the effective collapsed state
  const isCollapsed = !isExpanded;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isExpanded) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Planner', href: '/dashboard/planner', icon: Calendar },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
    { name: 'Media Library', href: '/dashboard/media', icon: Image },
    { name: 'Social Sets', href: '/dashboard/social-sets', icon: Layers },
    { name: 'Integrations', href: '/dashboard/integrations', icon: Globe },
    { name: 'Automations', href: '/dashboard/automations', icon: Workflow },
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
          onClick={() => {
            setIsExpanded(false); // Collapse sidebar on tab click if expanded
          }}
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
      </div>
    );
  };

  return (
    <div
      ref={sidebarRef}
      className={cn(
        `bg-gray-50 ${isCollapsed ? 'w-20' : 'w-64'} h-[calc(100vh-4rem)] fixed left-0 top-16 border-r border-gray-200 transition-all duration-300 z-40 flex flex-col group`,
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)} // Toggle sidebar expansion on click
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: isHovered ? 'ew-resize' : 'default' }}
    >
      <div className="flex-1 flex flex-col p-4 gap-2">
        <nav className="w-full flex-1 space-y-2 overflow-y-auto pr-1">
          {navItems.map((item) => (
            <div key={item.name} onClick={(e) => e.stopPropagation()}> {/* Removed e.stopPropagation() */}
              {renderLink(item)}
            </div>
          ))}
        </nav>
        <div className="w-full shrink-0 pt-2 border-gray-200" onClick={(e) => e.stopPropagation()}> {/* Collapse sidebar on settings click if expanded */}
          {renderLink(settingsItem)}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
