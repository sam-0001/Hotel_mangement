import mongoose from "mongoose"

let cachedConnection = null;

const connectDb = async () => {
    if (cachedConnection) {
        console.log("Using cached db connection");
        return cachedConnection;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        cachedConnection = conn;
        console.log("db connected");
        return conn;
    } catch (error) {
        console.log("db error", error);
    }
}

export default connectDb