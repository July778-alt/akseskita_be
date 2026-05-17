import { appEvents, EVENTS } from "../../shared/utils/events";
import * as repo from "./notifications-repository";
import { getReportOwner } from "../reports/reports-repository";

/**
 * Initializes notification listeners for system-wide events
 */
export function initNotificationListeners() {
  // Listen for report status updates
  appEvents.on(EVENTS.REPORT.STATUS_UPDATED, async (data: {
    reportId: string;
    oldStatus: string;
    newStatus: string;
    moderatorId: string;
  }) => {
    try {
      const reportOwner = await getReportOwner(data.reportId);
      
      if (reportOwner) {
        await repo.createNotification({
          user_id: reportOwner.user_id,
          title: "Report Status Updated",
          message: `Your report status has changed from ${data.oldStatus} to ${data.newStatus}.`,
          type: "report_status",
          reference_id: data.reportId
        });
      }
    } catch (error) {
      console.error("Failed to process status update notification:", error);
    }
  });

  // Listen for new comments
  appEvents.on(EVENTS.REPORT.COMMENT_ADDED, async (data: {
    reportId: string;
    authorId: string;
    content: string;
  }) => {
    try {
      const reportOwner = await getReportOwner(data.reportId);
      
      // Notify owner if the comment is from someone else
      if (reportOwner && reportOwner.user_id !== data.authorId) {
        await repo.createNotification({
          user_id: reportOwner.user_id,
          title: "New Follow-up on Your Report",
          message: "Someone has added a comment to your infrastructure report.",
          type: "comment",
          reference_id: data.reportId
        });
      }
    } catch (error) {
      console.error("Failed to process comment notification:", error);
    }
  });
}
