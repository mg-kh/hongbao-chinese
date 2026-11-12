import { CreateVideoSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateVideoSchema };

export class CreateVideoDto extends createZodDto(CreateVideoSchema) {}
