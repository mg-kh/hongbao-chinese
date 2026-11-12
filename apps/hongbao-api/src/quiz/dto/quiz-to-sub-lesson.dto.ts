import { QuizToSubLessonSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { QuizToSubLessonSchema };

export class QuizToSubLessonDto extends createZodDto(QuizToSubLessonSchema) {}
