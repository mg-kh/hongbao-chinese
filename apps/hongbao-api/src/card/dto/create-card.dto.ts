import { CreateCardSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateCardSchema };

export class CreateCardDto extends createZodDto(CreateCardSchema) {}
