import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2, Home, ArrowLeft, RotateCw } from 'lucide-react';

const NetworkError = ({ noIcon = false }) => {

  return (
    <div className={`bg-transparent flex items-center justify-center px-4 sm:px-6 lg:px-8 ${noIcon ? "" : "min-h-[calc(100vh-4rem)]"}`}>
      <div className="max-w-md w-full text-center">
        <div className={`mb-8 ${noIcon ? "mt-16" : ""}`}>
          <img src="/networkError_3.png" className={`h-40 w-40 mx-auto mb-4 ${noIcon ? "hidden" : ""}`} />
          <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
            No Internet Connection
          </h2>
          <p className="text-gray-600 text-sm mb-8">
            It looks like you're not connected to the internet.
            Please check your network connection and refresh the page.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-auto"
            onClick={() => window.location.reload()}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;