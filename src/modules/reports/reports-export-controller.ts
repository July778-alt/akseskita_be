import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { getReports } from "./reports-repository";
import { parseQueryParams } from "../../shared/utils/query-parser";

export const exportReportsCSV = asyncHandler(async (req: Request, res: Response) => {
  const queryParams = parseQueryParams(req);
  // Increase limit for export
  const reports = await getReports({ ...queryParams, limit: 1000 });

  const headers = ["ID", "Title", "Status", "Category", "Author", "Created At", "Address"];
  const rows = reports.map((r: any) => [
    r.id,
    `"${r.title.replace(/"/g, '""')}"`,
    r.status,
    r.category_name,
    r.full_name,
    r.created_at,
    `"${(r.address || "").replace(/"/g, '""')}"`,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row: any[]) => row.join(",")),
  ].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=reports-export-${Date.now()}.csv`);
  
  return res.send(csvContent);
});
