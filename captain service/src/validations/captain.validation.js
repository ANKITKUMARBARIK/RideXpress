import Joi from "joi";

export const registerCaptainSchema = Joi.object({
    fullName: Joi.string().trim().required().messages({
        "string.empty": `"fullName" is required`,
    }),

    email: Joi.string().email().trim().required().messages({
        "string.empty": `"email" is required`,
        "string.email": `"email" must be valid`,
    }),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.empty": `"phone" is required`,
            "string.pattern.base": `"phone" must be a 10-digit number`,
        }),

    password: Joi.string().min(6).required().messages({
        "string.empty": `"password" is required`,
        "string.min": `"password" must be at least 6 characters`,
    }),

    vehicleNumber: Joi.string().trim().required().messages({
        "string.empty": `"vehicleNumber" is required`,
    }),

    vehicleType: Joi.string().valid("car", "bike", "auto").required().messages({
        "any.only": `"vehicleType" must be one of [car, bike, auto]`,
        "string.empty": `"vehicleType" is required`,
    }),
});

export const verifyOtpSignupSchema = Joi.object({
    otpSignup: Joi.string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
            "string.pattern.base": `"otpSignup" must be a 6-digit number`,
            "string.empty": `"otpSignup" is required`,
            "any.required": `"otpSignup" is required`,
        }),
});

export const resendOtpSignupSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": `"email" must be a valid email`,
        "string.empty": `"email" is required`,
        "any.required": `"email" is required`,
    }),
});

export const loginCaptainSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": `"email" is required`,
        "string.email": `"email" must be a valid email`,
        "any.required": `"email" is required`,
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": `"password" is required`,
        "string.min": `"password" must be at least 6 characters`,
        "any.required": `"password" is required`,
    }),
});

export const forgetCaptainPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": `"email" is required`,
        "string.email": `"email" must be a valid email`,
    }),
});

export const resetCaptainPasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).required().messages({
        "string.empty": `"newPassword" is required`,
        "string.min": `"newPassword" must be at least 6 characters`,
    }),
    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref("newPassword"))
        .messages({
            "any.only": `"confirmPassword" must match "newPassword"`,
            "string.empty": `"confirmPassword" is required`,
        }),
});

export const changeCurrentPasswordSchema = Joi.object({
    oldPassword: Joi.string().min(6).required().messages({
        "string.empty": `"oldPassword" is required`,
        "string.min": `"oldPassword" must be at least 6 characters`,
    }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .invalid(Joi.ref("oldPassword"))
        .messages({
            "string.empty": `"newPassword" is required`,
            "string.min": `"newPassword" must be at least 6 characters`,
            "any.invalid": `"newPassword" must be different from "oldPassword"`,
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": `"confirmPassword" must match "newPassword"`,
            "string.empty": `"confirmPassword" is required`,
        }),
});

export const updateAccountDetailsSchema = Joi.object({
    fullName: Joi.string().trim().min(2).max(50).optional().messages({
        "string.base": `"fullName" should be a type of 'text'`,
        "string.min": `"fullName" should have at least 2 characters`,
        "string.max": `"fullName" should not exceed 50 characters`,
    }),
    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .messages({
            "string.pattern.base": `"phone" must be a 10-digit number`,
        }),
    vehicleNumber: Joi.string().trim().optional().messages({
        "string.base": `"vehicleNumber" should be text`,
    }),
    vehicleType: Joi.string().valid("car", "bike", "auto").optional().messages({
        "any.only": `"vehicleType" must be one of [car, bike, auto]`,
    }),
});
