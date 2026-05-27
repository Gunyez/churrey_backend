import express from "express";
import { createBooking, checkUserBooking,getUserBookings,cancelBooking } from "../controllers/bookingContoller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/check/:houseId", verifyToken, checkUserBooking);
router.get("/my", verifyToken, getUserBookings);
router.delete("/:id", verifyToken, cancelBooking);
export default router;