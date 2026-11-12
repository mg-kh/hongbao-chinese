import { FilterLessonSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterLessonSchema };

export class FilterLessonDto extends createZodDto(FilterLessonSchema) {}
