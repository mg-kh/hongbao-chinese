import { z } from "zod";

const RowSchema = z.object({
  text: z.string().min(1),
  phinyin: z.string().min(1),
});

const PageSchema = z.object({
  rows: z.array(RowSchema),
});

export const CreateHanziGridSchema = z.object({
  website_name: z.string().min(1),
  website_type: z.string().min(1),
  pages: z.array(PageSchema),
});
export type FormField = z.infer<typeof CreateHanziGridSchema>;
export type PageField = z.infer<typeof PageSchema>;
export type RowField = z.infer<typeof RowSchema>;
