import { BulkCreateCardSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { BulkCreateCardSchema };

export class BulkCreateCardDto extends createZodDto(BulkCreateCardSchema) {}
