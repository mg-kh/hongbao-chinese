import { QuizToCourseSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { QuizToCourseSchema };

export class QuizToCourseDto extends createZodDto(QuizToCourseSchema) {}
