import { UseClientCouponSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { UseClientCouponSchema };

export class UseClientCouponDto extends createZodDto(UseClientCouponSchema) {}
