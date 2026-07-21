import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" }
});

const addOnSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

const hallSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    images: [{ type: String }],
    capacity: { type: Number, required: true },
    pricePerHour: { type: Number, required: true },
    packages: [packageSchema],
    addOns: [addOnSchema],
    amenities: [{ type: String }],
    minBookingDuration: { type: Number, default: 2 }, // in hours
    cleaningTime: { type: Number, default: 1 }, // in hours
    status: {
        type: String,
        enum: ["Available", "Maintenance", "Disabled"],
        default: "Available"
    }
}, { timestamps: true });

export default mongoose.model("Hall", hallSchema);
