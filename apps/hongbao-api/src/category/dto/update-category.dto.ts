import { UpdateCategorySchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { UpdateCategorySchema };

export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
