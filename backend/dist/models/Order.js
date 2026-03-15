"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    size: { type: String },
    seller: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
});
const orderSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'PLACED' }, // PLACED, SHIPPED, DELIVERED, CANCELLED
    total_amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    mobile: { type: String, required: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    items: [orderItemSchema], // Embedded array of items
}, { timestamps: true });
exports.Order = mongoose_1.default.model('Order', orderSchema);
