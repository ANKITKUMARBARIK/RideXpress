import Joi from "joi";

export const createRideSchema = Joi.object({
    pickup: Joi.string().min(3).required().messages({
        "string.base": `"pickup" should be a type of 'text'`,
        "string.empty": `"pickup" is required`,
        "string.min": `"pickup" must be at least 3 characters`,
        "any.required": `"pickup" is a required field`,
    }),
    destination: Joi.string().min(3).required().messages({
        "string.base": `"destination" should be a type of 'text'`,
        "string.empty": `"destination" is required`,
        "string.min": `"destination" must be at least 3 characters`,
        "any.required": `"destination" is a required field`,
    }),
});
