import {
  createReport,
  getReportById,
  countReports,
  getReports,
  deleteReport,
  getReportOwner,
  updateReportStatus,
} from "./reports-repository";

import { createReportHistory } from "../report-histories/report-histories-repository";

import { CreateReportDTO } from "./reports-types";
import { db } from "../../database";
import { storage } from "../../shared/utils/storage";
import { notifyUser } from "../notifications/notifications-service";

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
    reports: reports.map((r: any) => ({
      ...r,
      image_url: storage.getFileUrl(r.image_url),
    })),
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

  return {
    ...report,
    image_url: storage.getFileUrl(report.image_url),
  };
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
  return await db.transaction(async (client) => {
    const report = await getReportById(reportId);

    if (!report) {
      throw new Error("Report not found");
    }

    // Tingkatan status (Rank) untuk mencegah penurunan status (downgrade)
    // pending (1) -> verified (2) -> in_progress (3) -> resolved / rejected (4)
    const STATUS_RANKS: Record<string, number> = {
      pending: 1,
      verified: 2,
      in_progress: 3,
      resolved: 4,
      rejected: 4,
    };

    const currentRank = STATUS_RANKS[report.status] || 0;
    const newRank = STATUS_RANKS[status] || 0;

    // Jika status baru lebih rendah atau sama dengan status saat ini, tolak!
    if (newRank <= currentRank) {
      throw new Error(
        `Tidak dapat mengubah status dari '${report.status}' menjadi '${status}'. Status laporan hanya boleh maju ke tahap berikutnya.`
      );
    }

    const updatedReport = await updateReportStatus(
      reportId,
      status,
      client
    );

    await createReportHistory(
      {
        report_id: reportId,
        old_status: report.status,
        new_status: status,
        changed_by: changedBy,
      },
      client
    );

    if (report.user_id !== changedBy) {
      await notifyUser({
        user_id: report.user_id,
        title: "Report Status Updated",
        message: `Your report '${report.title}' status has changed to ${status.replace("_", " ")}.`,
        type: "report_status",
        reference_id: reportId,
      }).catch(err => console.error("Failed to send notification:", err));
    }

    return updatedReport;
  });
}