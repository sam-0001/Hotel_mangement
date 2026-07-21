import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createHallBooking, getOwnerHallBookings, getUserHallBookings, updateBookingStatus } from "../controllers/hallBooking.controllers.js";

const router = express.Router();

router.post("/book", isAuth, createHallBooking);
router.get("/owner/:shopId", isAuth, getOwnerHallBookings);
router.get("/my-bookings", isAuth, getUserHallBookings);
router.put("/update-status/:bookingId", isAuth, updateBookingStatus);

export default router;
