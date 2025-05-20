import Joi from 'joi';

const validateAuth = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(22).required(),
    });

    return schema.validateAsync(data);
};

const validateRegister = (data) => {
    const schema = Joi.object({
        full_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(22).required(),
        s_name: Joi.string(),
    });

    return schema.validateAsync(data);
};

const validateOTP = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().min(6).max(6).required()
    });

    return schema.validateAsync(data);
};

const validateResetPassword = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
        new_password: Joi.string().min(8).max(22).required()
    });
    return schema.validateAsync(data);
};


export default {
    validateAuth,
    validateRegister,
    validateOTP,
    validateResetPassword
}