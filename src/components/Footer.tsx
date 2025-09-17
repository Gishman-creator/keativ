import { Link } from 'react-router-dom';
import { Share2, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    links: [
      { label: 'Home', to: '/' },
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'About', to: '/about' }
    ],
    support: [
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' }
    ]
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Share2 className="h-6 w-6 text-red-500" />
              <span className="font-heading text-lg font-bold text-gray-900">
                Keativ
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Manage all your social media from one beautiful, minimalist dashboard.
            </p>
            <div className="flex space-x-4">
              <Twitter className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Links
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className='w-full'>
            <h3 className="font-heading text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Newsletter
            </h3>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                Subscribe to our newsletter for updates and tips.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md rounded-r-none"
                />
                <Button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-l-none rounded-r-md">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-center items-center">
            <p className="text-center text-sm text-gray-500">
              © {currentYear} Keativ. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;