import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col px-4 sm:px-6 lg:px-8">
      <div className='flex items-center justify-start gap-2 py-4'>
        <Share2 className="h-6 w-6 text-red-500" />
        <span className="font-heading text-lg font-bold text-gray-900">
          Keativ
        </span>
      </div>
      <div className="min-h-full mx-auto my-auto max-w-md w-full text-center">
        <div className="mb-8">
          <img src="/404.png" className="h-40 w-40 text-red-500 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-sm mb-8">
            Sorry, we couldn't find the page you're looking for.
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;