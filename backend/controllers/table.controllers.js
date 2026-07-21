import Table from "../models/table.model.js";
import Shop from "../models/shop.model.js";

// Add new table
export const addTable = async (req, res) => {
    try {
        const { shopId, tableNumber, capacity, floor, status } = req.body;
        const ownerId = req.userId;

        // Verify shop exists and belongs to owner
        const shop = await Shop.findOne({ _id: shopId, owner: ownerId });
        if (!shop) return res.status(403).json({ message: "Unauthorized or shop not found" });

        const existingTable = await Table.findOne({ shop: shopId, tableNumber });
        if (existingTable) return res.status(400).json({ message: "Table number already exists" });

        const newTable = new Table({
            shop: shopId,
            owner: ownerId,
            tableNumber,
            capacity: capacity || 2,
            floor: floor || "Main Floor",
            status: status || "Available"
        });

        await newTable.save();
        
        // Generate a mock QR string based on table ID
        newTable.qrCode = `${process.env.FRONTEND_URL || "http://localhost:5173"}/shop/${shopId}?table=${newTable._id}`;
        await newTable.save();

        res.status(201).json({ message: "Table added successfully", table: newTable });
    } catch (error) {
        res.status(500).json({ message: `Error adding table: ${error.message}` });
    }
};

// Edit table
export const editTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { tableNumber, capacity, floor, status } = req.body;
        const ownerId = req.userId;

        const table = await Table.findOne({ _id: tableId, owner: ownerId });
        if (!table) return res.status(404).json({ message: "Table not found" });

        if (tableNumber) table.tableNumber = tableNumber;
        if (capacity) table.capacity = capacity;
        if (floor) table.floor = floor;
        if (status) table.status = status;

        await table.save();
        res.status(200).json({ message: "Table updated successfully", table });
    } catch (error) {
        res.status(500).json({ message: `Error editing table: ${error.message}` });
    }
};

// Delete table
export const deleteTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const ownerId = req.userId;

        const table = await Table.findOneAndDelete({ _id: tableId, owner: ownerId });
        if (!table) return res.status(404).json({ message: "Table not found or unauthorized" });

        res.status(200).json({ message: "Table deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: `Error deleting table: ${error.message}` });
    }
};

// Get all tables for a shop (Public/Owner)
export const getShopTables = async (req, res) => {
    try {
        const { shopId } = req.params;
        const tables = await Table.find({ shop: shopId }).sort({ tableNumber: 1 });
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ message: `Error fetching tables: ${error.message}` });
    }
};

// Update table status
export const updateTableStatus = async (req, res) => {
    try {
        const { tableId } = req.params;
        const { status } = req.body;
        const ownerId = req.userId;

        const validStatuses = ["Available", "Reserved", "Occupied", "Cleaning", "Maintenance", "Disabled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const table = await Table.findOneAndUpdate(
            { _id: tableId, owner: ownerId },
            { status },
            { new: true }
        );

        if (!table) return res.status(404).json({ message: "Table not found" });

        res.status(200).json({ message: "Table status updated", table });
    } catch (error) {
        res.status(500).json({ message: `Error updating status: ${error.message}` });
    }
};
