import { Request, Response, NextFunction } from 'express';
import { RecipeService, CreateRecipeDto, UpdateRecipeDto } from '../services/recipe.service';
import { ApiError } from '../middleware/error-handler';
import { logger } from '../utils/logger';

export class RecipeController {
  private recipeService: RecipeService;

  constructor() {
    this.recipeService = new RecipeService();
  }

  /**
   * Get all recipes
   */
  getAllRecipes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const recipes = await this.recipeService.findAll(userId);

      res.status(200).json({
        status: 'success',
        message: 'Recipes retrieved successfully',
        data: recipes,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get recipe by ID
   */
  getRecipeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const recipe = await this.recipeService.findById(id, userId);

      res.status(200).json({
        status: 'success',
        message: 'Recipe retrieved successfully',
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new recipe
   */
  createRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'You must be logged in to create a recipe');
      }

      const userId = req.user.id;
      const recipeData: CreateRecipeDto = req.body;

      const recipe = await this.recipeService.create(userId, recipeData);

      res.status(201).json({
        status: 'success',
        message: 'Recipe created successfully',
        data: recipe,
      });
    } catch (error) {
      logger.error('Error creating recipe:', error);
      next(error);
    }
  };

  /**
   * Update a recipe
   */
  updateRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'You must be logged in to update a recipe');
      }

      const { id } = req.params;
      const userId = req.user.id;
      const recipeData: UpdateRecipeDto = req.body;

      const recipe = await this.recipeService.update(id, userId, recipeData);

      res.status(200).json({
        status: 'success',
        message: 'Recipe updated successfully',
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a recipe
   */
  deleteRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'You must be logged in to delete a recipe');
      }

      const { id } = req.params;
      const userId = req.user.id;

      await this.recipeService.delete(id, userId);

      res.status(200).json({
        status: 'success',
        message: 'Recipe deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}