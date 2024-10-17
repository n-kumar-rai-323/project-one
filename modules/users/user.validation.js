const joi = require("joi");
const userSchema = joi.object({
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } 
        }),
        password:joi.string().optional(),
})

const validate = async (req, res, next) => {
    try {
        await userSchema.validateAsync(req.body);
        next()
    }
    catch (e) {
        next(e)
    }
}

module.exports={validate}