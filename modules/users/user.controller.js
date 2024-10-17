
const UserModel = require("./user.model"); // Correctly import the user model
const { genHash, compareHash } = require("../../utils/secure");
const { genOTP, genToken } = require("../../utils/token");
const { sendEmail } = require("../../services/mailer");


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
        "Hi Nikita its me Nishan Rai",
        `<h1>Your OTP code for verification is ${myToken}</h1>`
    );
    if (!isEmailSent) throw new Error("User email sending failed...");
    return { data: null, msg: "Please check your email for verification" };
};


const genEmailToken = async (to, subject, msg) => {
    const { messageId } = await sendEmail({ to, subject, htmlMessage: msg })
    return messageId ? true : false;
};

const verifyEmailToken = async (payload) => {
    const { email, token } = payload;
    //to check email on system 
    const user = await UserModel.findOne({ email, isBlocked: false });
    if (!user) throw new Error("User not found");
    //compare user le pathayako otp with  db store gareko token
    const isValidToken = token === user?.token;
    if (!isValidToken) throw new Error("Invalid token");
    //match vayo vane  = isActive true and token empty 
    const updateUser = await UserModel.updateOne(
        { email },
        { isActive: true, token: "" }
    );
    if (!updateUser) throw new Error("Email Varification failed");
    return { data: null, msg: "Thank you for varifying your email" };
};

const login = async (payload) => {
    const { email, password } = payload;

    //user find using email + blocked + active check
    const user = await UserModel.findOne({ email, isActive: true, isBlocked: false });
    if (!user) throw new Error("User not found");

    //compare password with db stored pw
    const isValidPw = compareHash(password, user?.password);
    console.log(isValidPw)
    if (!isValidPw) throw new Error("Username or Password didn't match");

    //gentoken return that token
    const data = {
        name: user?.name,
        email: user?.email,
        roles: user?.roles
    }
    return genToken(data);
};
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
