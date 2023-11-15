import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 60000,
            family: 4
        });
        console.log("Mongo connected");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
