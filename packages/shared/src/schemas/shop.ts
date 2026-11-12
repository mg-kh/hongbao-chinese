import { z } from "zod";
import { ProductType } from "../enums.js";

export const FilterShopSchema = z.object({
  type: z.enum(ProductType).default(ProductType.ALL),
  categoryId: z.string().nullish(),
});
export type FilterShopQuery = z.input<typeof FilterShopSchema>;
