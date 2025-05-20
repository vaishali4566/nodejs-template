import mongoose from "mongoose";

const { Schema } = mongoose;

const AuthSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        password: {
            type: String,
            required: true,
        },
        full_name: {
            type: String,
            required: true,
            trim: true,
        },
        s_name: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        is_verified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: null,
        }
    },
    { timestamps: true }
);

const AuthModel = mongoose.model('Auth', AuthSchema);

export default AuthModel;
