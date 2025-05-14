import mongoose from "mongoose";

const uri = process.env.NEXT_MONGO_DB_URI

if(!uri){
    throw new Error("Please define the NEXT_MONGO_DB_URI environment variable inside .env.local.")
}

export const connectMongo = async () => {
    try {
        
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(uri);

    } catch (error) {
        console.log('MongoDB connection error:', error);
        throw new Error('MongoDB connection error');
    }
}