import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import recipeRoutes from './recipe.routes';
import ingredientRoutes from './ingredient.routes';
import inventoryRoutes from './inventory.routes';
import mealPlanRoutes from './meal-plan.routes';
import recommendationRoutes from './recommendation.routes';
import adminRoutes from './admin.routes';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types/user.types';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/users', authenticate(), userRoutes);
router.use('/recipes', recipeRoutes); // Allow public access to recipes
router.use('/ingredients', authenticate(), ingredientRoutes);
router.use('/inventory', authenticate(), inventoryRoutes);
router.use('/meal-plans', authenticate(), mealPlanRoutes);
router.use('/recommendations', authenticate(), recommendationRoutes);

// Admin routes
router.use('/admin', authenticate(), authorize(UserRole.ADMIN), adminRoutes);

export const apiRoutes = router;