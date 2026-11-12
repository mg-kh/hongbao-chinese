import { verifyToken } from '@clerk/backend';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

interface AuthRequest extends Request {
  auth?: {
    sub: string;
    email_addresses?: { email_address: string }[];
    [key: string]: any;
  };
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<AuthRequest>();
    const header = req.headers['authorization'] as string | undefined;

    if (typeof header !== 'string') {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    const authHeader = header;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    try {
      const session = await verifyToken(token, {
        secretKey: this.configService.get<string>('CLERK_SECRET_KEY')!,
      });

      if (!session.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }
      const clerkId = session.sub;
      const user = await this.authService.getUserByClerkId(clerkId);
      if (!user) throw new UnauthorizedException('User not found');

      req.auth = session;
      req.user = user;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
