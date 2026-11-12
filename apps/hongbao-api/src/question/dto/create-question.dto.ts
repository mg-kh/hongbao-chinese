import { CreateQuestionSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateQuestionSchema };
export { JsonSchema, type Json } from '@repo/shared';

export class CreateQuestionDto extends createZodDto(CreateQuestionSchema) {}
