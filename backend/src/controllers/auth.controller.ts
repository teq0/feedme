import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, LoginUserDto } from '../types/user.types';
import { ApiError } from '../middleware/error-handler';
import { config } from '../config/config';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const tokens = await this.authService.register(userData);

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login a user
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData: LoginUserDto = req.body;
      const tokens = await this.authService.login(loginData);

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh access token
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout a user
   */
  logout = async (req: Request, res: Response) => {
    // JWT is stateless, so we don't need to do anything server-side
    // Client should remove the token from storage
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  };

  /**
   * Handle social login callback
   */
  socialLoginCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication failed');
      }

      // Generate tokens for the authenticated user
      const user = req.user;
      const tokens = await this.authService.generateTokens(user.id, user.email, user.role);

      // Redirect to frontend with tokens
      const frontendUrl = config.cors.origin;
      const redirectUrl = `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
      
      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  };
}