import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Ingredient } from './ingredient.entity';

@Entity('user_ingredients')
export class UserIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  quantity: number;

  @Column()
  unit: string;

  @Column({ nullable: true, type: 'timestamp' })
  expiryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign keys
  @Column()
  userId: string;

  @Column()
  ingredientId: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.ingredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.users)
  @JoinColumn({ name: 'ingredientId' })
  ingredient: Ingredient;
}