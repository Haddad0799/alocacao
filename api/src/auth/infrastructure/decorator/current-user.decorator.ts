import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../../../user/domain/valueobject/role';

export interface AuthUser {
  id: string;
  role: Role;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser =>
    ctx.switchToHttp().getRequest().user,
);