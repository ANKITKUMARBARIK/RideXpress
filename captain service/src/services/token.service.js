import jwt from "jsonwebtoken";
import Captain from "../models/captain.model.js";
import ApiError from "../utils/ApiError.util.js";

const generateAccessToken = (captain) => {
    return jwt.sign(
        {
            _id: captain._id,
            fullName: captain.fullName,
            email: captain.email,
            role: captain.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

const generateRefreshToken = (captain) => {
    return jwt.sign(
        {
            _id: captain._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

const generateAccessAndRefreshToken = async (captainId) => {
    try {
        const captain = await Captain.findById(captainId);
        if (!captain) throw new ApiError(404, "captain not found");

        const captainAccessToken = generateAccessToken(captain);
        const captainRefreshToken = generateRefreshToken(captain);

        captain.captainRefreshToken = captainRefreshToken;
        await captain.save({ validateBeforeSave: false });

        return { captainAccessToken, captainRefreshToken };
    } catch (error) {
        console.error("error generating tokens ", error);
        throw new ApiError(
            500,
            "something went wrong while generating refresh and access token"
        );
    }
};

export default generateAccessAndRefreshToken;
