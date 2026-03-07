"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: { type: String, required: true },
    gender: { type: String, enum: ['MEN', 'WOMEN', 'UNISEX'], default: 'UNISEX' },
    stock: { type: Number, default: 0 },
    sizes: [{ type: String }],
    images: [{ type: String }],
}, { timestamps: true });
exports.Product = mongoose_1.default.model('Product', productSchema);
