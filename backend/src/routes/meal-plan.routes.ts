import { Router } from 'express';
// import { MealPlanController } from '../controllers/meal-plan.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
// const mealPlanController = new MealPlanController();

// Get user's meal plans
router.get('/', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'This endpoint will return the user\'s meal plans',
    data: [],
  });
});

// Get meal plan by ID
router.get('/:id', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will return meal plan with ID: ${req.params.id}`,
    data: null,
  });
});

// Create meal plan
router.post('/', authenticate(), (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'This endpoint will create a new meal plan',
    data: null,
  });
});

// Update meal plan
router.put('/:id', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will update meal plan with ID: ${req.params.id}`,
    data: null,
  });
});

// Delete meal plan
router.delete('/:id', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will delete meal plan with ID: ${req.params.id}`,
    data: null,
  });
});

// Add recipe to meal plan
router.post('/:id/recipes', authenticate(), (req, res) => {
  res.status(201).json({
    status: 'success',
    message: `This endpoint will add a recipe to meal plan with ID: ${req.params.id}`,
    data: null,
  });
});

// Remove recipe from meal plan
router.delete('/:id/recipes/:recipeId', authenticate(), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `This endpoint will remove recipe with ID: ${req.params.recipeId} from meal plan with ID: ${req.params.id}`,
    data: null,
  });
});

export default router;