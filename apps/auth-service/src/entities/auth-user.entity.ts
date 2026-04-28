import { Column, Entity, Index } from 'typeorm';

import { Role } from '@app/common';
import { PostgresBaseEntity } from '@app/database';

@Entity({ name: 'auth_users' })
export class AuthUserEntity extends PostgresBaseEntity {
  @Index({ unique: true })
  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'simple-array', default: Role.USER })
  roles!: Role[];

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt?: Date | null;
}
