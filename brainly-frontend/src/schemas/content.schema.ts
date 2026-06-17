import { z } from "zod";

export const CONTENT_TYPES = ["youtube", "twitter", "article", "document", "link"] as const;

export const contentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  link: z.string().url("Link must be a valid URL"),
  type: z.enum(CONTENT_TYPES, { message: "Please select a content type" }),
  content: z.string().max(2000, "Content is too long").optional(),
  tags: z.array(z.string()).optional(),
});

export type ContentFormValues = z.infer<typeof contentSchema>;
