import {
  createReport,
  getReportById,
  countReports,
  getReports,
  deleteReport,
  getReportOwner,
  updateReport,
  createReportHistory,
  updateReportStatus,
  getReportHistories,
} from "./reports-repository";

import { CreateReportDTO } from "./reports-types";

export async function createReportService(
  userId: string,
  data: CreateReportDTO
) {
  return createReport(userId, data);
}

export async function getReportsService(
  queryParams: any
) {
  const reports =
    await getReports(queryParams);

  const total =
    await countReports(queryParams);

  return {
    reports,
    pagination: {
      total,
      page: Number(
        queryParams.page || 1
      ),

      limit: Number(
        queryParams.limit || 10
      ),

      total_pages: Math.ceil(
        total /
          Number(
            queryParams.limit || 10
          )
      ),
    },
  };
}

export async function getReportByIdService(
  reportId: string
) {
  const report = await getReportById(
    reportId
  );

  if (!report) {
    throw new Error("Report not found");
  }

  return report;
}

export async function updateReportService(
  reportId: string,
  userId: string,
  userRole: string,
  data: any
) {
  const reportOwner =
    await getReportOwner(reportId);

  if (!reportOwner) {
    throw new Error("Report not found");
  }

  const isOwner =
    reportOwner.user_id === userId;

  const isAdmin = [
    "admin",
    "super_admin",
  ].includes(userRole);

  if (!isOwner && !isAdmin) {
    throw new Error(
      "You cannot edit this report"
    );
  }

  return updateReport(reportId, data);
}

export async function deleteReportService(
  reportId: string,
  userId: string,
  userRole: string
) {
  const reportOwner =
    await getReportOwner(reportId);

  if (!reportOwner) {
    throw new Error("Report not found");
  }

  const isOwner =
    reportOwner.user_id === userId;

  const isAdmin = [
    "admin",
    "super_admin",
  ].includes(userRole);

  if (!isOwner && !isAdmin) {
    throw new Error(
      "You cannot delete this report"
    );
  }

  await deleteReport(reportId);
}

export async function updateStatusService(
  reportId: string,
  status: string,
  changedBy: string
) {
  const report =
    await getReportById(reportId);

  if (!report) {
    throw new Error("Report not found");
  }

  const updatedReport =
    await updateReportStatus(
      reportId,
      status
    );

  await createReportHistory(
    reportId,
    report.status,
    status,
    changedBy
  );

  return updatedReport;
}

export async function getReportHistoriesService(
  reportId: string
) {
  return getReportHistories(reportId);
}