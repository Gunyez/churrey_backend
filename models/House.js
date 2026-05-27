import mongoose from "mongoose";

const HouseSchema = new mongoose.Schema({
  title: String,
  city: String,
  address: String,
  price: Number,
  maxPeople: Number,
  desc: String,
  photos: [String],
  amenities: [String],
  unavailableDates: [Date],
  rating: {
  type: Number,
  default: 0,
  },
  reviewCount: {
  type: Number,
  default: 0,
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("House", HouseSchema);