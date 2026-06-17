import z from "zod";

export const shareBrainSchema = z.object({
  share: z.boolean({
    required_error: "share field is required",
    invalid_type_error: "share must be a boolean",
  }),
});
