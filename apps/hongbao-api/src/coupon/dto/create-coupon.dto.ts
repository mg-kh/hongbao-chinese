import { CreateCouponSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateCouponSchema };

export class CreateCouponDto extends createZodDto(CreateCouponSchema) {}
