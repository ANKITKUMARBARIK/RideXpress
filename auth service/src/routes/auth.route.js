import { Router } from "express";
import {
    registerUser,
    verifyOtpSignup,
} from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
    registerUserSchema,
    verifyOtpSignupSchema,
} from "../validations/auth.validation.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    validate(registerUserSchema),
    registerUser
);

router
    .route("/verify-signup")
    .post(validate(verifyOtpSignupSchema), verifyOtpSignup);

export default router;
