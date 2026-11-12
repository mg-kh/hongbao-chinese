import { FilterClientFlashcardSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterClientFlashcardSchema };

export class FilterClientFlashcardDto extends createZodDto(
  FilterClientFlashcardSchema,
) {}
