import { Router } from "express";

import { validate } from "../../middlewares/validate-middleware";

import {
  loginSchema,
  registerSchema,
} from "./auth-validation";

import {
  loginController,
  meController,
  registerController,
} from "./auth-controller";

import { authMiddleware } from "../../middlewares/auth-middleware";


const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  registerController
);

router.post(
  "/login",
  validate(loginSchema),
  loginController
);

router.get(
  "/me",
  authMiddleware,
  meController
);

export default router;