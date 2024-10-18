const joi = require("joi");
const { token } = require("morgan");
const userSchema = joi.object({
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } 
        }),
        password:joi.string().optional(),
})


const FPSchema = joi.object({
    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } 
        }),
        newPassword:joi.string().required(),
        token:joi.string().min(6).max(6).required(),
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

const forgetPasswordValidation = async(req, res, next)=>{
    try{
        await FPSchema.validateAsync(req.body)
        next()
    }catch(e){
        next(e)
    }
}

module.exports={validate, forgetPasswordValidation}