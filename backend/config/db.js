import mongoose from "mongoose"

let cachedPromise = null;

const connectDb = async () => {
    if (cachedPromise) {
        return cachedPromise;
    }
    
    try {
        console.log("Initializing new db connection...");
        cachedPromise = mongoose.connect(process.env.MONGODB_URL);
        await cachedPromise;
        console.log("db connected");
        return cachedPromise;
    } catch (error) {
        cachedPromise = null;
        console.log("db error", error);
    }
}

export default connectDb