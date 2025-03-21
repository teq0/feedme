import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('recipe_dietary_restrictions')
export class RecipeDietaryRestriction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restriction: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign keys
  @Column()
  recipeId: string;

  // Relationships
  @ManyToOne(() => Recipe, (recipe) => recipe.dietaryRestrictions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;
}