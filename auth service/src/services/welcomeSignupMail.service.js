import transporter from "../config/mailer.config.js";
import { promises as fs } from "fs";

const welcomeSignupMail = async (fullName, email) => {
    try {
        const htmlContent = await fs.readFile(
            "./src/mails/templates/welcomeSignupMail.html",
            "utf-8"
        );
        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{dashboardLink}}", "http://localhost:5000/");

        const mailOptions = {
            from: {
                name: "RideXpress System Team 🚗",
                address: process.env.APP_GMAIL,
            },
            to: { name: fullName, address: email },
            subject: `Welcome ${fullName}`,
            html: finalHtml,
            text: finalHtml,
            attachments: [
                {
                    filename: "default.png",
                    path: "./public/images/default.png",
                },
                {
                    filename: "default.png",
                    path: "./public/images/default.png",
                    cid: "img1-contentid",
                },
            ],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("mail sent ", info.response);
    } catch (error) {
        console.error("error sending mail ", error);
    }
};

export default welcomeSignupMail;
