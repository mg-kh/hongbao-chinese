import { CreateClientPurchaseSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateClientPurchaseSchema };

export class CreateClientPurchaseDto extends createZodDto(
  CreateClientPurchaseSchema,
) {}
