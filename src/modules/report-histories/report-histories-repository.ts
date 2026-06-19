import { db } from "../../database";
import { PoolClient } from "pg";
import { CreateReportHistoryDTO } from "./report-histories-types";

export async function createReportHistory(
  data: CreateReportHistoryDTO,
  client?: PoolClient
) {
  const query = `
    INSERT INTO report_histories (
      report_id,
      old_status,
      new_status,
      changed_by
    )
    VALUES ($1, $2, $3, $4)
  `;

  const values = [
    data.report_id,
    data.old_status || null,
    data.new_status,
    data.changed_by,
  ];

  const executor = client || db;
  await executor.query(query, values);
}

export async function getReportHistories(
  reportId: string
) {
  const query = `
    SELECT
      report_histories.id,
      report_histories.old_status,
      report_histories.new_status,
      report_histories.created_at,
      users.full_name
    FROM report_histories
    JOIN users
      ON report_histories.changed_by = users.id
    WHERE report_histories.report_id = $1
    ORDER BY report_histories.created_at ASC
  `;

  const result = await db.query(query, [
    reportId,
  ]);

  return result.rows;
}
