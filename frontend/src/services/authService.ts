import axios from 'axios';
import { AuthTokens, LoginUserDto, RegisterUserDto } from '../types/user';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Auth service class
export class AuthService {
  private apiClient;

  constructor() {
    this.apiClient = axios.create({
      baseURL: `${API_URL}/auth`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Register a new user
   */
  async register(name: string, email: string, password: string): Promise<AuthTokens> {
    const userData: RegisterUserDto = { name, email, password };
    const response = await this.apiClient.post<{ data: AuthTokens }>('/register', userData);
    return response.data.data;
  }

  /**
   * Login a user
   */
  async login(email: string, password: string): Promise<AuthTokens> {
    const loginData: LoginUserDto = { email, password };
    const response = await this.apiClient.post<{ data: AuthTokens }>('/login', loginData);
    return response.data.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await this.apiClient.post<{ data: AuthTokens }>('/refresh-token', { refreshToken });
    return response.data.data;
  }

  /**
   * Logout a user
   */
  async logout(): Promise<void> {
    await this.apiClient.post('/logout');
  }
}

// Create API client with auth headers
export const createAuthenticatedClient = (token: string) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};