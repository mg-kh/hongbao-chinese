import { FilterClientPurchaseSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterClientPurchaseSchema };

export class FilterClientPurchaseDto extends createZodDto(
  FilterClientPurchaseSchema,
) {}
