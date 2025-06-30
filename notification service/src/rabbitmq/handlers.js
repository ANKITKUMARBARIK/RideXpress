import verifySignupMail from "../services/verifySignupMail.service.js";
import welcomeSignupMail from "../services/welcomeSignupMail.service.js";
import tokenVerifyMail from "../services/tokenVerifyMail.service.js";

export const handleSignupMailEvent = async (data) => {
    try {
        const { fullName, email, otpSignup } = data;

        await verifySignupMail(fullName, email, otpSignup);
    } catch (error) {
        console.error(
            "Error while handling auth.verify.signup event:",
            error?.message
        );
    }
};

export const handleWelcomeMailEvent = async (data) => {
    try {
        const { fullName, email } = data;

        await welcomeSignupMail(fullName, email);
    } catch (error) {
        console.error(
            "Error while handling auth.welcome.signup event:",
            error?.message
        );
    }
};

export const handleTokenMailEvent = async (data) => {
    try {
        const { fullName, email, token } = data;

        await tokenVerifyMail(fullName, email, token);
    } catch (error) {
        console.error(
            "Error while handling auth.verify.token event:",
            error?.message
        );
    }
};
