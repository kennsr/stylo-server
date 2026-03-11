import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  product_id: string;

  @Column()
  product_name: string;

  @Column()
  product_image: string;

  @Column({ type: 'float' })
  price: number;

  @Column()
  quantity: number;

  @Column()
  size: string;

  @Column()
  color: string;

  @Column({ nullable: true, type: 'float' })
  discount_price: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}
