import { FilterSubLessonSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterSubLessonSchema };

export class FilterSubLessonDto extends createZodDto(FilterSubLessonSchema) {}
