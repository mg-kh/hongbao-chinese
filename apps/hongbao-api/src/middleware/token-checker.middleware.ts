import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

interface AuthRequest extends Request {
  auth?: {
    sub: string;
    email_addresses?: { email_address: string }[];
    [key: string]: any;
  };
  user?: User;
  token?: string;
}

@Injectable()
export class TokenChecker implements NestMiddleware {
  use(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers['authorization'];
    if (typeof header !== 'string') {
      throw new UnauthorizedException('Invalid Authorization header');
    }
    const authHeader = header;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    req.token = token;

    next();
  }
}
