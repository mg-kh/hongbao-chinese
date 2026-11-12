import { UpdateLevelTestSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { UpdateLevelTestSchema };

export class UpdateLevelTestDto extends createZodDto(UpdateLevelTestSchema) {}
