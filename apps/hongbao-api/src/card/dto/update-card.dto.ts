import { UpdateCardSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { UpdateCardSchema };

export class UpdateCardDto extends createZodDto(UpdateCardSchema) {}
