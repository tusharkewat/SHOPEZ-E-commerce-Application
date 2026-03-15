"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopez';
        const conn = await mongoose_1.default.connect(mongoURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (error.message.includes('IP not whitelisted') || error.message.includes('ServerSelectionError')) {
            console.error(`❌ MongoDB Connection Error: Potential IP whitelisting issue!`);
            console.error(`👉 Please ensure your IP is whitelisted in MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/`);
        }
        else {
            console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        }
        // Don't exit process in dev mode so the developer can see the error in the console
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};
exports.default = connectDB;
