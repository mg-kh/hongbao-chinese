import { FilterClientCardSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterClientCardSchema };

export class FilterClientCardDto extends createZodDto(FilterClientCardSchema) {}
