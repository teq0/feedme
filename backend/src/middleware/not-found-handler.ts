import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error-handler';

// Not found handler middleware
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Resource not found - ${req.originalUrl}`));
};