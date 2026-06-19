import { z } from "zod";

// Simple and flat schemas for the final project
export const createReportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category_id: z.string().uuid("Invalid category ID"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  address: z.string().optional(),
});


export const updateStatusSchema = z.object({
  status: z.enum([
    "pending",
    "verified",
    "in_progress",
    "resolved",
    "rejected",
  ]),
});