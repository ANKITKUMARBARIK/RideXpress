import transporter from "../config/mailer.config.js";
import { promises as fs } from "fs";

const verifySignupMail = async (fullName, email, otpSignup) => {
    try {
        const htmlContent = await fs.readFile(
            "./src/mails/templates/verifySignupMail.html",
            "utf-8"
        );
        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{otpSignup}}", otpSignup);

        const mailOptions = {
            from: {
                name: "RideXpress Team 🚗",
                address: process.env.APP_GMAIL,
            },
            to: { name: fullName, address: email },
            subject: "OTP Verification",
            html: finalHtml,
            text: finalHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("mail sent ", info.response);
    } catch (error) {
        console.error("error sending mail ", error);
    }
};

export default verifySignupMail;
