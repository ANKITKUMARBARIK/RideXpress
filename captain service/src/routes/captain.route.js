import { Router } from "express";
import {
    registerCaptain,
    verifyOtpSignup,
    resendOtpSignup,
    loginCaptain,
    forgetCaptainPassword,
    resetCaptainPassword,
    refreshAccessToken,
    logoutCaptain,
    changeCurrentPassword,
    updateAccountDetails,
    getCurrentCaptain,
    deleteCaptain,
    waitForNewRide,
    acceptRide,
} from "../controllers/captain.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
    registerCaptainSchema,
    verifyOtpSignupSchema,
    resendOtpSignupSchema,
    loginCaptainSchema,
    forgetCaptainPasswordSchema,
    resetCaptainPasswordSchema,
    changeCurrentPasswordSchema,
    updateAccountDetailsSchema,
} from "../validations/captain.validation.js";
import verifyAuthentication from "../middlewares/authentication.middleware.js";
const router = Router();

router
    .route("/register")
    .post(validate(registerCaptainSchema), registerCaptain);

router
    .route("/verify-signup")
    .post(validate(verifyOtpSignupSchema), verifyOtpSignup);

router
    .route("/resend-signup")
    .post(validate(resendOtpSignupSchema), resendOtpSignup);

router.route("/login").post(validate(loginCaptainSchema), loginCaptain);

router
    .route("/forget-password")
    .post(validate(forgetCaptainPasswordSchema), forgetCaptainPassword);

router
    .route("/reset-password/:token")
    .post(validate(resetCaptainPasswordSchema), resetCaptainPassword);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyAuthentication, logoutCaptain);

router
    .route("/change-password")
    .patch(
        validate(changeCurrentPasswordSchema),
        verifyAuthentication,
        changeCurrentPassword
    );

router
    .route("/update-account")
    .patch(
        validate(updateAccountDetailsSchema),
        verifyAuthentication,
        updateAccountDetails
    );

router.route("/current-captain").get(verifyAuthentication, getCurrentCaptain);

router.route("/delete-captain").delete(verifyAuthentication, deleteCaptain);

router.get("/wait-new-ride", verifyAuthentication, waitForNewRide);

router.patch("/accept-ride/:rideId", verifyAuthentication, acceptRide);

export default router;
