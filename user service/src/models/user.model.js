import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "Auth",
            required: true,
            unique: true,
            index: true,
        },
        fullName: {
            type: String,
            required: [true, "fullname is required"],
            trim: true,
            index: true,
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
    },
    { timestamps: true }
);

const User = model("User", userSchema);

export default User;
