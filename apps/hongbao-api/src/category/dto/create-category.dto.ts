import { CreateCategorySchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateCategorySchema };

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
