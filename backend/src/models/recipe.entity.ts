import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { RecipeDietaryRestriction } from './recipe-dietary-restriction.entity';
import { MealPlanRecipe } from './meal-plan-recipe.entity';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('text')
  preparationSteps: string;

  @Column()
  cookingTime: number;

  @Column()
  cuisineType: string;

  @Column({ default: false })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign keys
  @Column()
  userId: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.recipes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, {
    cascade: true,
  })
  ingredients: RecipeIngredient[];

  @OneToMany(() => RecipeDietaryRestriction, (restriction) => restriction.recipe, {
    cascade: true,
  })
  dietaryRestrictions: RecipeDietaryRestriction[];

  @OneToMany(() => MealPlanRecipe, (mealPlanRecipe) => mealPlanRecipe.recipe)
  mealPlans: MealPlanRecipe[];
}