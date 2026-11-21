import { PurchaseRejectSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { PurchaseRejectSchema };

export class PurchaseRejectDto extends createZodDto(PurchaseRejectSchema) {}
