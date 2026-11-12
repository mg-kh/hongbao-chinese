import { CreateLevelTestSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateLevelTestSchema };

export class CreateLevelTestDto extends createZodDto(CreateLevelTestSchema) {}
