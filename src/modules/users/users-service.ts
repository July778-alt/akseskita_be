import {
  deleteUser,
  getUserById,
  getUsers,
  countUsers,
  updateUser,
  updateUserRole,
} from "./users-repository";
import { storage } from "../../shared/utils/storage";

export async function updateRoleService(userId: string, role: string) {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await updateUserRole(userId, role);
  return {
    ...updatedUser,
    profile_picture: storage.getFileUrl(updatedUser.profile_picture),
  };
}

export async function getUsersService(params: any = {}) {
  const users = await getUsers(params);
  const total = await countUsers(params);
  
  const page = Number(params.page || 1);
  const limit = Number(params.limit || 10);

  return {
    users: users.map((u: any) => ({
      ...u,
      profile_picture: storage.getFileUrl(u.profile_picture),
    })),
    pagination: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    },
  };
}

export async function getUserByIdService(userId: string) {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    ...user,
    profile_picture: storage.getFileUrl(user.profile_picture),
  };
}

export async function updateProfileService(userId: string, data: any) {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await updateUser(userId, data);
  return {
    ...updatedUser,
    profile_picture: storage.getFileUrl(updatedUser.profile_picture),
  };
}

export async function deleteUserService(userId: string, currentUserId: string, currentUserRole: string) {
  if (userId === currentUserId) {
    throw new Error("You cannot delete your own account");
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (currentUserRole === "admin" && (user.role === "admin" || user.role === "super_admin")) {
    throw new Error("Admins can only delete regular users");
  }

  await deleteUser(userId);
}