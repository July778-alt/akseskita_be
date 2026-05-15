import {
  getDashboardStats,
  getMostReportedCategory,
  getReportsPerMonth,
  getTotalCategories,
  getTotalUsers,
} from "./dashboard-repository";

export async function getDashboardService() {
  const stats =
    await getDashboardStats();

  const users =
    await getTotalUsers();

  const categories =
    await getTotalCategories();

  const mostReportedCategory =
    await getMostReportedCategory();

  const reportsPerMonth =
    await getReportsPerMonth();

  return {
    ...stats,

    ...users,

    ...categories,

    most_reported_category:
      mostReportedCategory || null,

    reports_per_month:
      reportsPerMonth,
  };
}