import AuthModel from "../../model/auth.model.js";

const createUser = (data) => {
    return new AuthModel(data).save();
};

const findUserByEmail = (email) => {
    return AuthModel.findOne({ email });
}

export default {
    createUser,
    findUserByEmail
}