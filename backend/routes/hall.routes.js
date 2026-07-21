import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { createHall, getHallsByShop, getHallById, updateHall, deleteHall } from "../controllers/hall.controllers.js";

const router = express.Router();

// Owner routes
router.post("/create", isAuth, upload.array("images", 5), createHall);
router.put("/update/:hallId", isAuth, upload.array("images", 5), updateHall);
router.delete("/delete/:hallId", isAuth, deleteHall);

// Public routes
router.get("/shop/:shopId", getHallsByShop);
router.get("/:hallId", getHallById);

export default router;
