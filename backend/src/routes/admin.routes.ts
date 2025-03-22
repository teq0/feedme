import { Router } from 'express';
// import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types/user.types';

const router = Router();
// const adminController = new AdminController();

// Admin dashboard stats
router.get('/stats', authenticate(), authorize(UserRole.ADMIN), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return admin dashboard stats',
    data: {
      totalUsers: 0,
      totalRecipes: 0,
      totalIngredients: 0,
      totalMealPlans: 0,
    },
  });
});

// Get system logs
router.get('/logs', authenticate(), authorize(UserRole.ADMIN), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return system logs',
    data: [],
  });
});

// Get system health
router.get('/health', authenticate(), authorize(UserRole.ADMIN), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return system health',
    data: {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    },
  });
});

export default router;