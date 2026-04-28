import { Column, Entity, Index } from 'typeorm';

import { PostgresBaseEntity } from '@app/database';

@Entity({ name: 'user_profiles' })
export class UserProfileEntity extends PostgresBaseEntity {
  @Index({ unique: true })
  @Column()
  authUserId!: string;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: 'active' })
  status!: string;
}
