import { type ClerkClient, User, verifyToken } from '@clerk/backend';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

@Injectable()
export class ClerkStrategy extends PassportStrategy(Strategy, 'clerk') {
  private readonly logger = new Logger(ClerkStrategy.name);

  constructor(
    @Inject('ClerkClient')
    private readonly clerkClient: ClerkClient,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async validate(req: Request): Promise<User> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
      const tokenPayload = await verifyToken(token, {
        secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
      });

      if (!tokenPayload?.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.clerkClient.users.getUser(tokenPayload.sub);

      return user;
    } catch (error) {
      this.logger.warn({ err: error as Error }, 'Clerk auth failed');
      throw new UnauthorizedException('Invalid token');
    }
  }
}
