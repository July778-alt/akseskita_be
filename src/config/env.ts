import dotenv from "dotenv";

import {
  cleanEnv,
  num,
  str,
} from "envalid";

dotenv.config();

export const env = cleanEnv(
  process.env,

  {
    PORT: num(),
    DB_HOST: str(),
    DB_PORT: num(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    JWT_SECRET: str(),
  }
);