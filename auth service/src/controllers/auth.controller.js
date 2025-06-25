import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../services/cloudinary.service.js";
import generateSignupOtp from "../utils/generateSignupOtp.util.js";
import { sanitizeUser, setAuthCookies } from "../utils/auth.util.js";
import verifySignupMail from "../services/verifySignupMail.service.js";
import welcomeSignupMail from "../services/welcomeSignupMail.service.js";
import generateAccessAndRefreshToken from "../services/token.service.js";
import User from "../models/user.model.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password, bio, timezone } = req.body;

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser)
        throw new ApiError(409, "username or email already exists");

    let avatarLocalPath, coverImageLocalPath, avatar, coverImage;
    if (
        req.files &&
        Array.isArray(req.files.avatar) &&
        req.files.avatar.length > 0
    ) {
        avatarLocalPath = req.files.avatar[0].buffer;
        avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar?.url) throw new ApiError(400, "avatar upload failed");
    } else {
        avatar = {
            url: `${req.protocol}://${req.get("host")}/images/default.png`,
        };
    }

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files.coverImage[0].buffer;
        coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }

    const otpSignup = generateSignupOtp();
    const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = new User({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        bio,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        timezone,
        otpSignup,
        otpSignupExpiry,
    });
    try {
        await user.save();
    } catch (error) {
        console.log("user creation failed");
        if (avatar?.public_id) await deleteFromCloudinary(avatar.public_id);
        if (coverImage?.public_id)
            await deleteFromCloudinary(coverImage.public_id);
        throw new ApiError(
            500,
            "error saving user to database and images were deleted"
        );
    }

    const createdUser = await sanitizeUser(user._id);
    if (!createdUser)
        throw new ApiError(
            500,
            "something went wrong while registering the user"
        );

    await verifySignupMail(
        createdUser.fullName,
        createdUser.email,
        createdUser.otpSignup
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdUser,
                "user registered successfully....Please verify OTP !"
            )
        );
});

export const verifyOtpSignup = asyncHandler(async (req, res) => {
    const { otpSignup } = req.body;

    const existedUser = await User.findOneAndUpdate(
        { otpSignup, otpSignupExpiry: { $gt: new Date() } },
        {
            $unset: { otpSignup: 1, otpSignupExpiry: 1 },
            $set: { isVerified: true },
        },
        { new: true }
    );
    if (!existedUser) throw new ApiError(400, "invalid or expired otp");

    await welcomeSignupMail(existedUser.fullName, existedUser.email);

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        existedUser._id
    );

    const user = await sanitizeUser(existedUser._id);
    if (!user) throw new ApiError(404, "user not found");

    setAuthCookies(res, accessToken, refreshToken);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user, accessToken, refreshToken },
                "OTP verified & user logged in"
            )
        );
});

export const resendOtpSignup = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existedUser = await User.findOne({ email });
    if (!existedUser) throw new ApiError(404, "email doesn't exists");

    if (existedUser.isVerified)
        throw new ApiError(400, "user is already verified");

    const isOtpExpired =
        !existedUser.otpSignupExpiry ||
        existedUser.otpSignupExpiry < new Date();
    if (isOtpExpired) {
        const otpSignup = generateSignupOtp();
        const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

        const updatedUser = await User.findByIdAndUpdate(
            existedUser._id,
            { $set: { otpSignup, otpSignupExpiry } },
            { new: true }
        );

        await verifySignupMail(
            updatedUser.fullName,
            updatedUser.email,
            updatedUser.otpSignup
        );
    } else {
        await verifySignupMail(
            existedUser.fullName,
            existedUser.email,
            existedUser.otpSignup
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "OTP resent successfully"));
});
