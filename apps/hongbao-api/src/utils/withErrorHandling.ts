import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const withErrorHandling = async <T>(
  action: () => Promise<T>,
): Promise<T> => {
  try {
    return await action();
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
          throw new NotFoundException('Record not found');
        case 'P2002': {
          const target = (error.meta?.target as string[] | undefined)?.join(
            ', ',
          );
          throw new ConflictException(
            target
              ? `A record with this ${target} already exists`
              : 'A record with this value already exists',
          );
        }
        case 'P2003':
          throw new BadRequestException('Invalid reference to related record');
        default:
          throw new BadRequestException(error.message);
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException('Invalid data provided');
    }

    if (error instanceof Error) {
      throw new InternalServerErrorException(error.message);
    }
    throw new InternalServerErrorException('Internal server error');
  }
};
