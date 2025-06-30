import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { fileSize } from "./constants.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";
import attachUser from "./middlewares/attachUser.middleware.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true, limit: fileSize }));
app.use(express.json({ limit: fileSize }));
app.use(express.static("public"));
app.use(cookieParser());

// attach req.user from x-user-data header
app.use(attachUser);

// routes import
import userRouter from "./routes/user.route.js";

// routes define
app.use("/api/v1/user", userRouter);

// global error handler - one last middleware
app.use(errorMiddleware);

export default app;
