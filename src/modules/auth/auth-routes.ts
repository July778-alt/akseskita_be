import { Router } from "express";

import { validate } from "../../middlewares/validate-middleware";

import {
  loginSchema,
  registerSchema,
} from "./auth-validation";

import {
  loginController,
  registerController,
} from "./auth-controller";


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

export default router;