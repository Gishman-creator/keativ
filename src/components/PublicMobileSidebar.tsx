import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2, X } from 'lucide-react';
import { SheetClose } from '@/components/ui/sheet';
import { useSelector } from 'react-redux'; // Import useSelector
import { RootState } from '@/redux/store'; // Import RootState

const PublicMobileSidebar = () => {
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
    <div className="flex flex-col h-full py-6 px-4">
      <div className="flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center space-x-2">
          <Share2 className="h-8 w-8 text-red-500" />
          <span className="font-heading text-xl font-bold text-gray-900">
            Keativ
          </span>
        </Link>
        <SheetClose asChild>
          <Button variant="ghost" size="icon">
            <X className="h-6 w-6" />
          </Button>
        </SheetClose>
      </div>

      <nav className="flex flex-col space-y-4 flex-grow">
        {navItems.map((item) => (
          <SheetClose asChild key={item.name}>
            <Link
              to={item.href}
              className={`block px-3 py-2 text-base font-medium transition-colors ${
                location.pathname === item.href
                  ? 'text-red-500'
                  : 'text-gray-700 hover:text-red-500'
              }`}
            >
              {item.name}
            </Link>
          </SheetClose>
        ))}
      </nav>

      <div className="flex flex-col space-y-4 mt-auto">
        {!isLoggedIn ? ( // Conditionally render based on isLoggedIn
          <>
            <SheetClose asChild>
              <Link to="/login">
                <Button variant="ghost" className="w-full text-gray-700 hover:text-red-500">
                  Login
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to="/signup">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                  Start Free Trial
                </Button>
              </Link>
            </SheetClose>
          </>
        ) : (
          <SheetClose asChild>
            <Link to="/dashboard"> {/* Assuming dashboard route */}
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                Go to Dashboard
              </Button>
            </Link>
          </SheetClose>
        )}
      </div>
    </div>
  );
};

export default PublicMobileSidebar;
