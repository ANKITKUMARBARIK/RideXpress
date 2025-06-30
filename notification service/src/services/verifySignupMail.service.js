import sgMail from "../config/mail.config.js";
import { promises as fs } from "fs";
import path from "path";

const verifySignupMail = async (fullName, email, otpSignup) => {
    try {
        const filePath = path.resolve(
            "src/mails/templates/verifySignupMail.html"
        );
        const htmlContent = await fs.readFile(filePath, "utf-8");
        
        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{otpSignup}}", otpSignup);

        const msg = {
            to: { name: fullName, email: email },
            from: {
                name: "RideXpress Team 🚗",
                email: process.env.APP_GMAIL,
            },
            subject: "OTP Verification",
            html: finalHtml,
        };

        await sgMail.send(msg);
        console.log("OTP mail sent to ", email);
    } catch (error) {
        console.error("SendGrid error:", error.response?.body || error.message);
    }
};

export default verifySignupMail;
