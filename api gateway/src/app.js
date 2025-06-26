import express from "express";
import proxy from "express-http-proxy";
import verifyAuthentication from "./middlewares/authentication.middleware.js";

const app = express();

// auth service
app.use(
    "/api/v1/auth",
    proxy(process.env.AUTH_SERVICE, {
        proxyReqPathResolver: (req) => {
            return `/api/v1/auth${req.url}`;
        },
        proxyErrorHandler: (err, res, next) => {
            console.error("Auth Proxy Error:", err.message);
            next(err);
        },
    })
);

export default app;
