import { QuizToMockTestSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { QuizToMockTestSchema };

export class QuizToMockTestDto extends createZodDto(QuizToMockTestSchema) {}
