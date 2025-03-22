import { Router } from 'express';
// import { IngredientController } from '../controllers/ingredient.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types/user.types';

const router = Router();
// const ingredientController = new IngredientController();

// Get all ingredients
router.get('/', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return all ingredients',
    data: [],
  });
});

// Get ingredient by ID
router.get('/:id', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will return ingredient with ID: ${req.params.id}`,
    data: null,
  });
});

// Create ingredient (admin only)
router.post('/', authenticate(), authorize(UserRole.ADMIN), (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'This endpoint will create a new ingredient',
    data: null,
  });
});

// Update ingredient (admin only)
router.put('/:id', authenticate(), authorize(UserRole.ADMIN), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will update ingredient with ID: ${req.params.id}`,
    data: null,
  });
});

// Delete ingredient (admin only)
router.delete('/:id', authenticate(), authorize(UserRole.ADMIN), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will delete ingredient with ID: ${req.params.id}`,
    data: null,
  });
});

export default router;