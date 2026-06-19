import * as repo from "./notifications-repository";

export async function notifyUser(data: {
  user_id: string;
  title: string;
  message: string;
  type: string;
  reference_id?: string;
}) {
  return repo.createNotification(data);
}

export async function getUserNotifications(userId: string, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const notifications = await repo.getNotifications(userId, limit, offset);
  const unreadCount = await repo.getUnreadCount(userId);

  return {
    notifications,
    unread_count: unreadCount,
  };
}

export async function readNotification(id: string, userId: string) {
  return repo.markAsRead(id, userId);
}

export async function readAllNotifications(userId: string) {
  return repo.markAllAsRead(userId);
}

export async function removeNotification(id: string, userId: string) {
  return repo.deleteNotification(id, userId);
}

export async function removeAllNotifications(userId: string) {
  return repo.deleteAllNotifications(userId);
}
