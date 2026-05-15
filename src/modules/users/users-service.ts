import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./users-repository";

export async function getUsersService() {
  return getUsers();
}

export async function getUserByIdService(
  userId: string
) {
  const user =
    await getUserById(userId);

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  return user;
}

export async function updateProfileService(
  userId: string,
  data: any
) {
  const user =
    await getUserById(userId);

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  return updateUser(userId, data);
}

export async function deleteUserService(
  userId: string
) {
  const user =
    await getUserById(userId);

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  await deleteUser(userId);
}