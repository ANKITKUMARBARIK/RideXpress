import sgMail from "../config/mail.config.js";
import { promises as fs } from "fs";
import path from "path";

const tokenVerifyMail = async (fullName, email, token) => {
    try {
        const filePath = path.resolve(
            "src/mails/templates/tokenVerifyMail.html"
        );
        const htmlContent = await fs.readFile(filePath, "utf-8");

        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{token}}", token)
            .replace("{{actionLink}}", "http://localhost:5000/");

        const msg = {
            to: { name: fullName, email: email },
            from: {
                name: "RideXpress System Team 🚗",
                email: process.env.APP_GMAIL,
            },
            subject: "Token Verification - Reset Password",
            html: finalHtml,
        };

        await sgMail.send(msg);
        console.log("TOKEN mail sent to ", email);
    } catch (error) {
        console.error("SendGrid error:", error.response?.body || error.message);
    }
};

export default tokenVerifyMail;
