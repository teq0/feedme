import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/user.types';
import { ApiError } from './error-handler';

// Role-based authorization middleware
export const authorize = (role: UserRole | UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized'));
    }

    const userRole = req.user.role;
    const requiredRoles = Array.isArray(role) ? role : [role];

    if (!requiredRoles.includes(userRole)) {
      return next(new ApiError(403, 'Forbidden: Insufficient permissions'));
    }

    return next();
  };
};

// Resource ownership check middleware
export const isResourceOwner = (
  resourceIdParam: string,
  resourceService: { findById: (id: string) => Promise<{ userId: string }> }
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized'));
    }

    const resourceId = req.params[resourceIdParam];
    if (!resourceId) {
      return next(new ApiError(400, `Resource ID parameter '${resourceIdParam}' is missing`));
    }

    try {
      const resource = await resourceService.findById(resourceId);
      
      if (!resource) {
        return next(new ApiError(404, 'Resource not found'));
      }

      // Allow if user is admin or resource owner
      if (req.user.role === UserRole.ADMIN || resource.userId === req.user.id) {
        return next();
      }

      return next(new ApiError(403, 'Forbidden: You do not own this resource'));
    } catch (error) {
      return next(error);
    }
  };
};