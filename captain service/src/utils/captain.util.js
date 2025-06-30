import Captain from "../models/captain.model.js";

export const sanitizeCaptain = async (captainId) => {
    return await Captain.findById(captainId).select(
        "-password -captainRefreshToken"
    );
};

export const setCaptainCookies = (
    res,
    captainAccessToken,
    captainRefreshToken
) => {
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .cookie("captainAccessToken", captainAccessToken, options)
        .cookie("captainRefreshToken", captainRefreshToken, options);
};

export const clearCaptainCookies = (res) => {
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .clearCookie("captainAccessToken", options)
        .clearCookie("captainRefreshToken", options);
};
