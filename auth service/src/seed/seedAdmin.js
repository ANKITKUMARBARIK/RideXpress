import User from "../models/user.model.js";
import ROLES from "../config/role.js";

const seedAdmin = async () => {
    try {
        const existedAdmin = await User.findOne({ role: ROLES.ADMIN });
        if (!existedAdmin) {
            const user = new User({
                fullName: "Admin",
                username: "admin",
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                bio: "manage services",
                avatar: "avatar.png",
                coverImage: "coverImage.png",
                timezone: "Asia/Kolkata",
                role: ROLES.ADMIN,
                isVerified: true,
                authProvider: "local",
            });
            await user.save();
            console.info("default admin created successfully");
        } else {
            console.info("admin already exists");
        }
    } catch (error) {
        console.error("error while creating default admin:", error);
    }
};

export default seedAdmin;
