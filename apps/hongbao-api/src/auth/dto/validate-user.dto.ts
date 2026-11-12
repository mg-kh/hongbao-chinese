import { ValidateUserSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { ValidateUserSchema };

export class ValidateUserDto extends createZodDto(ValidateUserSchema) {}
