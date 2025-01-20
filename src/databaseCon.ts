import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL as string)
        console.log('Database working')
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}