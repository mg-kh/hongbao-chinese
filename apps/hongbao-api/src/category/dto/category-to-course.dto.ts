import { CategoryToCourseSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CategoryToCourseSchema };

export class CategoryToCourseDto extends createZodDto(CategoryToCourseSchema) {}
