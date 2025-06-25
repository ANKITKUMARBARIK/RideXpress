import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "fullname is required"],
            trim: true,
            index: true,
        },
        username: {
            type: String,
            required: [true, "username is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        bio: {
            type: String,
            maxlength: 160,
            default: "",
        },
        avatar: {
            type: String,
            required: [true, "avatar is required"],
        },
        coverImage: {
            type: String,
        },
        timezone: {
            type: String,
            required: [true, "timezone is required"],
            default: "Asia/Kolkata",
        },
        authProvider: {
            type: String,
            enum: [
                "local",
                "google",
                "github",
                "linkedin",
                "facebook",
                "twitter",
                "apple",
                "microsoft",
            ],
            default: "local",
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
        refreshToken: {
            type: String,
        },
        otpSignup: {
            type: String,
        },
        otpSignupExpiry: {
            type: Date,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        forgetPasswordToken: {
            type: String,
        },
        forgetPasswordExpiry: {
            type: Date,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

export default User;
