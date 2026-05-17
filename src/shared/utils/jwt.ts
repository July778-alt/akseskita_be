import jwt from "jsonwebtoken";

import { config } from "../../config/env";

type Payload = {
  id: string;
  role: string;
};

export function generateToken(payload: Payload) {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, config.JWT_SECRET);
}