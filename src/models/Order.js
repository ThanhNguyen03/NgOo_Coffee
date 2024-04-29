import { Schema, model, models } from "mongoose";

const PaidOptionSchema = new Schema({
    name: String,
    status: Boolean,
    payType: String,
    ATM: String,
    transactionNo: String,
});

const OrderSchema = new Schema({
    email: {type: String, required: true},
    phone: {type: String, require: true},
    streetAddress: {type: String, require: true},
    city: {type: String, require: true},
    postalCode: {type: String},
    cartProducts: {type: Object},
    paid: {type: PaidOptionSchema},
    price: {type: Number},
    notes: {type: String},
}, {timestamps: true});

export const Order = models?.Order || model('Order', OrderSchema);