import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { ApiError } from './error-handler';

/**
 * Middleware to validate request using express-validator
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error: any) => ({
      field: error.param,
      message: error.msg,
    }));
    
    return next(new ApiError(400, 'Validation Error', true, errorMessages));
  }
  
  return next();
};