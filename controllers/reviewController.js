import Review from "../models/Review.js";
import House from "../models/House.js";

import Booking from "../models/Booking.js";

export const createReview = async (req, res) => {
  try {
    const { houseId, rating, comment } = req.body;

    // ✅ Check if user booked this house
    const hasBooked = await Booking.findOne({
      userId: req.user.id,
      houseId,
    });

    if (!hasBooked) {
      return res
        .status(403)
        .json("You can only review a house you have booked");
    }

    // ✅ Prevent duplicate review
    const existing = await Review.findOne({
      userId: req.user.id,
      houseId,
    });

    if (existing) {
      return res.status(400).json("You already reviewed this house");
    }

    // Create review
    const newReview = new Review({
      userId: req.user.id,
      houseId,
      rating,
      comment,
    });

    await newReview.save();

    // Recalculate rating
    const reviews = await Review.find({ houseId });

    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) /
      reviews.length;

    await House.findByIdAndUpdate(houseId, {
      rating: avg,
      reviewCount: reviews.length,
    });

    res.status(200).json("Review added");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      houseId: req.params.houseId,
    }).populate("userId", "username");

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
};