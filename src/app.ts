import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { logger } from "./config/logger";
import routes from "./routes";
import { apiLimiter } from "./config/rate-limit";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error-middleware";
import { db } from "./database";

import { config } from "./config/env";

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: true, // Allow all origins for dev/Expo Web
  credentials: true,
}));

// Route HTTP request logs through our custom logger
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", { stream: logger.stream }));

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/health", async (req, res) => {
  let dbStatus = "UP";
  try {
    await db.query("SELECT 1");
  } catch (e) {
    dbStatus = "DOWN";
  }

  res.status(dbStatus === "UP" ? 200 : 503).json({
    status: dbStatus === "UP" ? "UP" : "DEGRADED",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api", apiLimiter);

app.use("/api", routes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;