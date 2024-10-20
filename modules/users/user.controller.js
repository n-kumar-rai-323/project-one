
const UserModel = require("./user.model"); // Correctly import the user model
const { genHash, compareHash } = require("../../utils/secure");
const { genOTP, genToken } = require("../../utils/token");
const { sendEmail } = require("../../services/mailer");




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
        "Hi Folks",
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



const genForgetPasswordToken = async ({ email }) => {
    //1. check email for user
    const user = await UserModel.findOne({ email, isActive: true, isBlocked: false });
    if (!user) throw new Error("User not found");

    // 3. generate new token
    const myToken = genOTP();

    // 4.store token in database in user data 
    await UserModel.updateOne({ email }, { token: myToken });

    //5. Send token to user email
    const isEmailSent = await genEmailToken(
        user?.email,
        "Forget Password for XYZ Hotel Management",
        `<h1>Your Forget Password Token is  ${myToken}</h1>`
    );

    if (!isEmailSent) throw new Error("User email sending failed...");
    return { data: null, msg: "please check your email for token" }


};

const verifyForgetPasswordToken = async ({ email, token, newPassword }) => {
    //1. check email for user
    const user = await UserModel.findOne({ email, isActive: true, isBlocked: false });
    if (!user) throw new Error("User not found");
    //2. check token for user
    const isValidToken = token === user?.token;
    if (!isValidToken) throw new Error("Token mismatch");

    //3. token match newPassword has 
    const password = genHash(newPassword);


    //4. update the user data with new password has and empty token field 
    const updateUser = await UserModel.updateOne({ email }, { password, token: "" });
    console.log(updateUser)
    if (!updateUser) throw new Error("Forget Password Change failed");
    return { data: null, msg: "Password Changed Successfully" };
};
const changePassword = async ({ email, oldPassword, newPassword }) => {
    //1. find the user using email; isblock : isActive
    const user = await UserModel.findOne({ email, isActive: true, isBlocked: false });
    if (!user) throw new Error("User not found");

    //2. compare the oldPassword store in the database
    const isValidPw = compareHash(oldPassword, user?.password);
    if (!isValidPw) throw new Error("Password mismatch");

    //3. generate hash of new password
    const password = genHash(newPassword);

    //4. update the user data with new password
    const updateUser = await UserModel.findOneAndUpdate(
        { email },
        { password },
        { new: true } // ensure we get the upadted user document data 
    )
    if (!updateUser) throw new Error("Password Change failed");
    return { data: null, msg: "Password Changed Successfully" };
};

const updateProfile = () => { };

//admin controllers 

const resetPassword = async ({ email, newPassword, updated_by}) => {
    //1. find the user using email; isblock : isActive
    const user = await UserModel.findOne({ email, isActive: true, isBlocked: false });
    if (!user) throw new Error("User not found");

    //3. generate hash of new password
    const password = genHash(newPassword);

    //4. update the user data with new password
    const updateUser = await UserModel.findOneAndUpdate(
        { email },
        { password , updated_by },
        { new: true } // ensure we get the upadted user document data 
    )
    if (!updateUser) throw new Error("Password reset failed");
    return { data: null, msg: "Password Reset Successfully" };
};
const blockUser = async ({ email, updated_by }) => {
    //1. find the user using email; isblock : isActive
    const user = await UserModel.findOne({ email, isActive: true });
    if (!user) throw new Error("User not found");

    //4. update the user data with new password
    const updateUser = await UserModel.findOneAndUpdate(
        { email },
        { isBlocked: !user?.isBlocked, updated_by },
        { new: true } // ensure we get the upadted user document data 
    )
    if (!updateUser) throw new Error("User block failed");
    return {
        data: { isBlocked: updateUser?.isBlocked },
        msg: `User ${updateUser?.isBlocked ? "blocked" : "unblocked"} Successfully`,
    };
};
const create = (payload) => { };
const list = () => { };
const getById = () => { };
const updateById =()=>{}


module.exports = {
    create, register, login, genEmailToken, verifyEmailToken,
    genForgetPasswordToken, verifyForgetPasswordToken,
    changePassword, resetPassword, blockUser, list, getById, updateProfile
};
