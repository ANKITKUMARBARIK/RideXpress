import { Router } from "express";
import {
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getCurrentUser,
    deleteUser,
} from "../controllers/user.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
    changeCurrentPasswordSchema,
    updateAccountDetailsSchema,
} from "../validations/user.validation.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router
    .route("/change-password")
    .patch(validate(changeCurrentPasswordSchema), changeCurrentPassword);

router
    .route("/update-account")
    .patch(validate(updateAccountDetailsSchema), updateAccountDetails);

router.route("/update-avatar").patch(upload.single("avatar"), updateUserAvatar);

router
    .route("/update-coverImage")
    .patch(upload.single("coverImage"), updateUserCoverImage);

router.route("/current-user").get(getCurrentUser);

router.route("/delete-user").delete(deleteUser);

export default router;
