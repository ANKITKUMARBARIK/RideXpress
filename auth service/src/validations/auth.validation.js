import Joi from "joi";

export const registerUserSchema = Joi.object({
    fullName: Joi.string().required().messages({
        "string.empty": `"fullName" is required`,
    }),
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        "string.empty": `"username" is required`,
        "string.alphanum": `"username" must be alphanumeric`,
    }),
    email: Joi.string().email().required().messages({
        "string.empty": `"email" is required`,
        "string.email": `"email" must be a valid email`,
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": `"password" is required`,
        "string.min": `"password" must be at least 6 characters`,
    }),
    bio: Joi.string().allow("").optional(),
    timezone: Joi.string().required().messages({
        "string.empty": `"timezone" is required`,
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

export const loginUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        "string.empty": `"username" is required`,
        "string.alphanum": `"username" must be alphanumeric`,
        "any.required": `"username" is required`,
    }),
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
