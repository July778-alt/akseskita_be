export interface CreateReportHistoryDTO {
  report_id: string;
  old_status?: string | null;
  new_status: string;
  changed_by: string;
}
