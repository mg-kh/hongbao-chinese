import { FilterShopSchema } from '@repo/shared';
import { createZodDto } from 'nestjs-zod';

export { FilterShopSchema };
export { ProductType } from '@repo/shared';

export class FilterShopDto extends createZodDto(FilterShopSchema) {}
