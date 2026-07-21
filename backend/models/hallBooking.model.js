import mongoose from "mongoose";

const hallBookingSchema = new mongoose.Schema({
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    hall: { type: mongoose.Schema.Types.ObjectId, ref: "Hall", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Null if owner creates booking for offline user
    customerName: { type: String, required: true },
    customerMobile: { type: String, required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true }, // Format HH:mm
    endTime: { type: String, required: true }, // Format HH:mm
    eventType: { type: String, required: true }, // Birthday, Wedding, Meeting, etc.
    package: {
        name: String,
        price: Number
    },
    addOns: [{
        name: String,
        price: Number
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
        default: "Pending"
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Advance", "Paid"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        enum: ["online", "cash", "offline"], // offline for owner manually recording payment
        default: "online"
    },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model("HallBooking", hallBookingSchema);
