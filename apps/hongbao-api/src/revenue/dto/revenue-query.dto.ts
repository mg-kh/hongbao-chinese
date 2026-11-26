import { RevenueQuerySchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export class RevenueQueryDto extends createZodDto(RevenueQuerySchema) {}
