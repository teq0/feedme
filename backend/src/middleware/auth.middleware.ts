import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ApiError } from './error-handler';
import { IUser } from '../types/user.types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

// Authentication middleware
export const authenticate = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: Error, user: IUser, info: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(new ApiError(401, info?.message || 'Unauthorized'));
      }

      req.user = user;
      return next();
    })(req, res, next);
  };
};

// Optional authentication middleware (doesn't require auth but attaches user if present)
export const optionalAuthenticate = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: Error, user: IUser, info: any) => {
      if (err) {
        return next(err);
      }

      if (user) {
        req.user = user;
      }

      return next();
    })(req, res, next);
  };
};