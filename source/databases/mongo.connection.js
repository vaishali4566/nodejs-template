import mongoose from 'mongoose';
import dotEnv from 'dotenv';
dotEnv.config();

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('== Connected to MongoDB ==');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        throw err;
    }
};

export default connectToMongoDB;
