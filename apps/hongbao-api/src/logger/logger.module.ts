import { randomUUID } from 'node:crypto';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

const REQUEST_ID_HEADER = 'x-request-id';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            level:
              config.get<string>('LOG_LEVEL') ??
              (isProduction ? 'info' : 'debug'),
            // Pretty, colorized output locally; structured JSON in production.
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: false,
                    translateTime: 'SYS:dd-mm-yyyy HH:MM:ss.l',
                    ignore: 'pid,hostname',
                  },
                },
            // Reuse an upstream request id if present, otherwise generate one,
            // and echo it back so clients can correlate errors with logs.
            genReqId: (req: IncomingMessage, res: ServerResponse) => {
              const existing = req.headers[REQUEST_ID_HEADER];
              const id =
                (Array.isArray(existing) ? existing[0] : existing) ??
                randomUUID();
              res.setHeader(REQUEST_ID_HEADER, id);
              return id;
            },
            customLogLevel: (_req, res, err) => {
              if (err || res.statusCode >= 500) return 'error';
              if (res.statusCode >= 400) return 'warn';
              return 'info';
            },
            // Don't log Swagger UI asset requests.
            autoLogging: {
              ignore: (req) => req.url?.startsWith('/api/docs') ?? false,
            },
            // Keep request/response logs lean and never include headers
            // (Authorization bearer tokens, cookies, webhook signatures).
            serializers: {
              req: (req: { id: string; method: string; url: string }) => ({
                id: req.id,
                method: req.method,
                url: req.url,
              }),
              res: (res: { statusCode: number }) => ({
                statusCode: res.statusCode,
              }),
            },
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
