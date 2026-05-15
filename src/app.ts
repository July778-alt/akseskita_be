import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { apiLimiter } from "./config/rate-limit";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error-middleware";

const app = express();

app.use(helmet());

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

app.use("/api", apiLimiter);

app.use("/api", routes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;