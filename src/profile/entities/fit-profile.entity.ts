import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('fit_profiles')
export class FitProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, type: 'float' })
  height: number;

  @Column({ nullable: true, type: 'float' })
  weight: number;

  @Column({ nullable: true, type: 'float' })
  chest: number;

  @Column({ nullable: true, type: 'float' })
  waist: number;

  @Column({ nullable: true, type: 'float' })
  hips: number;

  @Column({ nullable: true })
  preferred_size: string;
}
