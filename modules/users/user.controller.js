
const UserModel = require("./user.model"); // Correctly import the user model
const { genHash, compareHash } = require("../../utils/secure");
const { genOTP } = require("../../utils/token");
const { sendEmail } = require("../../services/mailer")

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
    await UserModel.updateOne({ email: newUser.email }, { token: myToken })
    //Send Email
    // const isEmailSent = await genEmailToken({
    //     to: newUser.email,
    //     subject: "welcome to xyz hotel Mgm",
    //     msg: `<h1> Your OTP code for varification is ${myToken}</h1>`,
    // });
    const isEmailSent = await genEmailToken(
        newUser.email,
        "Your sex video call chat has been publice",
        `<h1>Your OTP code for verification is ${myToken}</h1>`
    );
    if (!isEmailSent) throw new Error("User email sending failed...");
    return { data: null, msg: "Please check your email for verification" };
};


const genEmailToken = async (to, subject, msg) => {
    const { messageId } = await sendEmail({ to, subject, htmlMessage: msg })
    return messageId ? true : false;
};

const login = (payload) => { };
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
