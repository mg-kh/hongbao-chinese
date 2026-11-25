import { FilterFlashcardSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterFlashcardSchema };

export class FilterFlashcardDto extends createZodDto(FilterFlashcardSchema) {}
