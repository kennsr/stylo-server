import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ nullable: true, type: 'float' })
  discount_price: number;

  @Column()
  category: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
    eager: true,
  })
  variants: ProductVariant[];

  @OneToMany(() => Review, (review) => review.product, { cascade: false })
  reviews: Review[];

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ default: 0 })
  review_count: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: false })
  is_featured: boolean;

  @Column({ default: false })
  has_ai_try_on: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
