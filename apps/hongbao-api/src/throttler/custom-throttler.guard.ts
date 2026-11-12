import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { User } from '@prisma/client';

interface ThrottledRequest extends Record<string, any> {
  user?: User;
  ip: string;
}

/**
 * Extends the default ThrottlerGuard so requests are tracked per authenticated
 * user instead of per IP whenever possible, and so a rate-limited client gets
 * a clear, custom error response instead of the library's default message.
 *
 * NOTE ON GUARD ORDER: this relies on `AuthGuard` having already run and
 * populated `req.user` for the current request. In app.module.ts, the
 * APP_GUARD provider for AuthGuard is registered before this guard's, and
 * Nest executes multiple global guards in registration order, so `req.user`
 * (when the request is authenticated) is available here.
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: ThrottledRequest): Promise<string> {
    // Prefix so a user id can never collide with an IP string in storage.
    return Promise.resolve(req.user ? `user-${req.user.id}` : `ip-${req.ip}`);
  }

  protected throwThrottlingException(): never {
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too Many Requests',
        message: 'Too many requests, please slow down.',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
