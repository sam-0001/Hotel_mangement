import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tableNumber: { type: String, required: true },
    capacity: { type: Number, required: true, default: 2 },
    floor: { type: String, default: "Main Floor" },
    status: {
        type: String,
        enum: ["Available", "Reserved", "Occupied", "Cleaning", "Maintenance", "Disabled"],
        default: "Available"
    },
    isSmokingZone: { type: Boolean, default: false },
    qrCode: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Table", tableSchema);
