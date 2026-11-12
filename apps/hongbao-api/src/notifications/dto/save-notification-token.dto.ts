import { SaveNotificationTokenSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { SaveNotificationTokenSchema };

export class SaveNotificationTokenDto extends createZodDto(
  SaveNotificationTokenSchema,
) {}
