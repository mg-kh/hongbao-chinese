import { QuizToLessonSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { QuizToLessonSchema };

export class QuizToLessonDto extends createZodDto(QuizToLessonSchema) {}
