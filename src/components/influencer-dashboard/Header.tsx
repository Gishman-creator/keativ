import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SocialSetShowcase from './SocialSetShowcase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Share2,
  Bell,
  Users,
  LogOut,
  Menu
} from 'lucide-react';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import MobileSidebar from './MobileSidebar';

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

        <div className="flex items-center space-x-2">
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Button variant="ghost" className="flex items-center px-1">
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src="https://picsum.photos/id/1005/200/200" alt="User 1" className="object-cover" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-white" style={{ marginLeft: '-1rem' }}>
                <AvatarImage src="https://picsum.photos/id/1011/200/200" alt="User 2" className="object-cover" />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8 border-2 border-white" style={{ marginLeft: '-1rem' }}>
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
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 justify-start rounded-full"
            onClick={() => navigate('/dashboard/notifications')}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                <Users className="mr-2 h-4 w-4" />
                Profile Settings
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
