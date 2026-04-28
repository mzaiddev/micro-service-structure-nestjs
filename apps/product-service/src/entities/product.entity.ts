import { Column, Entity } from 'typeorm';

import { PostgresBaseEntity } from '@app/database';

@Entity({ name: 'products' })
export class ProductEntity extends PostgresBaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price!: number;

  @Column({ default: 'USD' })
  currency!: string;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'simple-array', default: '' })
  tags!: string[];

  @Column({ default: true })
  isActive!: boolean;
}
