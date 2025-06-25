import transporter from "../config/mailer.config.js";
import { promises as fs } from "fs";

const tokenVerifyMail = async (fullName, email, token) => {
    try {
        const htmlContent = await fs.readFile(
            "./src/mails/templates/tokenVerifyMail.html",
            "utf-8"
        );
        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{token}}", token)
            .replace("{{actionLink}}", "http://localhost:5000/");

        const mailOptions = {
            from: {
                name: "RideXpress System Team 🚗",
                address: process.env.APP_GMAIL,
            },
            to: { name: fullName, address: email },
            subject: "Token Verification - Reset Password",
            html: finalHtml,
            text: finalHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("mail sent ", info.response);
    } catch (error) {
        console.error("error sending mail:", error);
    }
};

export default tokenVerifyMail;
