import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: "House" },
  startDate: Date,
  endDate: Date,
  totalPrice: Number,
  paymentStatus: {
      type: String,
      default: "pending",
    },
  bookingStatus: {
      type: String,
      default: "pending",
    },   
  status: { type: String, default: "confirmed" }
}, { timestamps: true });

export default mongoose.model("Booking", BookingSchema);