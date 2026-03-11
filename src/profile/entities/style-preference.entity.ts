import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('style_preferences')
export class StylePreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;
}
