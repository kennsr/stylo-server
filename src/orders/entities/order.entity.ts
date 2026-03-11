import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  order_number: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'float' })
  subtotal: number;

  @Column({ type: 'float' })
  shipping_cost: number;

  @Column({ type: 'float' })
  total: number;

  @Column()
  payment_method: string;

  @Column()
  shipping_courier: string;

  @Column()
  shipping_service: string;

  @Column()
  receiver_name: string;

  @Column({ type: 'text' })
  address: string;

  @Column()
  phone: string;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;
}
