import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { UserIngredient } from './user-ingredient.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  category: string;

  @Column()
  shelfLifeDays: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.ingredient)
  recipes: RecipeIngredient[];

  @OneToMany(() => UserIngredient, (userIngredient) => userIngredient.ingredient)
  users: UserIngredient[];

  // Self-referencing many-to-many for substitutes
  @ManyToMany(() => Ingredient)
  @JoinTable({
    name: 'ingredient_substitutes',
    joinColumn: {
      name: 'ingredientId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'substituteId',
      referencedColumnName: 'id',
    },
  })
  substitutes: Ingredient[];
}