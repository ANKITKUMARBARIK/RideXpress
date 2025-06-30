import express from "express";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import verifyAuthentication from "./middlewares/authentication.middleware.js";

const app = express();

app.use(cookieParser());

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

// user service
app.use(
    "/api/v1/user",
    verifyAuthentication,
    proxy(process.env.USER_SERVICE, {
        proxyReqPathResolver: (req) => {
            return `/api/v1/user${req.url}`;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            const user = srcReq.user;
            if (user) {
                proxyReqOpts.headers["x-user-data"] = encodeURIComponent(
                    JSON.stringify(user)
                );
            }
            return proxyReqOpts;
        },
        proxyErrorHandler: (err, res, next) => {
            console.error("User Proxy Error:", err.message);
            next(err);
        },
    })
);

// captain service
app.use(
    "/api/v1/captain",
    proxy(process.env.CAPTAIN_SERVICE, {
        proxyReqPathResolver: (req) => {
            return `/api/v1/captain${req.url}`;
        },
        proxyErrorHandler: (err, res, next) => {
            console.error("Captain Proxy Error:", err.message);
            next(err);
        },
    })
);

// user service
app.use(
    "/api/v1/ride",
    verifyAuthentication,
    proxy(process.env.RIDE_SERVICE, {
        proxyReqPathResolver: (req) => {
            return `/api/v1/ride${req.url}`;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            const user = srcReq.user;
            if (user) {
                proxyReqOpts.headers["x-user-data"] = encodeURIComponent(
                    JSON.stringify(user)
                );
            }
            return proxyReqOpts;
        },
        proxyErrorHandler: (err, res, next) => {
            console.error("Ride Proxy Error:", err.message);
            next(err);
        },
    })
);

export default app;
