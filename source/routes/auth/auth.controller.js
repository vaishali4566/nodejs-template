import AuthModel from "./auth.model.js";
import authValidation from "./auth.validation.js";
import { encrypt, decrypt } from "../../utils/helper/encryptDecrypt.js";
import { createToken } from "../../utils/helper/jwt.js";
import generateOTP from "../../utils/helper/otpGenerator.js";
import Mailer from "../../utils/helper/Mailer.js";

const sendOTPEmail = async (email, otp, purpose = 'verification') => {
    const subject = purpose === 'reset' ? 'Reset Your Password' : 'Welcome to our platform';
    const html = `<h1>${subject}</h1><p>Your OTP is: <strong>${otp}</strong></p>`;
    const text = `${subject} -- OTP: ${otp}`;

    await Mailer({ sender_email: email, subject, html, text });
};

const login = async (req, res, next) => {
    try {
        const { email, password } = await authValidation.validateAuth(req.body);
        const user = await AuthModel.findUserByEmail(email);
        if (!user || decrypt(user.password) !== password) {
            return responseHandler(res, 401, null, "Invalid email or password", null);
        }
        if (!user.is_verified) return responseHandler(res, 401, null, "User not verified", null);

        const token = createToken({ id: user._id, email: user.email });
        return responseHandler(res, 200, { token }, "Success", null);
    } catch (err) {
        next(err);
    }
};

const register = async (req, res, next) => {
    try {
        const value = await authValidation.validateRegister(req.body);
        value.password = encrypt(value.password);
        await AuthModel.createUser(value);

        const user = await AuthModel.findUserByEmail(value.email);
        const otp = generateOTP(6);
        user.otp = otp;
        await user.save();

        await sendOTPEmail(value.email, otp);
        return responseHandler(res, 200, null, "Registration successful. OTP sent.", null);
    } catch (err) {
        next(err);
    }
};

const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = await authValidation.validateOTP(req.body);
        const user = await AuthModel.findUserByEmail(email);
        if (!user || user.otp !== otp) {
            return responseHandler(res, 401, null, "Invalid email or OTP", null);
        }
        user.is_verified = true;
        user.otp = null;
        await user.save();
        return responseHandler(res, 200, null, "User verified successfully", null);
    } catch (error) {
        next(error);
    }
};

// Forgot Password
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await AuthModel.findUserByEmail(email);
        if (!user) return responseHandler(res, 404, null, "Email not found", null);

        const otp = generateOTP(6);
        user.otp = otp;
        await user.save();
        await sendOTPEmail(email, otp, 'reset');
        return responseHandler(res, 200, null, "Reset OTP sent", null);
    } catch (error) {
        next(error);
    }
};

const verifyResetOTP = async (req, res, next) => {
    try {
        const { email, otp } = await authValidation.validateOTP(req.body);
        const user = await AuthModel.findUserByEmail(email);
        if (!user || user.otp !== otp) {
            return responseHandler(res, 400, null, "Invalid OTP", null);
        }
        return responseHandler(res, 200, null, "OTP verified", null);
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, new_password } = req.body;
        const user = await AuthModel.findUserByEmail(email);
        if (!user || user.otp !== otp) {
            return responseHandler(res, 400, null, "Invalid OTP", null);
        }
        user.password = encrypt(new_password);
        user.otp = null;
        await user.save();
        return responseHandler(res, 200, null, "Password reset successfully", null);
    } catch (error) {
        next(error);
    }
};

export default {
    login,
    register,
    verifyOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword
};
