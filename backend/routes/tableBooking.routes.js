import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createOnlineBooking, createWalkInBooking, getShopBookings, getMyBookings, updateBookingStatus } from "../controllers/tableBooking.controllers.js";

const tableBookingRouter = express.Router();

tableBookingRouter.post("/book", isAuth, createOnlineBooking);
tableBookingRouter.post("/walkin", isAuth, createWalkInBooking);
tableBookingRouter.get("/shop/:shopId", isAuth, getShopBookings);
tableBookingRouter.get("/my-bookings", isAuth, getMyBookings);
tableBookingRouter.patch("/update/:bookingId", isAuth, updateBookingStatus);

export default tableBookingRouter;
