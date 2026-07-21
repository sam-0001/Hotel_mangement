import mongoose from "mongoose";

const tableBookingSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Null for walk-ins/phone if not registered
    customerName: { type: String, required: true },
    customerMobile: { type: String, required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", default: null }, // Assigned table
    date: { type: Date, required: true },
    time: { type: String, required: true }, 
    guests: { type: Number, required: true },
    preference: { type: String, enum: ["Indoor", "Outdoor", "Window", "Any"], default: "Any" },
    smoking: { type: Boolean, default: false },
    specialOccasion: { type: String, default: "" },
    specialRequest: { type: String, default: "" },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Arrived", "Completed", "Cancelled", "No-Show"],
        default: "Pending"
    },
    bookingType: { type: String, enum: ["Online", "Walk-in", "Phone"], default: "Online" },
    paymentId: { type: String, default: null } // Optional advance payment reference
}, { timestamps: true });

export default mongoose.model("TableBooking", tableBookingSchema);
