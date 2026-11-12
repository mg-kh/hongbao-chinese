import { CreateQuizSectionSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateQuizSectionSchema };

export class CreateQuizSectionDto extends createZodDto(
  CreateQuizSectionSchema,
) {}
