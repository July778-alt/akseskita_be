import {
  createUser,
  findUserByEmail,
} from "./auth-repository";

import {
  comparePassword,
  hashPassword,
} from "../../shared/helpers/hash";

import { generateToken } from "../../shared/helpers/jwt";

import {
  LoginDTO,
  RegisterDTO,
} from "./auth-types";

import { findUserById } from "./auth-repository";

export async function registerService(
  data: RegisterDTO
) {
  const existingUser = await findUserByEmail(
    data.email
  );

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(
    data.password
  );

  const user = await createUser({
    ...data,
    password: hashedPassword,
  });

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return {
    user,
    token,
  };
}

export async function loginService(
  data: LoginDTO
) {
  const user = await findUserByEmail(
    data.email
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid =
    await comparePassword(
      data.password,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },

    token,
  };
}

export async function meService(
  userId: string
) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}