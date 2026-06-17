import z from "zod";

export const CONTENT_TYPES = [
  "youtube",
  "twitter",
  "article",
  "document",
  "link",
] as const;

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID format");

export const addContentSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  link: z
    .string({ required_error: "Link is required" })
    .url("Link must be a valid URL"),
  type: z.enum(CONTENT_TYPES, {
    errorMap: () => ({
      message: `Type must be one of: ${CONTENT_TYPES.join(", ")}`,
    }),
  }),
  content: z.string().trim().max(5000).optional().default(""),
  tags: z.array(objectId, { invalid_type_error: "Tags must be an array of IDs" }).optional().default([]),
});

export const updateContentSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  link: z.string().url("Link must be a valid URL").optional(),
  type: z.enum(CONTENT_TYPES).optional(),
  content: z.string().trim().max(5000).optional(),
  tags: z.array(objectId).optional(),
});

export const deleteContentSchema = z.object({
  contentId: objectId,
});

export const contentIdParamSchema = z.object({
  id: objectId,
});

export const contentQuerySchema = z.object({
  type: z.enum(CONTENT_TYPES).optional(),
  tag: objectId.optional(),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ContentQuery = z.infer<typeof contentQuerySchema>;
