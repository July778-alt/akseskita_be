import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().min(3).optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(["user", "admin", "super_admin"]),
});