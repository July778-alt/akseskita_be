import jwt from "jsonwebtoken";

import { env } from "../../config/env";

type Payload = {
  id: string;
  role: string;
};

export function generateToken(payload: Payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}