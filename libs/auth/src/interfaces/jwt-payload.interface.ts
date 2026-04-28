import type { Role } from '@app/common';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
}
