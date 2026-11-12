import { CreateLessonSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateLessonSchema };

export class CreateLessonDto extends createZodDto(CreateLessonSchema) {}
