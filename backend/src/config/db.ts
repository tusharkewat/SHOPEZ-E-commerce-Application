import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopez';
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    if (error.message.includes('IP not whitelisted') || error.message.includes('ServerSelectionError')) {
      console.error(`❌ MongoDB Connection Error: Potential IP whitelisting issue!`);
      console.error(`👉 Please ensure your IP is whitelisted in MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/`);
    } else {
      console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    }
    // Don't exit process in dev mode so the developer can see the error in the console
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
