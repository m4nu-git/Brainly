import z from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID format");

export const createTagSchema = z.object({
  name: z
    .string({ required_error: "Tag name is required" })
    .trim()
    .min(1, "Tag name is required")
    .max(50, "Tag name must be at most 50 characters"),
});

export const tagIdParamSchema = z.object({
  id: objectId,
});
