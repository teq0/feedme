import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/user.entity';
import { Recipe } from '../models/recipe.entity';
import { Ingredient } from '../models/ingredient.entity';
import { RecipeIngredient } from '../models/recipe-ingredient.entity';
import { RecipeDietaryRestriction } from '../models/recipe-dietary-restriction.entity';
import { UserRole } from '../types/user.types';
import { logger } from '../utils/logger';

// Mock recipes data
const mockRecipes = [
  {
    name: 'Spaghetti Carbonara',
    imageUrl: 'https://source.unsplash.com/random/1200x600/?pasta',
    preparationSteps: `1. Bring a large pot of salted water to a boil. Add the spaghetti and cook until al dente, about 8-10 minutes.

2. Meanwhile, in a large skillet, cook the pancetta over medium heat until crispy, about 5-7 minutes. Remove from heat and set aside.

3. In a bowl, whisk together the eggs, grated Pecorino Romano, and black pepper.

4. When the pasta is done, reserve 1/2 cup of the pasta water, then drain the pasta.

5. Working quickly, add the hot pasta to the skillet with the pancetta. Toss to combine.

6. Remove the skillet from heat and add the egg mixture, tossing quickly to coat the pasta before the eggs scramble. If needed, add a splash of the reserved pasta water to create a creamy sauce.

7. Serve immediately, topped with additional grated cheese and black pepper.`,
    cookingTime: 30,
    cuisineType: 'Italian',
    suitableMealTypes: 'Lunch,Dinner',
    dietaryRestrictions: ['Dairy'],
    ingredients: [
      { name: 'Spaghetti', quantity: 400, unit: 'g', category: 'Pasta', shelfLifeDays: 365 },
      { name: 'Pancetta', quantity: 150, unit: 'g', category: 'Meat', shelfLifeDays: 7 },
      { name: 'Eggs', quantity: 3, unit: 'large', category: 'Dairy', shelfLifeDays: 21 },
      { name: 'Pecorino Romano', quantity: 50, unit: 'g', category: 'Dairy', shelfLifeDays: 60 },
      { name: 'Black Pepper', quantity: 1, unit: 'tsp', category: 'Spices', shelfLifeDays: 730 },
      { name: 'Salt', quantity: 1, unit: 'to taste', category: 'Spices', shelfLifeDays: 1825 },
    ],
  },
  {
    name: 'Vegetable Curry',
    imageUrl: 'https://source.unsplash.com/random/1200x600/?curry',
    preparationSteps: `1. Heat oil in a large pot over medium heat. Add onions and sauté until translucent, about 5 minutes.

2. Add garlic, ginger, and curry paste. Cook for 1-2 minutes until fragrant.

3. Add diced vegetables and stir to coat with the curry paste.

4. Pour in coconut milk and vegetable broth. Bring to a simmer.

5. Reduce heat to low and cook for 15-20 minutes until vegetables are tender.

6. Stir in lime juice and cilantro.

7. Serve over rice.`,
    cookingTime: 45,
    cuisineType: 'Indian',
    suitableMealTypes: 'Lunch,Dinner',
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free'],
    ingredients: [
      { name: 'Coconut Oil', quantity: 2, unit: 'tbsp', category: 'Oils', shelfLifeDays: 365 },
      { name: 'Onion', quantity: 1, unit: 'large', category: 'Vegetables', shelfLifeDays: 30 },
      { name: 'Garlic', quantity: 3, unit: 'cloves', category: 'Vegetables', shelfLifeDays: 90 },
      { name: 'Ginger', quantity: 1, unit: 'tbsp', category: 'Vegetables', shelfLifeDays: 30 },
      { name: 'Curry Paste', quantity: 2, unit: 'tbsp', category: 'Spices', shelfLifeDays: 180 },
      { name: 'Mixed Vegetables', quantity: 4, unit: 'cups', category: 'Vegetables', shelfLifeDays: 7 },
      { name: 'Coconut Milk', quantity: 1, unit: 'can', category: 'Canned Goods', shelfLifeDays: 365 },
      { name: 'Vegetable Broth', quantity: 1, unit: 'cup', category: 'Canned Goods', shelfLifeDays: 365 },
      { name: 'Lime Juice', quantity: 1, unit: 'tbsp', category: 'Fruits', shelfLifeDays: 7 },
      { name: 'Cilantro', quantity: 1/4, unit: 'cup', category: 'Herbs', shelfLifeDays: 7 },
    ],
  },
  {
    name: 'Chicken Stir Fry',
    imageUrl: 'https://source.unsplash.com/random/1200x600/?stirfry',
    preparationSteps: `1. Slice chicken into thin strips. In a bowl, combine soy sauce, cornstarch, and chicken. Let marinate for 10 minutes.

2. Heat oil in a wok or large skillet over high heat.

3. Add chicken and stir-fry until no longer pink, about 3-4 minutes. Remove and set aside.

4. Add more oil if needed, then add vegetables. Stir-fry for 2-3 minutes until crisp-tender.

5. Return chicken to the wok. Add sauce ingredients and stir to combine.

6. Cook for another 1-2 minutes until sauce thickens.

7. Serve over rice or noodles.`,
    cookingTime: 20,
    cuisineType: 'Chinese',
    suitableMealTypes: 'Lunch,Dinner',
    dietaryRestrictions: [],
    ingredients: [
      { name: 'Chicken Breast', quantity: 500, unit: 'g', category: 'Meat', shelfLifeDays: 3 },
      { name: 'Soy Sauce', quantity: 3, unit: 'tbsp', category: 'Condiments', shelfLifeDays: 730 },
      { name: 'Cornstarch', quantity: 1, unit: 'tbsp', category: 'Baking', shelfLifeDays: 730 },
      { name: 'Vegetable Oil', quantity: 2, unit: 'tbsp', category: 'Oils', shelfLifeDays: 365 },
      { name: 'Bell Peppers', quantity: 2, unit: 'medium', category: 'Vegetables', shelfLifeDays: 14 },
      { name: 'Broccoli', quantity: 1, unit: 'head', category: 'Vegetables', shelfLifeDays: 7 },
      { name: 'Carrots', quantity: 2, unit: 'medium', category: 'Vegetables', shelfLifeDays: 30 },
      { name: 'Garlic', quantity: 2, unit: 'cloves', category: 'Vegetables', shelfLifeDays: 90 },
      { name: 'Ginger', quantity: 1, unit: 'tbsp', category: 'Vegetables', shelfLifeDays: 30 },
      { name: 'Sesame Oil', quantity: 1, unit: 'tsp', category: 'Oils', shelfLifeDays: 365 },
    ],
  },
  {
    name: 'Greek Salad',
    imageUrl: 'https://source.unsplash.com/random/1200x600/?salad',
    preparationSteps: `1. Chop cucumber, tomatoes, and red onion into bite-sized pieces.

2. Combine vegetables in a large bowl.

3. Add olives and crumbled feta cheese.

4. In a small bowl, whisk together olive oil, red wine vinegar, oregano, salt, and pepper.

5. Pour dressing over salad and toss gently to combine.

6. Serve immediately or refrigerate for up to 1 hour before serving.`,
    cookingTime: 15,
    cuisineType: 'Greek',
    suitableMealTypes: 'Lunch',
    dietaryRestrictions: ['Vegetarian'],
    ingredients: [
      { name: 'Cucumber', quantity: 1, unit: 'large', category: 'Vegetables', shelfLifeDays: 7 },
      { name: 'Tomatoes', quantity: 3, unit: 'medium', category: 'Vegetables', shelfLifeDays: 7 },
      { name: 'Red Onion', quantity: 1/2, unit: 'medium', category: 'Vegetables', shelfLifeDays: 30 },
      { name: 'Kalamata Olives', quantity: 1/2, unit: 'cup', category: 'Canned Goods', shelfLifeDays: 365 },
      { name: 'Feta Cheese', quantity: 200, unit: 'g', category: 'Dairy', shelfLifeDays: 14 },
      { name: 'Olive Oil', quantity: 1/4, unit: 'cup', category: 'Oils', shelfLifeDays: 365 },
      { name: 'Red Wine Vinegar', quantity: 2, unit: 'tbsp', category: 'Condiments', shelfLifeDays: 730 },
      { name: 'Dried Oregano', quantity: 1, unit: 'tsp', category: 'Spices', shelfLifeDays: 730 },
      { name: 'Salt', quantity: 1/2, unit: 'tsp', category: 'Spices', shelfLifeDays: 1825 },
      { name: 'Black Pepper', quantity: 1/4, unit: 'tsp', category: 'Spices', shelfLifeDays: 730 },
    ],
  },
  {
    name: 'Beef Tacos',
    imageUrl: 'https://source.unsplash.com/random/1200x600/?tacos',
    preparationSteps: `1. Heat oil in a large skillet over medium-high heat.

2. Add onion and cook until softened, about 3 minutes.

3. Add ground beef and cook until browned, breaking it up as it cooks.

4. Add taco seasoning and water. Simmer for 5 minutes until sauce thickens.

5. Warm taco shells according to package directions.

6. Fill shells with beef mixture and top with lettuce, tomato, cheese, and sour cream.

7. Serve immediately.`,
    cookingTime: 25,
    cuisineType: 'Mexican',
    suitableMealTypes: 'Lunch,Dinner',
    dietaryRestrictions: ['Dairy'],
    ingredients: [
      { name: 'Ground Beef', quantity: 500, unit: 'g', category: 'Meat', shelfLifeDays: 3 },
      { name: 'Onion', quantity: 1, unit: 'medium', category: 'Vegetables', shelfLifeDays: 30 },
      { name: 'Taco Seasoning', quantity: 1, unit: 'packet', category: 'Spices', shelfLifeDays: 365 },
      { name: 'Water', quantity: 3/4, unit: 'cup', category: 'Beverages', shelfLifeDays: 0 },
      { name: 'Taco Shells', quantity: 8, unit: 'shells', category: 'Grains', shelfLifeDays: 90 },
      { name: 'Lettuce', quantity: 2, unit: 'cups', category: 'Vegetables', shelfLifeDays: 7 },
      { name: 'Tomato', quantity: 1, unit: 'large', category: 'Vegetables', shelfLifeDays: 7 },
      { name: 'Cheddar Cheese', quantity: 1, unit: 'cup', category: 'Dairy', shelfLifeDays: 30 },
      { name: 'Sour Cream', quantity: 1/2, unit: 'cup', category: 'Dairy', shelfLifeDays: 14 },
    ],
  },
];

