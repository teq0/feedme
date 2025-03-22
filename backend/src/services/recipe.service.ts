import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Recipe } from '../models/recipe.entity';
import { RecipeIngredient } from '../models/recipe-ingredient.entity';
import { RecipeDietaryRestriction } from '../models/recipe-dietary-restriction.entity';
import { Ingredient } from '../models/ingredient.entity';
import { ApiError } from '../middleware/error-handler';
import { logger } from '../utils/logger';

export interface CreateRecipeDto {
  name: string;
  imageUrl?: string;
  preparationSteps: string;
  cookingTime: number;
  cuisineType: string;
  suitableMealTypes: string[];
  isPublic?: boolean;
  dietaryRestrictions?: string[];
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}

export interface UpdateRecipeDto extends Partial<CreateRecipeDto> {}

export class RecipeService {
  private recipeRepository: Repository<Recipe>;
  private recipeIngredientRepository: Repository<RecipeIngredient>;
  private recipeDietaryRestrictionRepository: Repository<RecipeDietaryRestriction>;
  private ingredientRepository: Repository<Ingredient>;

  constructor() {
    this.recipeRepository = AppDataSource.getRepository(Recipe);
    this.recipeIngredientRepository = AppDataSource.getRepository(RecipeIngredient);
    this.recipeDietaryRestrictionRepository = AppDataSource.getRepository(RecipeDietaryRestriction);
    this.ingredientRepository = AppDataSource.getRepository(Ingredient);
  }

