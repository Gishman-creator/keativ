// Alternative AppInitializer.tsx - Using window.location instead of useNavigate
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Share2 } from 'lucide-react';
import { authApi } from './lib/api';
import { loginSuccess, logout } from './redux/slices/authSlice';

interface AppInitializerProps {
  onComplete?: () => void;
}

const AppInitializer = ({ onComplete }: AppInitializerProps) => {
  const dispatch = useDispatch();
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    const bootstrapApp = async () => {
      try {
        const response = await authApi.getCurrentUser();
        if (response.success && response.data) {
          dispatch(loginSuccess({
            id: response.data.id.toString(),
            name: `${response.data.first_name} ${response.data.last_name}`,
            email: response.data.email,
            avatar: response.data.avatar || '',
            businessName: response.data.profile?.company_name || '',
            isLoggedIn: true,
          }));
          console.log("User authenticated:", response.data);
        } else {
          localStorage.removeItem('auth_token');
          dispatch(logout());
        }
      } catch (error) {
        console.error("Error during bootstrap authentication:", error);
        localStorage.removeItem('auth_token');
        dispatch(logout());
      } finally {
        setIsLoadingAuth(false);
        onComplete?.();
      }
    };

    if (token) {
      bootstrapApp();
    } else {
      setIsLoadingAuth(false);
      onComplete?.();
    }
  }, [dispatch, token, onComplete]);

  // Show loading screen while checking auth status
  if (isLoadingAuth) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Share2 className="h-12 w-12 text-primary mb-4" />
        </div>
      </div>
    );
  }

  // Return null when initialization is complete
  return null;
};

export default AppInitializer;