import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authApi, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<{ success: boolean; data?: { message: string; user_id: number; username: string; email: string } }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem('auth_user');
      return cached ? (JSON.parse(cached) as User) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('auth_user', JSON.stringify(response.data));
          } else {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setUser(null);
        }
      } else {
        localStorage.removeItem('auth_user');
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ username, password });
      if (response.success && response.data) {
        setUser(response.data.user);
        localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_user');
      setUser(null);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }): Promise<{ success: boolean; data?: { message: string; user_id: number; username: string; email: string } }> => {
    try {
      console.log('Sending registration data:', userData);
      const response = await authApi.register(userData);
      console.log('Registration response:', response);
      
      if (response.success && response.data) {
        return { 
          success: true, 
          data: { 
            message: (response.data as { message?: string }).message || 'Registration successful', 
            user_id: (response.data as { user_id?: number }).user_id || 0, 
            username: (response.data as { username?: string }).username || userData.username,
            email: userData.email
          } 
        };
      }
      console.error('Registration failed - no success or data:', response);
      return { success: false };
    } catch (error) {
      console.error('Registration failed with error:', error);
      return { success: false };
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!(user || localStorage.getItem('auth_token')),
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
