import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { registerUserSchema } from "../validations/auth.validation.js";
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

export default router;
