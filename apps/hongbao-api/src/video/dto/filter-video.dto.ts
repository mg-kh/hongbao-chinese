import { FilterVideoSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterVideoSchema };

export class FilterVideoDto extends createZodDto(FilterVideoSchema) {}
