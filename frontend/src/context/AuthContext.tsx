import { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { UserRole } from '../types/user';

// Define the shape of the auth state
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  } | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Define the shape of the auth context
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuthTokens: (accessToken: string, refreshToken: string) => void;
}

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key for auth data
const AUTH_STORAGE_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || 'feedme_auth';

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  });
  
  const navigate = useNavigate();
  const authService = new AuthService();

  // Initialize auth state from local storage
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth.accessToken && parsedAuth.refreshToken) {
          // Decode the token to get user info
          const decodedToken = jwtDecode<{
            sub: string;
            email: string;
            name?: string;
            role: UserRole;
            exp: number;
          }>(parsedAuth.accessToken);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setAuthState({
              accessToken: parsedAuth.accessToken,
              refreshToken: parsedAuth.refreshToken,
              user: {
                id: decodedToken.sub,
                email: decodedToken.email,
                name: decodedToken.name || decodedToken.email.split('@')[0],
                role: decodedToken.role,
              },
              isAuthenticated: true,
              isAdmin: decodedToken.role === UserRole.ADMIN,
            });
          } else {
            // Token is expired, try to refresh
            refreshToken(parsedAuth.refreshToken);
          }
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (authState.refreshToken) {
      const interval = setInterval(() => {
        refreshToken(authState.refreshToken!);
      }, parseInt(import.meta.env.VITE_AUTH_REFRESH_INTERVAL || '300000')); // Default: 5 minutes
      
      return () => clearInterval(interval);
    }
  }, [authState.refreshToken]);

  // Refresh token function
  const refreshToken = async (token: string) => {
    try {
      const response = await authService.refreshToken(token);
      setAuthTokens(response.accessToken, response.refreshToken);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setAuthTokens(response.accessToken, response.refreshToken);
    navigate('/');
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register(name, email, password);
    setAuthTokens(response.accessToken, response.refreshToken);
    navigate('/');
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
    navigate('/auth/login');
  };

  // Set auth tokens function
  const setAuthTokens = (accessToken: string, refreshToken: string) => {
    try {
      // Decode the token to get user info
      const decodedToken = jwtDecode<{
        sub: string;
        email: string;
        name?: string;
        role: UserRole;
      }>(accessToken);
      
      const newAuthState = {
        accessToken,
        refreshToken,
        user: {
          id: decodedToken.sub,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email.split('@')[0],
          role: decodedToken.role,
        },
        isAuthenticated: true,
        isAdmin: decodedToken.role === UserRole.ADMIN,
      };
      
      // Save to state and local storage
      setAuthState(newAuthState);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        accessToken,
        refreshToken,
      }));
    } catch (error) {
      console.error('Failed to decode token:', error);
      logout();
    }
  };

  // Provide the auth context
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        setAuthTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};