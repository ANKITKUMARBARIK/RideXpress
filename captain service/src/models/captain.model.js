import { Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt";

const captainSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, "phone number is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    vehicleNumber: {
        type: String,
        required: [true, "vehicle number is required"],
        unique: true,
    },
    vehicleType: {
        type: String,
        enum: ["car", "bike", "auto"],
        required: [true, "vehicle type is required"],
    },
    isAvailable: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["captain"],
        default: "captain",
    },
    captainRefreshToken: {
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
    // 🔒 Future:
    // currentLocation: {
    //   type: {
    //     latitude: { type: Number },
    //     longitude: { type: Number }
    //   },
    //   default: null
    // }
});

captainSchema.pre("save", async function (next) {
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

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Captain = model("Captain", captainSchema);

export default Captain;
