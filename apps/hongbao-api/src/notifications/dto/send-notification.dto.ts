import { SendNotificationSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { SendNotificationSchema };

export class SendNotificationDto extends createZodDto(SendNotificationSchema) {}
