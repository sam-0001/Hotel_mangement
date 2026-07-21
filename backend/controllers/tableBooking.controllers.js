import TableBooking from "../models/tableBooking.model.js";
import Shop from "../models/shop.model.js";
import Table from "../models/table.model.js";

// Customer books a table online
export const createOnlineBooking = async (req, res) => {
    try {
        const { shopId, date, time, guests, preference, smoking, specialOccasion, specialRequest } = req.body;
        const userId = req.userId;

        // Check if there are tables available for the requested time
        const totalTables = await Table.countDocuments({ shop: shopId, status: { $ne: "Disabled" } });
        
        if (totalTables === 0) {
            return res.status(400).json({ message: "This restaurant has no tables available for booking right now." });
        }

        const activeBookings = await TableBooking.countDocuments({
            shop: shopId,
            date: date,
            time: time,
            status: { $nin: ["Completed", "Cancelled", "No-Show"] }
        });

        if (activeBookings >= totalTables) {
            return res.status(400).json({ message: "No tables available for this time. Please select another timing." });
        }

        const newBooking = new TableBooking({
            shop: shopId,
            user: userId,
            customerName: req.body.customerName || "Online Customer",
            customerMobile: req.body.customerMobile || "",
            date,
            time,
            guests,
            preference,
            smoking,
            specialOccasion,
            specialRequest,
            bookingType: "Online"
        });

        await newBooking.save();
        res.status(201).json({ message: "Table booked successfully", booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: `Error creating booking: ${error.message}` });
    }
};

// Owner creates a walk-in or phone booking
export const createWalkInBooking = async (req, res) => {
    try {
        const { shopId, customerName, customerMobile, date, time, guests, preference, bookingType, tableId } = req.body;
        const ownerId = req.userId;

        const shop = await Shop.findOne({ _id: shopId, owner: ownerId });
        if (!shop) return res.status(403).json({ message: "Unauthorized or shop not found" });

        const newBooking = new TableBooking({
            shop: shopId,
            customerName,
            customerMobile,
            date,
            time,
            guests,
            preference,
            bookingType: bookingType || "Walk-in",
            table: tableId || null,
            status: tableId ? "Arrived" : "Pending"
        });

        await newBooking.save();

        if (tableId) {
            await Table.findByIdAndUpdate(tableId, { status: "Occupied" });
        }

        res.status(201).json({ message: "Booking created", booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: `Error creating walk-in: ${error.message}` });
    }
};

// Owner gets all shop bookings
export const getShopBookings = async (req, res) => {
    try {
        const { shopId } = req.params;
        const bookings = await TableBooking.find({ shop: shopId }).populate("table").sort({ date: -1, time: 1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: `Error fetching bookings: ${error.message}` });
    }
};

// User gets their own bookings
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await TableBooking.find({ user: req.userId }).populate("shop", "name image").populate("table").sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: `Error fetching your bookings: ${error.message}` });
    }
};

// Owner updates booking status or assigns table
export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status, tableId } = req.body;
        const ownerId = req.userId;

        const booking = await TableBooking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const shop = await Shop.findOne({ _id: booking.shop, owner: ownerId });
        if (!shop) return res.status(403).json({ message: "Unauthorized" });

        if (status) {
            booking.status = status;
            if (status === "Arrived" && booking.table) {
                await Table.findByIdAndUpdate(booking.table, { status: "Occupied" });
            } else if (status === "Completed" || status === "Cancelled" || status === "No-Show") {
                if (booking.table) {
                    await Table.findByIdAndUpdate(booking.table, { status: "Cleaning" });
                }
            }
        }

        if (tableId) {
            booking.table = tableId;
            if (status === "Arrived") {
                await Table.findByIdAndUpdate(tableId, { status: "Occupied" });
            }
        }

        await booking.save();
        res.status(200).json({ message: "Booking updated", booking });
    } catch (error) {
        res.status(500).json({ message: `Error updating booking: ${error.message}` });
    }
};
