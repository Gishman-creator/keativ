import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SocialSetShowcase from './SocialSetShowcase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Share2,
  Bell,
  LogOut,
  Settings,
  CreditCard,
  Search,
  Calendar,
  Activity,
  User,
  House,
  Plus
} from 'lucide-react';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import MobileSidebar from './MobileSidebar';
import { Input } from '@/components/ui/input';
import { api, SocialAccount } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/constants';

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSocialSetShowcase, setShowSocialSetShowcase] = useState(false);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);

  // Dynamic state
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [activeAccounts, setActiveAccounts] = useState<SocialAccount[]>([]);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (user?.isLoggedIn) {
      loadHeaderData();
    }
  }, [user]);

  const loadHeaderData = async () => {
    try {
      setStatsLoading(true);
      // Fetch notifications
      const notifRes = await api.get<{ unread_count?: number, results?: { is_read: boolean }[] }>(API_ENDPOINTS.NOTIFICATIONS.LIST);
      if (notifRes.success && notifRes.data) {
        setUnreadNotifications(notifRes.data.unread_count || notifRes.data.results?.filter(n => !n.is_read)?.length || 0);
      }

      // Fetch social accounts
      const accountsRes = await api.get<SocialAccount[]>(API_ENDPOINTS.SOCIAL_ACCOUNTS);
      if (accountsRes.success && accountsRes.data) {
        setActiveAccounts(accountsRes.data.filter(a => a.is_active));
      }

      // Fetch scheduled posts count
      const postsRes = await api.get<{ count?: number, results?: unknown[] }>(API_ENDPOINTS.POSTS.SCHEDULED_LIST);
      if (postsRes.success && postsRes.data) {
        setScheduledCount(postsRes.data.count || postsRes.data.results?.length || 0);
      }
    } catch (e) {
      console.error("Error loading header stats", e);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleMouseEnter = () => {
    if (hideTimer) {
      clearTimeout(hideTimer);
      setHideTimer(null);
    }
    setShowSocialSetShowcase(true);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setShowSocialSetShowcase(false);
    }, 200);
    setHideTimer(timer);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="md:hidden">
            <MobileSidebar isCollapsed={false} onToggle={() => { }} />
          </div>
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Share2 className="h-6 w-6 text-red-500" />
            <span className="font-heading text-lg font-bold text-gray-900">
              Keativ
            </span>
          </Link>
        </div>

        {/* Enhanced center section with search and quick stats */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            <Input
              placeholder="Search posts, analytics, campaigns..."
              className="pl-10 w-64 md:w-80 h-9 text-sm bg-gray-50 border-transparent hover:border-gray-200 focus:bg-white transition-all rounded-full"
            />
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors cursor-default">
              <Activity className={`h-4 w-4 ${statsLoading ? 'animate-pulse' : 'text-green-500'}`} />
              <span className="font-medium">{activeAccounts.length > 0 ? activeAccounts.length : (statsLoading ? '...' : 0)} Active</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors cursor-default" title="Scheduled Posts">
              <Calendar className={`h-4 w-4 ${statsLoading ? 'animate-pulse' : 'text-blue-500'}`} />
              <span className="font-medium">{statsLoading ? '...' : scheduledCount} Scheduled</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Social Set Preview (Dynamic) */}
          <div
            className="relative hidden md:block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Button variant="ghost" className="flex items-center justify-center -space-x-3 hover:bg-transparent" onClick={() => navigate('/dashboard/integrations')}>
              {activeAccounts.length > 0 ? (
                activeAccounts.slice(0, 3).map((acc, i) => (
                  <Avatar key={acc.id} className="h-8 w-8 border-2 border-white transform transition-transform hover:-translate-y-1 hover:z-10 bg-gray-100" style={{ zIndex: 3 - i }}>
                    <AvatarImage src={acc.profile_image_url || `https://ui-avatars.com/api/?name=${acc.platform}&background=random`} alt={acc.platform} className="object-cover" />
                    <AvatarFallback>{acc.platform.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                ))
              ) : (
                <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" title="Connect Social Accounts">
                  <div className="h-8 w-8 rounded-full border-2 border-dashed border-gray-400 bg-gray-50 flex items-center justify-center text-gray-500">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              )}
            </Button>
            {showSocialSetShowcase && (
              <div
                className="absolute top-full mt-2 z-30 right-0"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <SocialSetShowcase />
              </div>
            )}
          </div>
          
          {/* Notifications with badge */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 justify-start rounded-full relative"
              onClick={() => navigate('/dashboard/notifications')}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              {unreadNotifications > 0 && (
                <Badge className="absolute 0 top-0 right-0 h-4 min-w-[16px] px-1 text-[10px] flex items-center justify-center bg-red-500 rounded-full border border-white">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </Badge>
              )}
            </Button>
          </div>

          {/* Enhanced User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} className="object-cover" />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                  {user?.businessName && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.businessName}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing & Plans
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate('/')}>
                <House className="mr-2 h-4 w-4" />
                Go to Homepage
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
