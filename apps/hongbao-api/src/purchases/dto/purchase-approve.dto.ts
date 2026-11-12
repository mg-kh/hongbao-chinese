import { PurchaseApproveSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { PurchaseApproveSchema };

export class PurchaseApproveDto extends createZodDto(PurchaseApproveSchema) {}
