import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('try_on_results')
export class TryOnResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  product_id: string;

  @Column()
  original_image_url: string;

  @Column()
  result_image_url: string;

  @Column({ default: false })
  is_saved: boolean;

  @CreateDateColumn()
  created_at: Date;
}
