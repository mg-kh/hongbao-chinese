import { CreateSubLessonSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateSubLessonSchema };

export class CreateSubLessonDto extends createZodDto(CreateSubLessonSchema) {}
