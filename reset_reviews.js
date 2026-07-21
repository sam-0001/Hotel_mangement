import mongoose from "mongoose";
import Item from "./backend/models/item.model.js";
import dotenv from "dotenv";

dotenv.config({path:"./backend/.env"});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
        const res = await Item.updateMany({}, { $set: { "rating.average": 0, "rating.count": 0 } });
        console.log("Items updated:", res);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
connectDB();
