import User from "../models/user.model.js";

export const sanitizeUser = async (userId) => {
    return await User.findById(userId).select("-password -refreshToken");
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options);
};

export const clearAuthCookies = (res) => {
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options);
};
