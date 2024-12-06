const { randomUUID } = require("crypto");
const { Schema, model } = require("mongoose");
const { ObjectId, UUID } = Schema.Types


const orderSchema = new Schema(
    {
        number: { type: UUID, default: () => randomUUID(), require: true },
        receiver: { type: String, required: true },
        arrivalDate: { type: Date, required: true },
        departureDate: { type: Date, required: true },
        room: { type: ObjectId, ref: "room", required: true },
        status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
        amount: { type: Number, required: true },
    }, {
    timestamps: true,
}
);
module.exports=new model("Order", orderSchema)