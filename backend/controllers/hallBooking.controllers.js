import HallBooking from "../models/hallBooking.model.js";
import Hall from "../models/hall.model.js";
import Shop from "../models/shop.model.js";

// Helper to convert "HH:mm" to minutes since midnight
const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

export const createHallBooking = async (req, res) => {
    try {
        const { shopId, hallId, customerName, customerMobile, eventDate, startTime, endTime, eventType, selectedPackage, addOns, totalAmount, paymentMethod } = req.body;
        const userId = req.userId; // null if owner making offline booking? No, this endpoint is for users

        // Validate Hall
        const hall = await Hall.findById(hallId);
        if (!hall || hall.status !== "Available") {
            return res.status(400).json({ message: "Hall is not available for booking." });
        }

        // Parse times
        const newStart = timeToMinutes(startTime);
        const newEnd = timeToMinutes(endTime);

        if (newEnd <= newStart) {
            return res.status(400).json({ message: "End time must be after start time." });
        }

        if ((newEnd - newStart) / 60 < hall.minBookingDuration) {
            return res.status(400).json({ message: `Minimum booking duration is ${hall.minBookingDuration} hours.` });
        }

        // Check overlapping bookings
        // Fetch all confirmed/pending bookings for this hall on this date
        // Since eventDate might be passed as a string with time, we need to match the date part
        const searchDate = new Date(eventDate);
        searchDate.setHours(0, 0, 0, 0);
        const nextDate = new Date(searchDate);
        nextDate.setDate(searchDate.getDate() + 1);

        const existingBookings = await HallBooking.find({
            hall: hallId,
            eventDate: { $gte: searchDate, $lt: nextDate },
            status: { $in: ["Pending", "Confirmed"] }
        });

        // Check for overlaps including cleaning time
        for (const booking of existingBookings) {
            const existingStart = timeToMinutes(booking.startTime);
            const existingEnd = timeToMinutes(booking.endTime);
            // Cleaning time applies after the existing booking ends
            const existingEndWithCleaning = existingEnd + (hall.cleaningTime * 60);

            // Two intervals [A, B] and [C, D] overlap if Math.max(A, C) < Math.min(B, D)
            // But if a booking starts at exactly the cleaning end time, it's valid.
            const overlap = Math.max(newStart, existingStart) < Math.min(newEnd, existingEndWithCleaning);

            if (overlap) {
                return res.status(400).json({ 
                    message: `This hall is already booked or undergoing cleaning from ${booking.startTime} to ${Math.floor(existingEndWithCleaning/60)}:${String(existingEndWithCleaning%60).padStart(2,'0')}. Please select another time.` 
                });
            }
        }

        const newBooking = new HallBooking({
            shop: shopId,
            hall: hallId,
            user: userId,
            customerName,
            customerMobile,
            eventDate: searchDate,
            startTime,
            endTime,
            eventType,
            package: selectedPackage,
            addOns,
            totalAmount,
            paymentMethod
        });

        await newBooking.save();
        res.status(201).json({ message: "Hall booked successfully", booking: newBooking });

    } catch (error) {
        res.status(500).json({ message: `Error booking hall: ${error.message}` });
    }
};

export const getOwnerHallBookings = async (req, res) => {
    try {
        const ownerId = req.userId;
        const { shopId } = req.params;

        // Verify shop ownership
        const shop = await Shop.findOne({ _id: shopId, owner: ownerId });
        if (!shop) return res.status(403).json({ message: "Unauthorized" });

        const bookings = await HallBooking.find({ shop: shopId }).populate("hall", "name");
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: `Error fetching bookings: ${error.message}` });
    }
};

export const getUserHallBookings = async (req, res) => {
    try {
        const userId = req.userId;
        const bookings = await HallBooking.find({ user: userId }).populate("hall", "name").populate("shop", "name image");
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: `Error fetching bookings: ${error.message}` });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status, paymentStatus } = req.body;
        const ownerId = req.userId;

        const booking = await HallBooking.findById(bookingId).populate("shop");
        if (!booking || booking.shop.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ message: "Unauthorized or booking not found" });
        }

        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        await booking.save();
        res.status(200).json({ message: "Booking updated successfully", booking });
    } catch (error) {
        res.status(500).json({ message: `Error updating booking: ${error.message}` });
    }
};
