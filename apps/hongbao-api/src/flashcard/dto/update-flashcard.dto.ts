import { UpdateFlashcardSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { UpdateFlashcardSchema };

export class UpdateFlashcardDto extends createZodDto(UpdateFlashcardSchema) {}
