import { z } from "zod";

export const createReportSchema =
  z.object({
    title: z.string().min(5),

    description: z.string().min(10),

    category_id: z.uuid(),

    latitude: z.coerce.number().optional(),

    longitude: z.coerce.number().optional(),

    address: z.string().optional(),
  });

export const updateReportSchema =
  createReportSchema.partial();

export const updateStatusSchema =
  z.object({
    status: z.enum([
      "pending",
      "verified",
      "in_progress",
      "resolved",
      "rejected",
    ]),
  });