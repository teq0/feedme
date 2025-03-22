import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/config';
import { UserService } from './user.service';
import { AuthTokens, CreateUserDto, JwtPayload, LoginUserDto, UserRole } from '../types/user.types';
import { ApiError } from '../middleware/error-handler';
import { logger } from '../utils/logger';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Register a new user
   */
  async register(userData: CreateUserDto): Promise<AuthTokens> {
    try {
      const user = await this.userService.create(userData);
      return this.generateTokens(user.id, user.email, user.role);
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login a user with email and password
   */
  async login(loginData: LoginUserDto): Promise<AuthTokens> {
    const user = await this.userService.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload;
      
      // Get user
      const user = await this.userService.findById(decoded.sub);
      if (!user) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      // Generate new tokens
      return this.generateTokens(user.id, user.email, user.role);
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new ApiError(401, 'Invalid refresh token');
    }
  }

  /**
   * Generate JWT tokens
   */
  generateTokens(userId: string, email: string, role: string | UserRole): AuthTokens {
    // Create JWT payload
    const payload: JwtPayload = {
      sub: userId,
      email,
      role: role as UserRole,
    };

    // Generate access token
    const accessToken = jwt.sign(
      payload,
      config.jwt.secret as jwt.Secret,
      {
        expiresIn: config.jwt.expiresIn,
      } as SignOptions
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      payload,
      config.jwt.refreshSecret as jwt.Secret,
      {
        expiresIn: config.jwt.refreshExpiresIn,
      } as SignOptions
    );

    // Get expiration time in seconds
    const decodedToken = jwt.decode(accessToken) as { exp: number };
    const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }
}