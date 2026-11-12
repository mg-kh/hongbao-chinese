import { FilterQuestionSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterQuestionSchema };

export class FilterQuestionDto extends createZodDto(FilterQuestionSchema) {}
