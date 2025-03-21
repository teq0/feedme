import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MealPlan } from './meal-plan.entity';
import { Recipe } from './recipe.entity';

@Entity('meal_plan_recipes')
export class MealPlanRecipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  plannedDate: Date;

  @Column()
  mealType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign keys
  @Column()
  mealPlanId: string;

  @Column()
  recipeId: string;

  // Relationships
  @ManyToOne(() => MealPlan, (mealPlan) => mealPlan.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mealPlanId' })
  mealPlan: MealPlan;

  @ManyToOne(() => Recipe, (recipe) => recipe.mealPlans)
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;
}