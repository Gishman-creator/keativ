import { X, AlertTriangle, BadgeInfo, BadgeCheck, BadgeX, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Type definitions
type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastObject {
  id: string;
  visible: boolean;
}

interface CustomToastProps {
  t: ToastObject;
  title: string;
  description: string;
  type?: ToastType;
}

interface SmallToastProps {
  t: ToastObject;
  description: string;
  type?: ToastType;
}

const CustomToast: React.FC<CustomToastProps> = ({ t, title, description, type = 'default' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <BadgeCheck className="w-5 h-5 text-green-500" />;
      case 'error': return <BadgeX className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <BadgeInfo className="w-5 h-5 text-blue-500" />;
      case 'loading': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return null;
    }
  };  

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'error': return 'bg-red-50';
      case 'warning': return 'bg-amber-50';
      case 'info': return 'bg-blue-50';
      case 'loading': return 'bg-blue-50';
      default: return 'bg-white';
    }
  };

  return (
    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full ${getBackgroundColor()} shadow-lg rounded-lg pointer-events-auto`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="w-0 flex-1">
            <div className="flex items-center mb-2">
              {getIcon() && <div className="mr-2">{getIcon()}</div>}
              <p className="text-sm font-semibold text-gray-900">{title}</p>
            </div>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => toast.dismiss(t.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmallToast: React.FC<SmallToastProps> = ({ t, description, type = 'default' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <BadgeCheck className="w-4 h-4 text-green-500" />;
      case 'error': return <BadgeX className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <BadgeInfo className="w-4 h-4 text-blue-500" />;
      case 'loading': return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-md rounded-lg pointer-events-auto`}>
      <div className="p-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2 flex-1">
            {getIcon() && getIcon()}
            <p className="text-sm text-gray-700">{description}</p>
          </div>
          <button
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0"
            onClick={() => toast.dismiss(t.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Usage function with proper typing
const showCustomToast = (title: string, description: string, type: ToastType = 'default') => {
  toast.custom((t) => (
    <CustomToast t={t} title={title} description={description} type={type} />
  ), {
    duration: 5000,
    position: window.innerWidth >= 640 ? 'bottom-right' : 'top-right',
  });
};

// Usage function with proper typing
const showSmallToast = (description: string, type: ToastType = 'default', duration: number = 5000) => {
  toast.custom((t) => (
    <SmallToast t={t} description={description} type={type} />
  ), {
    duration: duration,
    position: window.innerWidth >= 640 ? 'bottom-right' : 'top-right',
  });
};

export { CustomToast, SmallToast, showCustomToast, showSmallToast, type ToastType };