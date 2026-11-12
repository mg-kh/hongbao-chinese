import { FilterClientEnrollmentSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterClientEnrollmentSchema };

export class FilterClientEnrollmentDto extends createZodDto(
  FilterClientEnrollmentSchema,
) {}
