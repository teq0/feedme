import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { MealPlanRecipe } from './meal-plan-recipe.entity';

@Entity('meal_plans')
export class MealPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign keys
  @Column()
  userId: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.mealPlans)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => MealPlanRecipe, (mealPlanRecipe) => mealPlanRecipe.mealPlan, {
    cascade: true,
  })
  recipes: MealPlanRecipe[];
}