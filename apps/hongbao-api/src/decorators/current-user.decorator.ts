import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User;
}

export const CurrentUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
