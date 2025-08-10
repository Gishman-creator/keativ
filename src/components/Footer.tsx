import { Link } from 'react-router-dom';
import { Share2, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              {['Features', 'Pricing', 'Security', 'Integrations'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-gray-600 hover:text-gray-900">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {['About', 'Blog', 'Careers', 'Press'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-gray-600 hover:text-gray-900">
                    {item}
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
              {['Help Center', 'Contact', 'API Docs', 'Status', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Privacy Policy' ? '/privacy' : '#'} 
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-center text-sm text-gray-500">
              © 2025 Keativ. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/privacy" 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;