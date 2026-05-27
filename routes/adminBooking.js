import express from "express";

import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/adminBooking.js";

import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllBookings);

router.put("/:id", verifyAdmin, updateBookingStatus);

router.delete("/:id", verifyAdmin, deleteBooking);

export default router;