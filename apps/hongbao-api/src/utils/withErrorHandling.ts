import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

const isClientHttpError = (
  error: unknown,
): error is Error & { status: number; expose: boolean } =>
  error instanceof Error &&
  'status' in error &&
  typeof error.status === 'number' &&
  error.status >= 400 &&
  error.status < 500 &&
  'expose' in error &&
  error.expose === true;

/**
 * Maps any thrown value to an HttpException. Known Prisma errors become the
 * matching 4xx; anything unrecognised becomes a 500 that keeps the original
 * error as `cause` so the global exception filter can log its stack.
 */
export const toHttpException = (error: unknown): HttpException => {
  if (error instanceof HttpException) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        return new NotFoundException('Record not found');
      case 'P2002': {
        const target = (error.meta?.target as string[] | undefined)?.join(', ');
        return new ConflictException(
          target
            ? `A record with this ${target} already exists`
            : 'A record with this value already exists',
        );
      }
      case 'P2003':
        return new BadRequestException('Invalid reference to related record');
      default:
        return new BadRequestException(error.message);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestException('Invalid data provided');
  }

  // body-parser / http-errors (e.g. 413 "request entity too large", 400
  // malformed JSON) carry their own client-error status; keep it instead of
  // reporting them as 500s.
  if (isClientHttpError(error)) {
    return new HttpException(error.message, error.status);
  }

  if (error instanceof Error) {
    return new InternalServerErrorException(error.message, { cause: error });
  }
  return new InternalServerErrorException('Internal server error', {
    cause: error,
  });
};

export const withErrorHandling = async <T>(
  action: () => Promise<T>,
): Promise<T> => {
  try {
    return await action();
  } catch (error) {
    throw toHttpException(error);
  }
};
