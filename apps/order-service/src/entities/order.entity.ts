import { Column, Entity } from 'typeorm';

import { PostgresBaseEntity } from '@app/database';

@Entity({ name: 'orders' })
export class OrderEntity extends PostgresBaseEntity {
  @Column()
  userId!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  totalAmount!: number;

  @Column({ default: 'USD' })
  currency!: string;

  @Column({ default: 'created' })
  status!: string;

  @Column({ type: 'jsonb' })
  items!: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
}
