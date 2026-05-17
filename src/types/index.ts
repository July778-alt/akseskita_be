export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export enum ReportStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

export interface JwtPayload {
  id: string;
  role: UserRole;
  email: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReportStatus;
  category_id?: string;
}
