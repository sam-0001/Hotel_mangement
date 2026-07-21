import Hall from "../models/hall.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Add a new hall
export const createHall = async (req, res) => {
    try {
        const { shopId, name, capacity, pricePerHour, minBookingDuration, cleaningTime, status } = req.body;
        const ownerId = req.userId;

        const shop = await Shop.findOne({ _id: shopId, owner: ownerId });
        if (!shop) return res.status(403).json({ message: "Unauthorized or shop not found" });

        let images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const url = await uploadOnCloudinary(file.path);
                if (url) images.push(url);
            }
        }

        const packages = req.body.packages ? JSON.parse(req.body.packages) : [];
        const addOns = req.body.addOns ? JSON.parse(req.body.addOns) : [];
        const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];

        const newHall = new Hall({
            shop: shopId,
            owner: ownerId,
            name,
            capacity,
            pricePerHour,
            packages,
            addOns,
            amenities,
            minBookingDuration,
            cleaningTime,
            status,
            images
        });

        await newHall.save();
        res.status(201).json({ message: "Hall created successfully", hall: newHall });
    } catch (error) {
        res.status(500).json({ message: `Error creating hall: ${error.message}` });
    }
};

// Get all halls for a shop (public)
export const getHallsByShop = async (req, res) => {
    try {
        const { shopId } = req.params;
        const halls = await Hall.find({ shop: shopId });
        res.status(200).json(halls);
    } catch (error) {
        res.status(500).json({ message: `Error fetching halls: ${error.message}` });
    }
};

// Get a specific hall
export const getHallById = async (req, res) => {
    try {
        const { hallId } = req.params;
        const hall = await Hall.findById(hallId);
        if (!hall) return res.status(404).json({ message: "Hall not found" });
        res.status(200).json(hall);
    } catch (error) {
        res.status(500).json({ message: `Error fetching hall: ${error.message}` });
    }
};

// Update a hall
export const updateHall = async (req, res) => {
    try {
        const { hallId } = req.params;
        const ownerId = req.userId;

        const hall = await Hall.findOne({ _id: hallId, owner: ownerId });
        if (!hall) return res.status(404).json({ message: "Hall not found or unauthorized" });

        const { name, capacity, pricePerHour, minBookingDuration, cleaningTime, status } = req.body;
        
        let images = hall.images || [];
        if (req.files && req.files.length > 0) {
            images = []; // Replace or append? Let's replace for simplicity
            for (const file of req.files) {
                const url = await uploadOnCloudinary(file.path);
                if (url) images.push(url);
            }
        }

        const packages = req.body.packages ? JSON.parse(req.body.packages) : hall.packages;
        const addOns = req.body.addOns ? JSON.parse(req.body.addOns) : hall.addOns;
        const amenities = req.body.amenities ? JSON.parse(req.body.amenities) : hall.amenities;

        hall.name = name || hall.name;
        hall.capacity = capacity || hall.capacity;
        hall.pricePerHour = pricePerHour || hall.pricePerHour;
        hall.minBookingDuration = minBookingDuration !== undefined ? minBookingDuration : hall.minBookingDuration;
        hall.cleaningTime = cleaningTime !== undefined ? cleaningTime : hall.cleaningTime;
        hall.status = status || hall.status;
        hall.packages = packages;
        hall.addOns = addOns;
        hall.amenities = amenities;
        if (req.files && req.files.length > 0) hall.images = images;

        await hall.save();
        res.status(200).json({ message: "Hall updated successfully", hall });
    } catch (error) {
        res.status(500).json({ message: `Error updating hall: ${error.message}` });
    }
};

// Delete a hall
export const deleteHall = async (req, res) => {
    try {
        const { hallId } = req.params;
        const ownerId = req.userId;

        const deletedHall = await Hall.findOneAndDelete({ _id: hallId, owner: ownerId });
        if (!deletedHall) return res.status(404).json({ message: "Hall not found or unauthorized" });

        res.status(200).json({ message: "Hall deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: `Error deleting hall: ${error.message}` });
    }
};
