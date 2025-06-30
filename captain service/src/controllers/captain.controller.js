import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import generateSignupOtp from "../utils/generateSignupOtp.util.js";
import {
    sanitizeCaptain,
    setCaptainCookies,
    clearCaptainCookies,
} from "../utils/captain.util.js";
import generateAccessAndRefreshToken from "../services/token.service.js";
import generateForgetPasswordToken from "../utils/generateFrogetPasswordToken.util.js";
import jwt from "jsonwebtoken";
import { pendingCaptainPolls } from "../utils/pendingRequests.util.js";
import axios from "axios";
import publishMessage from "../rabbitmq/publish.js";
import Captain from "../models/captain.model.js";

export const registerCaptain = asyncHandler(async (req, res) => {
    const { fullName, email, phone, password, vehicleNumber, vehicleType } =
        req.body;

    const existedCaptain = await Captain.findOne({
        $or: [{ email }, { phone }],
    });
    if (existedCaptain)
        throw new ApiError(409, "email or phone already exists");

    const otpSignup = generateSignupOtp();
    const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const captain = new Captain({
        fullName,
        email,
        phone,
        password,
        vehicleNumber,
        vehicleType,
        otpSignup,
        otpSignupExpiry,
    });
    await captain.save();

    const createdCaptain = await sanitizeCaptain(captain._id);
    if (!createdCaptain)
        throw new ApiError(
            500,
            "something went wrong while registering the captain"
        );

    await publishMessage("captain_exchange", "verify.signup.mail", {
        fullName,
        email: createdCaptain.email,
        otpSignup: createdCaptain.otpSignup,
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdCaptain,
                "captain registered successfully....Please verify OTP !"
            )
        );
});

export const verifyOtpSignup = asyncHandler(async (req, res) => {
    const { otpSignup } = req.body;

    const existedCaptain = await Captain.findOneAndUpdate(
        { otpSignup, otpSignupExpiry: { $gt: new Date() } },
        {
            $unset: { otpSignup: 1, otpSignupExpiry: 1 },
            $set: { isVerified: true },
        },
        { new: true }
    );
    if (!existedCaptain) throw new ApiError(400, "invalid or expired otp");

    await publishMessage("captain_exchange", "welcome.signup.mail", {
        fullName: existedCaptain.fullName,
        email: existedCaptain.email,
    });

    const { captainAccessToken, captainRefreshToken } =
        await generateAccessAndRefreshToken(existedCaptain._id);

    const captain = await sanitizeCaptain(existedCaptain._id);
    if (!captain) throw new ApiError(404, "captain not found");

    setCaptainCookies(res, captainAccessToken, captainRefreshToken);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { captain, captainAccessToken, captainRefreshToken },
                "OTP verified & captain logged in"
            )
        );
});

export const resendOtpSignup = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existedCaptain = await Captain.findOne({ email });
    if (!existedCaptain) throw new ApiError(404, "email doesn't exists");

    if (existedCaptain.isVerified)
        throw new ApiError(400, "captain is already verified");

    const isOtpExpired =
        !existedCaptain.otpSignupExpiry ||
        existedCaptain.otpSignupExpiry < new Date();
    if (isOtpExpired) {
        const otpSignup = generateSignupOtp();
        const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

        const updatedCaptain = await Captain.findByIdAndUpdate(
            existedCaptain._id,
            { $set: { otpSignup, otpSignupExpiry } },
            { new: true }
        );

        await publishMessage("captain_exchange", "verify.signup.mail", {
            fullName: updatedCaptain.fullName,
            email: updatedCaptain.email,
            otpSignup: updatedCaptain.otpSignup,
        });
    } else {
        await publishMessage("captain_exchange", "verify.signup.mail", {
            fullName: existedCaptain.fullName,
            email: existedCaptain.email,
            otpSignup: existedCaptain.otpSignup,
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "OTP resent successfully"));
});

export const loginCaptain = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existedCaptain = await Captain.findOne({ email });
    if (!existedCaptain)
        throw new ApiError(404, "captain does not exists or invalid");

    const isPasswordValid = await existedCaptain.comparePassword(password);
    if (!isPasswordValid)
        throw new ApiError(401, "invalid captain credentials");

    if (!existedCaptain.isVerified) {
        const isOtpExpired =
            !existedCaptain.otpSignupExpiry ||
            existedCaptain.otpSignupExpiry < new Date();
        if (isOtpExpired) {
            const otpSignup = generateSignupOtp();
            const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

            const updatedCaptain = await Captain.findByIdAndUpdate(
                existedCaptain._id,
                { $set: { otpSignup, otpSignupExpiry } },
                { new: true }
            );

            await publishMessage("captain_exchange", "verify.signup.mail", {
                fullName: updatedCaptain.fullName,
                email: updatedCaptain.email,
                otpSignup: updatedCaptain.otpSignup,
            });
        } else {
            await publishMessage("captain_exchange", "verify.signup.mail", {
                fullName: existedCaptain.fullName,
                email: existedCaptain.email,
                otpSignup: existedCaptain.otpSignup,
            });
        }
        throw new ApiError(
            401,
            "your email is not verified. Please check your mail for OTP."
        );
    }

    const { captainAccessToken, captainRefreshToken } =
        await generateAccessAndRefreshToken(existedCaptain._id);

    const captain = await sanitizeCaptain(existedCaptain._id);
    if (!captain) throw new ApiError(404, "captain not found");

    setCaptainCookies(res, captainAccessToken, captainRefreshToken);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { captain, captainAccessToken, captainRefreshToken },
                "captain logged in successfully"
            )
        );
});

