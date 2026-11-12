import { UpdateCouponSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { UpdateCouponSchema };

export class UpdateCouponDto extends createZodDto(UpdateCouponSchema) {}
