import type { Role } from '@app/common';

export interface JwtUser {
  sub: string;
  email: string;
  roles: Role[];
  iat?: number;
  exp?: number;
}
