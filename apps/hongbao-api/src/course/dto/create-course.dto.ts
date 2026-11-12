import { CreateCourseSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateCourseSchema };

export class CreateCourseDto extends createZodDto(CreateCourseSchema) {}
