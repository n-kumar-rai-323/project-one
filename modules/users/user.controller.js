const UserModel = require("./user.model"); // Correctly import the user model
const { genHash, compareHash } = require("../../utils/secure");
const { genOTP } = require("../../utils/token");

const create = (payload) => { };
const register = async (payload) => {
    const { password, roles, isActive, ...rest } = payload;
    const userExist = await UserModel.findOne({ email: rest?.email }); // Use UserModel here
    if (userExist) throw new Error("This email has already been taken");
    rest.password = genHash(password);
    
    // Create the user instance
    const newUser = await UserModel.create(rest);
    if (!newUser) throw new Error("User registration failed. Try again later");

    const myToken = genOTP();
    console.log({ myToken });
    return { data: null, msg: "Please check your email for verification" };
};

const login = (payload) => { };
const genEmailToken = () => { };
const verifyEmailToken = () => { };
const genForgetPasswordToken = () => { };
const verifyForgetPasswordToken = () => { };
const changePassword = () => { };
const resetPassword = () => { };
const blockUser = () => { };
const list = () => { };
const getById = () => { };
const updateProfile = () => { };

module.exports = {
    create, register, login, genEmailToken, verifyEmailToken,
    genForgetPasswordToken, verifyForgetPasswordToken,
    changePassword, resetPassword, blockUser, list, getById, updateProfile
};
