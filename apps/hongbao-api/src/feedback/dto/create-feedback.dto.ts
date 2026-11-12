import { CreateFeedbackSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateFeedbackSchema };

export class CreateFeedbackDto extends createZodDto(CreateFeedbackSchema) {}
