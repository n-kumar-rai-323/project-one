// user.model.js
const { Schema, model } = require("mongoose");

const schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: String,
        image: String,
        token: String,
        isBlocked: {type:Boolean, required:true, default:false},
        roles: { type: [String], enum: ["admin", "user"], default: ["user"] },
        isActive: { type: Boolean, required: true, default: false },
        updated_by : String, //todo,
        created_by:String,
    }, {
        timestamps: true,
    }
);

module.exports = model("User", schema); //