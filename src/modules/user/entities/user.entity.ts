import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  dateOfBirth: Date;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  city: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string | null;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date | null;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  login: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;
}
