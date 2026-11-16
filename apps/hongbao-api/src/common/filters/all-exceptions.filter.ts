import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { TelegramService } from '../../telegram/telegram.service';
import { toHttpException } from '../../utils/withErrorHandling';

interface RequestWithId {
  id?: string | number;
  method?: string;
  url?: string;
  user?: { id?: string };
}

/**
 * Catches every exception thrown anywhere in the request pipeline
 * (middleware, guards, pipes, controllers, services, interceptors) and
 * returns it in the same envelope as `successResponse`:
 *
 *   { success: false, message, data: null, statusCode, errors?, requestId }
 *
 * - Non-HTTP errors (Prisma, plain Error, thrown strings…) are mapped via
 *   `toHttpException`, so code outside `withErrorHandling` is covered too.
 * - 5xx errors are logged with their stack and reported to the owner via
 *   Telegram; in production their message is replaced with a generic one so
 *   internals never leak to clients.
 * - 4xx errors aren't logged here; pino-http already logs them as warnings.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isProduction: boolean;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    config: ConfigService,
    private readonly telegram: TelegramService,
  ) {
    this.isProduction = config.get<string>('NODE_ENV') === 'production';
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    // Only HTTP is served by this app; let Nest handle anything else.
    if (host.getType() !== 'http') throw exception;

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<RequestWithId>();
    const response = ctx.getResponse<unknown>();

    const httpException = toHttpException(exception);
    const statusCode = httpException.getStatus();
    const body = httpException.getResponse();

    let message = httpException.message;
    let errors: unknown;
    if (typeof body === 'string') {
      message = body;
    } else if (body && typeof body === 'object') {
      const { message: bodyMessage, errors: bodyErrors } = body as {
        message?: unknown;
        errors?: unknown;
      };
      if (Array.isArray(bodyMessage)) {
        message = bodyMessage.join(', ');
      } else if (typeof bodyMessage === 'string') {
        message = bodyMessage;
      }
      errors = bodyErrors;
    }

    if (statusCode >= 500) {
      const original =
        exception === httpException && httpException.cause !== undefined
          ? httpException.cause
          : exception;
      this.logger.error(
        {
          err: original,
          method: request.method,
          url: request.url,
          statusCode,
        },
        `Unhandled exception on ${request.method} ${request.url}`,
      );
      this.telegram.reportCriticalError({
        error: original,
        statusCode,
        method: request.method,
        url: request.url,
        requestId: request.id,
        userId: request.user?.id,
      });
      if (this.isProduction) message = 'Internal server error';
    }

    httpAdapter.reply(
      response,
      {
        success: false,
        message,
        data: null,
        statusCode,
        ...(errors !== undefined && { errors }),
        ...(request.id !== undefined && { requestId: request.id }),
      },
      statusCode,
    );
  }
}