export const forgetCaptainPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const token = generateForgetPasswordToken();
    const expiry = Date.now() + 3600000;

    const existedCaptain = await Captain.findOneAndUpdate(
        { email },
        { $set: { forgetPasswordToken: token, forgetPasswordExpiry: expiry } },
        { new: true }
    );
    if (!existedCaptain) throw new ApiError(404, "email does not exists");

    await publishMessage("captain_exchange", "verify.token.mail", {
        fullName: existedCaptain.fullName,
        email: existedCaptain.email,
        token: existedCaptain.forgetPasswordToken,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { email: existedCaptain.email },
                "token generated - check your email to reset your password"
            )
        );
});

export const resetCaptainPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!token?.trim()) throw new ApiError(400, "token is required");

    const existedCaptain = await Captain.findOne({
        forgetPasswordToken: token,
        forgetPasswordExpiry: { $gt: new Date() },
    });
    if (!existedCaptain) throw new ApiError(404, "invalid or expired token");

    existedCaptain.forgetPasswordToken = undefined;
    existedCaptain.forgetPasswordExpiry = undefined;
    existedCaptain.password = confirmPassword;
    await existedCaptain.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { email: existedCaptain.email },
                "password reset successfully. You can now log in with your new password."
            )
        );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const token =
        req.cookies?.captainRefreshToken || req.body.captainRefreshToken;
    if (!token) throw new ApiError(401, "unauthorized request");

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (!decodedToken) throw new ApiError(401, "unauthorized request");

    const existedCaptain = await Captain.findById(decodedToken?._id);
    if (!existedCaptain) throw new ApiError(401, "invalid refresh token");

    if (token !== existedCaptain?.captainRefreshToken)
        throw new ApiError(401, "refresh token is expired or used");

    const { captainAccessToken, captainRefreshToken } =
        await generateAccessAndRefreshToken(existedCaptain._id);

    const captain = await sanitizeCaptain(existedCaptain._id);
    if (!captain) throw new ApiError(404, "captain not found");

    setCaptainCookies(res, captainAccessToken, captainRefreshToken);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { captain, captainAccessToken, captainRefreshToken },
                "access token refreshed successfully"
            )
        );
});

export const logoutCaptain = asyncHandler(async (req, res) => {
    const existedCaptain = await Captain.findByIdAndUpdate(
        req.captain._id,
        { $unset: { captainRefreshToken: 1 } },
        { new: true }
    );
    if (!existedCaptain) throw new ApiError(404, "captain not found");

    clearCaptainCookies(res);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "captain logged out successfully"));
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const existedCaptain = await Captain.findById(req.captain?._id);
    if (!existedCaptain) throw new ApiError(400, "captain not found");

    const isPasswordValid = await existedCaptain.comparePassword(oldPassword);
    if (!isPasswordValid) throw new ApiError(401, "invalid old password");

    existedCaptain.password = confirmPassword;
    await existedCaptain.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password changed successfully"));
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, phone, vehicleNumber, vehicleType } = req.body;

    const existedCaptain = await Captain.findByIdAndUpdate(
        req.captain?._id,
        { $set: { fullName, phone, vehicleNumber, vehicleType } },
        { new: true }
    );

    if (!existedCaptain)
        throw new ApiError(401, "something wrong while updating account");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                existedCaptain,
                "account details updated successfully"
            )
        );
});

export const getCurrentCaptain = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.captain,
                "current captain fetched successfully"
            )
        );
});

export const deleteCaptain = asyncHandler(async (req, res) => {
    const existedCaptain = await Captain.findByIdAndDelete(req.captain?._id);
    if (!existedCaptain) throw new ApiError(404, "captain not found");

    clearCaptainCookies(res);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "current captain deleted successfully"));
});

export const waitForNewRide = asyncHandler(async (req, res) => {
    const timeoutId = setTimeout(() => {
        res.status(204).end(); // No content
        const index = pendingCaptainPolls.findIndex((p) => p.res === res);
        if (index !== -1) pendingCaptainPolls.splice(index, 1);
    }, 30000); // 30s wait

    pendingCaptainPolls.push({ res, timeoutId });
});

export const acceptRide = asyncHandler(async (req, res) => {
    const { rideId } = req.params;

    try {
        const response = await axios.patch(
            `http://localhost:5004/api/v1/ride/accept-ride/${rideId}`,
            { captainId: req.captain?._id },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${req.cookies.captainAccessToken}`,
                },
            }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    response.data,
                    "Ride accepted and ride service updated"
                )
            );
    } catch (err) {
        throw new ApiError(500, "Failed to accept ride: " + err.message);
    }
});
