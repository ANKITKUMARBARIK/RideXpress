import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import jwt from "jsonwebtoken";
import Captain from "../models/captain.model.js";

const verifyAuthentication = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.captainAccessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) throw new ApiError(401, "unauthorized request");

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) throw new ApiError(401, "unauthorized request");

        const captain = await Captain.findById(decodedToken?._id).select(
            "-password -captainRefreshToken"
        );
        if (!captain) throw new ApiError(401, "invalid access token");

        req.captain = captain;

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token");
    }
});

export default verifyAuthentication;
