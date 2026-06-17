import { z } from "zod";

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(30, "Tag name is too long")
    .regex(/^[a-zA-Z0-9-]+$/, "Tag can only contain letters, numbers, and hyphens"),
});

export type TagFormValues = z.infer<typeof tagSchema>;
