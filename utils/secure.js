const bcrypt = require("bcryptjs")
const { verifyToken } = require("../utils/token")
const UserModel = require("../modules/users/user.model")

const genHash = (text) => {
    return bcrypt.hashSync(text, Number(process.env.SALT_ROUND));
}

const compareHash = (text, hashText) => {
    return bcrypt.compareSync(text, hashText);
}

const secureAPI = (sysRole = []) => {
    return async (req, res, next) => {
        try {
            const { access_token } = req.headers;
            // console.log("access_token", access_token)
            if (!access_token) throw new Error("Login Token not found")
            console.log({ access_token })
            const { email } = verifyToken(access_token);
            // console.log({email});
            const user = await UserModel.findOne({ email, isActive: true, isBlocked: false });
            if (!user) throw new Error("User not found");
            const isValidRole = sysRole.some((role) => user?.roles.includes(role));
            console.log({ isValidRole })
            if (!isValidRole) {
                throw new Error("User unauthorized")
            } else {
                req.body.updated_by = user?._id;
                next();
            }
        } catch (e) {
            next(e)
        }

    };
};

module.exports = { genHash, compareHash, secureAPI }