import { FilterFlashcardSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export class FilterClientFlashcardDto extends createZodDto(
  FilterFlashcardSchema,
) {}