// Seed function
async function seedRecipes() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    logger.info('Database connection established');

    // Check if we already have recipes
    const recipeCount = await AppDataSource.getRepository(Recipe).count();
    if (recipeCount > 1) {
      logger.info(`Database already has ${recipeCount} recipes. Skipping seed.`);
      return;
    }

    // Create admin user if it doesn't exist
    let adminUser = await AppDataSource.getRepository(User).findOne({
      where: { email: 'admin@feedme.com' },
    });

    if (!adminUser) {
      adminUser = new User();
      adminUser.email = 'admin@feedme.com';
      adminUser.name = 'Admin User';
      adminUser.password = '$2b$10$XvXWZ5XrxQ5IoAUl.VFqS.1wgfS4jOKJEyL9rY9ML8v/nwxiDFpLu'; // hashed 'password123'
      adminUser.role = UserRole.ADMIN;
      adminUser = await AppDataSource.getRepository(User).save(adminUser);
      logger.info('Admin user created');
    }

    // Process each recipe
    for (const mockRecipe of mockRecipes) {
      // Create recipe
      const recipe = new Recipe();
      recipe.name = mockRecipe.name;
      recipe.imageUrl = mockRecipe.imageUrl;
      recipe.preparationSteps = mockRecipe.preparationSteps;
      recipe.cookingTime = mockRecipe.cookingTime;
      recipe.cuisineType = mockRecipe.cuisineType;
      recipe.suitableMealTypes = mockRecipe.suitableMealTypes;
      recipe.isPublic = true;
      recipe.userId = adminUser.id;

      // Save recipe to get ID
      const savedRecipe = await AppDataSource.getRepository(Recipe).save(recipe);
      logger.info(`Created recipe: ${savedRecipe.name}`);

      // Process ingredients
      for (const ingredientData of mockRecipe.ingredients) {
        // Find or create ingredient
        let ingredient = await AppDataSource.getRepository(Ingredient).findOne({
          where: { name: ingredientData.name },
        });

        if (!ingredient) {
          ingredient = new Ingredient();
          ingredient.name = ingredientData.name;
          ingredient.category = ingredientData.category;
          ingredient.shelfLifeDays = ingredientData.shelfLifeDays;
          ingredient = await AppDataSource.getRepository(Ingredient).save(ingredient);
          logger.info(`Created ingredient: ${ingredient.name}`);
        }

        // Create recipe ingredient relationship
        const recipeIngredient = new RecipeIngredient();
        recipeIngredient.recipeId = savedRecipe.id;
        recipeIngredient.ingredientId = ingredient.id;
        recipeIngredient.quantity = ingredientData.quantity;
        recipeIngredient.unit = ingredientData.unit;
        await AppDataSource.getRepository(RecipeIngredient).save(recipeIngredient);
      }

      // Process dietary restrictions
      for (const restriction of mockRecipe.dietaryRestrictions) {
        const dietaryRestriction = new RecipeDietaryRestriction();
        dietaryRestriction.recipeId = savedRecipe.id;
        dietaryRestriction.restriction = restriction;
        await AppDataSource.getRepository(RecipeDietaryRestriction).save(dietaryRestriction);
        logger.info(`Added dietary restriction: ${restriction} to ${savedRecipe.name}`);
      }
    }

    logger.info('Recipe seeding completed successfully');
  } catch (error) {
    logger.error('Error seeding recipes:', error);
  } finally {
    // Close the connection
    await AppDataSource.destroy();
    logger.info('Database connection closed');
  }
}

// Run the seed function
seedRecipes();