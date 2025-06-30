import sgMail from "../config/mail.config.js";
import { promises as fs } from "fs";
import path from "path";

const welcomeSignupMail = async (fullName, email) => {
    try {
        const filePath = path.resolve(
            "src/mails/templates/welcomeSignupMail.html"
        );
        const htmlContent = await fs.readFile(filePath, "utf-8");

        const imagePath = path.resolve("public/images/default.png");
        const imageBuffer = await fs.readFile(imagePath);
        const base64Image = imageBuffer.toString("base64");

        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{dashboardLink}}", "http://localhost:5000/");

        const msg = {
            to: { name: fullName, email: email },
            from: {
                name: "RideXpress System Team 🚗",
                email: process.env.APP_GMAIL,
            },
            subject: `Welcome ${fullName}`,
            html: finalHtml,
            attachments: [
                {
                    content: base64Image,
                    filename: "default.png",
                    type: "image/png",
                    disposition: "attachment",
                    content_id: "img1-contentid",
                },
            ],
        };

        await sgMail.send(msg);
        console.log("WELCOME mail sent to ", email);
    } catch (error) {
        console.error("SendGrid error:", error.response?.body || error.message);
    }
};

export default welcomeSignupMail;
