import { CouponToCourseSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CouponToCourseSchema };

export class CouponToCourseDto extends createZodDto(CouponToCourseSchema) {}
