import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';
import { authenticate } from '../middleware/auth.middleware';
import { optionalAuthenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate-request';
import { body } from 'express-validator';

const router = Router();
const recipeController = new RecipeController();

// Validation middleware for creating/updating recipes
const validateRecipe = [
  body('name').notEmpty().withMessage('Recipe name is required'),
  body('preparationSteps').notEmpty().withMessage('Preparation steps are required'),
  body('cookingTime').isInt({ min: 1 }).withMessage('Cooking time must be a positive number'),
  body('cuisineType').notEmpty().withMessage('Cuisine type is required'),
  body('suitableMealTypes').isArray({ min: 1 }).withMessage('At least one suitable meal type is required'),
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('ingredients.*.name').notEmpty().withMessage('Ingredient name is required'),
  body('ingredients.*.quantity').isNumeric().withMessage('Ingredient quantity must be a number'),
  body('ingredients.*.unit').notEmpty().withMessage('Ingredient unit is required'),
];

// Get all recipes (public and own)
router.get('/', optionalAuthenticate(), recipeController.getAllRecipes);

// Get recipe by ID
router.get('/:id', optionalAuthenticate(), recipeController.getRecipeById);

// Create recipe (authenticated)
router.post('/', authenticate(), validateRecipe, validateRequest, recipeController.createRecipe);

// Update recipe (authenticated, owner only)
router.put('/:id', authenticate(), validateRecipe, validateRequest, recipeController.updateRecipe);

// Delete recipe (authenticated, owner only)
router.delete('/:id', authenticate(), recipeController.deleteRecipe);

export default router;