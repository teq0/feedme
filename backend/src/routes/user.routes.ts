import { Router } from 'express';
// import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types/user.types';

const router = Router();
// const userController = new UserController();

// Get current user
router.get('/me', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    data: req.user,
  });
});

// Get all users (admin only)
router.get('/', authenticate(), authorize(UserRole.ADMIN), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return all users',
    data: [],
  });
});

// Get user by ID (admin only)
router.get('/:id', authenticate(), authorize(UserRole.ADMIN), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will return user with ID: ${req.params.id}`,
    data: null,
  });
});

// Update user
router.put('/:id', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will update user with ID: ${req.params.id}`,
    data: null,
  });
});

// Delete user (admin only)
router.delete('/:id', authenticate(), authorize(UserRole.ADMIN), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will delete user with ID: ${req.params.id}`,
    data: null,
  });
});

export default router;