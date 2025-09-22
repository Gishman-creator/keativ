import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Share2, Menu } from 'lucide-react';
import PublicMobileSidebar from '@/components/PublicMobileSidebar';
import { useSelector } from 'react-redux'; // Import useSelector
import { RootState } from '@/redux/store'; // Import RootState

const PublicNavBar= () => {
  const location = useLocation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.user?.isLoggedIn); // Get isLoggedIn from authSlice

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white/80 border-b border-gray-200 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Share2 className="h-8 w-8 text-red-500" />
              <span className="font-heading text-xl font-bold text-gray-900">
                Keativ
              </span>
            </Link>
          </div>
          
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-red-500 border-b-2 border-red-500'
                      : 'text-gray-700 hover:text-red-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {!isLoggedIn ? ( // Conditionally render based on isLoggedIn
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-red-500">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard"> {/* Assuming dashboard route */}
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0">
              <PublicMobileSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavBar;
