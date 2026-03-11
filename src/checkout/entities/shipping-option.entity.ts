import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shipping_options')
export class ShippingOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  courier: string;

  @Column()
  service: string;

  @Column({ type: 'float' })
  cost: number;

  @Column()
  estimated_days: number;
}
