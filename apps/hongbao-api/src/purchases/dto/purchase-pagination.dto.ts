import { PurchasePaginationSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { PurchasePaginationSchema };

export class PurchasePaginationDto extends createZodDto(
  PurchasePaginationSchema,
) {}
