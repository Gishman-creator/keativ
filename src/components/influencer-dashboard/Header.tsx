import { useState } from 'react';
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
  HelpCircle,
  Search,
  Calendar,
  Activity,
  User
} from 'lucide-react';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import MobileSidebar from './MobileSidebar';
import { Input } from '@/components/ui/input';

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSocialSetShowcase, setShowSocialSetShowcase] = useState(false);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);

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
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-50">
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search posts, analytics..."
              className="pl-10 w-64 h-9 text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <Activity className="h-4 w-4" />
              <span className="font-medium">12 Active</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">5 Scheduled</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Social Set Preview */}
          <div
            className="relative hidden md:block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Button variant="ghost" className="flex items-center px-2">
              <Avatar className="h-7 w-7 border-2 border-white">
                <AvatarImage src="https://picsum.photos/id/1005/200/200" alt="User 1" className="object-cover" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar className="h-7 w-7 border-2 border-white" style={{ marginLeft: '-0.75rem' }}>
                <AvatarImage src="https://picsum.photos/id/1011/200/200" alt="User 2" className="object-cover" />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <Avatar className="h-7 w-7 border-2 border-white" style={{ marginLeft: '-0.75rem' }}>
                <AvatarImage src="https://picsum.photos/id/1012/200/200" alt="User 3" className="object-cover" />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
            </Button>
            {showSocialSetShowcase && (
              <div
                className="absolute top-full mt-2 z-50 right-0"
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
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-red-500">
                3
              </Badge>
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
              
              <DropdownMenuItem onClick={() => window.open('/help', '_blank')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
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
