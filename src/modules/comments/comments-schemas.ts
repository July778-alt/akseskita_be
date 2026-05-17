import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
  }),
  params: z.object({
    reportId: z.string().uuid("Invalid report ID"),
  }),
});

export type CreateCommentDTO = z.infer<typeof createCommentSchema>["body"];
