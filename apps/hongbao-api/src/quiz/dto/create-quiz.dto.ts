import { CreateQuizSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateQuizSchema };

export class CreateQuizDto extends createZodDto(CreateQuizSchema) {}
