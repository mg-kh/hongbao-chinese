import { CreateFlashcardSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateFlashcardSchema };

export class CreateFlashcardDto extends createZodDto(CreateFlashcardSchema) {}
