import { CreateMockTestSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { CreateMockTestSchema };

export class CreateMockTestDto extends createZodDto(CreateMockTestSchema) {}
