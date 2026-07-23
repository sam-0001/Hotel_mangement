import TableBooking from "../models/tableBooking.model.js";
import Shop from "../models/shop.model.js";
import Table from "../models/table.model.js";

// Customer books a table online
export const createOnlineBooking = async (req, res) => {
    try {
        const { shopId, date, time, guests, preference, smoking, specialOccasion, specialRequest } = req.body;
        const userId = req.userId;

        const isSmokingRequest = smoking === true;
        
        // Find a matching table that is available, fits the guests, and matches the smoking preference
        // We sort by capacity ascending so we don't give a 10-seater to 2 guests if a 2-seater is available
        const matchingTable = await Table.findOne({
            shop: shopId,
            status: "Available",
            capacity: { $gte: guests },
            isSmokingZone: isSmokingRequest
        }).sort({ capacity: 1 });

        if (!matchingTable) {
            return res.status(400).json({ 
                message: `No available ${isSmokingRequest ? 'smoking' : 'non-smoking'} tables found for ${guests} guests.` 
            });
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
            bookingType: "Online",
            table: matchingTable._id,
            status: "Confirmed"
        });

        await newBooking.save();

        // Mark the assigned table as Reserved
        matchingTable.status = "Reserved";
        await matchingTable.save();

        res.status(201).json({ message: "Table booked and automatically assigned successfully", booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: `Error creating booking: ${error.message}` });
    }
};

// Owner creates a walk-in or phone booking
export const createWalkInBooking = async (req, res) => {
    try {
        const { shopId, customerName, customerMobile, date, time, guests, preference, bookingType, smoking } = req.body;
        const ownerId = req.userId;

        const shop = await Shop.findOne({ _id: shopId, owner: ownerId });
        if (!shop) return res.status(403).json({ message: "Unauthorized or shop not found" });

        const isSmokingRequest = smoking === true;

        const matchingTable = await Table.findOne({
            shop: shopId,
            status: "Available",
            capacity: { $gte: guests },
            isSmokingZone: isSmokingRequest
        }).sort({ capacity: 1 });

        if (!matchingTable) {
            return res.status(400).json({ 
                message: `No available ${isSmokingRequest ? 'smoking' : 'non-smoking'} tables found for ${guests} guests.` 
            });
        }

        const newBooking = new TableBooking({
            shop: shopId,
            customerName,
            customerMobile,
            date,
            time,
            guests,
            preference,
            smoking: isSmokingRequest,
            bookingType: bookingType || "Walk-in",
            table: matchingTable._id,
            status: "Arrived" // Walk-ins are typically arrived immediately
        });

        await newBooking.save();

        matchingTable.status = "Occupied";
        await matchingTable.save();

        res.status(201).json({ message: "Walk-in created and table auto-assigned", booking: newBooking });
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
