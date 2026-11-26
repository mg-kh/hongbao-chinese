import { FilterCardSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterCardSchema };

export class FilterCardDto extends createZodDto(FilterCardSchema) {}
