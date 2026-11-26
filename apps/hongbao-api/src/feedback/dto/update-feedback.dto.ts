import { UpdateFeedbackSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export class UpdateFeedbackDto extends createZodDto(UpdateFeedbackSchema) {}
