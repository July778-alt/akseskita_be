import { PoolClient } from "pg";
import {
  createReportHistory,
  getReportHistories,
} from "./report-histories-repository";
import { CreateReportHistoryDTO } from "./report-histories-types";

export async function createReportHistoryService(
  data: CreateReportHistoryDTO,
  client?: PoolClient
) {
  return createReportHistory(data, client);
}

export async function getReportHistoriesService(
  reportId: string
) {
  return getReportHistories(reportId);
}
