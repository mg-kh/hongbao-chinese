import { QuizToLevelTestSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { QuizToLevelTestSchema };

export class QuizToLevelTestDto extends createZodDto(QuizToLevelTestSchema) {}
