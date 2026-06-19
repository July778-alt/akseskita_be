import { z } from "zod";

export const createReportHistorySchema = z.object({
  report_id: z.string().uuid("Invalid report ID"),
  old_status: z.string().max(20).optional().nullable(),
  new_status: z.enum([
    "pending",
    "verified",
    "in_progress",
    "resolved",
    "rejected",
  ]),
  changed_by: z.string().uuid("Invalid user ID"),
});
