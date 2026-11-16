import { UpdateMockTestSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { UpdateMockTestSchema };

export class UpdateMockTestDto extends createZodDto(UpdateMockTestSchema) {}
