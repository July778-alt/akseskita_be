import { Request } from "express";

export interface ParsedQuery {
  page: number;
  limit: number;
  offset: number;
  search: string;
  status?: string;
  category_id?: string;
  user_id?: string;
}

export const parseQueryParams = (req: Request): ParsedQuery => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10));
  const offset = (page - 1) * limit;
  const search = (req.query.search as string) || "";
  const status = req.query.status as string;
  const category_id = req.query.category_id as string;
  const user_id = req.query.user_id as string;

  return {
    page,
    limit,
    offset,
    search,
    status,
    category_id,
    user_id,
  };
};
