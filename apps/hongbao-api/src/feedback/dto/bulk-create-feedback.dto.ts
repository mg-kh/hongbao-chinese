import { BulkCreateFeedbackSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { BulkCreateFeedbackSchema };

export class BulkCreateFeedbackDto extends createZodDto(
  BulkCreateFeedbackSchema,
) {}