  /**
   * Get all recipes
   */
  async findAll(userId?: string): Promise<Recipe[]> {
    try {
      // If userId is provided, return public recipes and user's own recipes
      // Otherwise, return only public recipes
      const queryBuilder = this.recipeRepository
        .createQueryBuilder('recipe')
        .leftJoinAndSelect('recipe.ingredients', 'ingredients')
        .leftJoinAndSelect('recipe.dietaryRestrictions', 'dietaryRestrictions')
        .leftJoinAndSelect('recipe.user', 'user');

      if (userId) {
        queryBuilder.where('recipe.isPublic = :isPublic OR recipe.userId = :userId', {
          isPublic: true,
          userId,
        });
      } else {
        queryBuilder.where('recipe.isPublic = :isPublic', { isPublic: true });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      logger.error('Error finding recipes:', error);
      throw error;
    }
  }

  /**
   * Get recipe by ID
   */
  async findById(id: string, userId?: string): Promise<Recipe> {
    try {
      const recipe = await this.recipeRepository.findOne({
        where: { id },
        relations: ['ingredients', 'dietaryRestrictions', 'user'],
      });

      if (!recipe) {
        throw new ApiError(404, 'Recipe not found');
      }

      // Check if recipe is public or belongs to the user
      if (!recipe.isPublic && recipe.userId !== userId) {
        throw new ApiError(403, 'You do not have permission to view this recipe');
      }

      return recipe;
    } catch (error) {
      logger.error(`Error finding recipe with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new recipe
   */
  async create(userId: string, recipeData: CreateRecipeDto): Promise<Recipe> {
    try {
      // Create recipe
      const recipe = new Recipe();
      recipe.name = recipeData.name;
      recipe.imageUrl = recipeData.imageUrl || ''; // Handle undefined imageUrl
      recipe.preparationSteps = recipeData.preparationSteps;
      recipe.cookingTime = recipeData.cookingTime;
      recipe.cuisineType = recipeData.cuisineType;
      recipe.suitableMealTypes = recipeData.suitableMealTypes.join(',');
      recipe.isPublic = recipeData.isPublic || false;
      recipe.userId = userId;

      // Save recipe to get ID
      const savedRecipe = await this.recipeRepository.save(recipe);

      // Add ingredients
      if (recipeData.ingredients && recipeData.ingredients.length > 0) {
        for (const ingredientData of recipeData.ingredients) {
          // Find or create ingredient
          let ingredient = await this.ingredientRepository.findOne({
            where: { name: ingredientData.name }
          });
          
          if (!ingredient) {
            ingredient = new Ingredient();
            ingredient.name = ingredientData.name;
            ingredient.category = 'Other'; // Default category
            ingredient.shelfLifeDays = 7; // Default shelf life
            ingredient = await this.ingredientRepository.save(ingredient);
          }
          
          // Create recipe ingredient relationship
          const recipeIngredient = new RecipeIngredient();
          recipeIngredient.recipeId = savedRecipe.id;
          recipeIngredient.ingredientId = ingredient.id;
          recipeIngredient.quantity = ingredientData.quantity;
          recipeIngredient.unit = ingredientData.unit;
          
          await this.recipeIngredientRepository.save(recipeIngredient);
        }
      }

      // Add dietary restrictions
      if (recipeData.dietaryRestrictions && recipeData.dietaryRestrictions.length > 0) {
        const restrictions = recipeData.dietaryRestrictions.map((restriction) => {
          const dietaryRestriction = new RecipeDietaryRestriction();
          dietaryRestriction.restriction = restriction;
          dietaryRestriction.recipeId = savedRecipe.id;
          return dietaryRestriction;
        });

        await this.recipeDietaryRestrictionRepository.save(restrictions);
      }

      // Return recipe with relations
      return this.findById(savedRecipe.id, userId);
    } catch (error) {
      logger.error('Error creating recipe:', error);
      throw error;
    }
  }

  /**
   * Update a recipe
   */
  async update(id: string, userId: string, recipeData: UpdateRecipeDto): Promise<Recipe> {
    try {
      // Check if recipe exists and belongs to the user
      const recipe = await this.recipeRepository.findOne({
        where: { id },
        relations: ['ingredients', 'dietaryRestrictions'],
      });

      if (!recipe) {
        throw new ApiError(404, 'Recipe not found');
      }

      if (recipe.userId !== userId) {
        throw new ApiError(403, 'You do not have permission to update this recipe');
      }

      // Update recipe fields
      if (recipeData.name) recipe.name = recipeData.name;
      if (recipeData.imageUrl !== undefined) recipe.imageUrl = recipeData.imageUrl;
      if (recipeData.preparationSteps) recipe.preparationSteps = recipeData.preparationSteps;
      if (recipeData.cookingTime) recipe.cookingTime = recipeData.cookingTime;
      if (recipeData.cuisineType) recipe.cuisineType = recipeData.cuisineType;
      if (recipeData.suitableMealTypes) recipe.suitableMealTypes = recipeData.suitableMealTypes.join(',');
      if (recipeData.isPublic !== undefined) recipe.isPublic = recipeData.isPublic;

      // Save updated recipe
      await this.recipeRepository.save(recipe);

      // Update ingredients if provided
      if (recipeData.ingredients) {
        // Delete existing ingredients
        if (recipe.ingredients && recipe.ingredients.length > 0) {
          await this.recipeIngredientRepository.remove(recipe.ingredients);
        }

        // Add new ingredients
        for (const ingredientData of recipeData.ingredients) {
          // Find or create ingredient
          let ingredient = await this.ingredientRepository.findOne({
            where: { name: ingredientData.name }
          });
          
          if (!ingredient) {
            ingredient = new Ingredient();
            ingredient.name = ingredientData.name;
            ingredient.category = 'Other'; // Default category
            ingredient.shelfLifeDays = 7; // Default shelf life
            ingredient = await this.ingredientRepository.save(ingredient);
          }
          
          // Create recipe ingredient relationship
          const recipeIngredient = new RecipeIngredient();
          recipeIngredient.recipeId = id;
          recipeIngredient.ingredientId = ingredient.id;
          recipeIngredient.quantity = ingredientData.quantity;
          recipeIngredient.unit = ingredientData.unit;
          
          await this.recipeIngredientRepository.save(recipeIngredient);
        }
      }

      // Update dietary restrictions if provided
      if (recipeData.dietaryRestrictions) {
        // Delete existing restrictions
        if (recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0) {
          await this.recipeDietaryRestrictionRepository.remove(recipe.dietaryRestrictions);
        }

        // Add new restrictions
        const restrictions = recipeData.dietaryRestrictions.map((restriction) => {
          const dietaryRestriction = new RecipeDietaryRestriction();
          dietaryRestriction.restriction = restriction;
          dietaryRestriction.recipeId = id;
          return dietaryRestriction;
        });

        await this.recipeDietaryRestrictionRepository.save(restrictions);
      }

      // Return updated recipe with relations
      return this.findById(id, userId);
    } catch (error) {
      logger.error(`Error updating recipe with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a recipe
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      // Check if recipe exists and belongs to the user
      const recipe = await this.recipeRepository.findOne({
        where: { id },
      });

      if (!recipe) {
        throw new ApiError(404, 'Recipe not found');
      }

      if (recipe.userId !== userId) {
        throw new ApiError(403, 'You do not have permission to delete this recipe');
      }

      // Delete recipe (cascade will delete related entities)
      await this.recipeRepository.remove(recipe);
    } catch (error) {
      logger.error(`Error deleting recipe with ID ${id}:`, error);
      throw error;
    }
  }
}