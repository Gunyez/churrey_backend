import User from "../models/User.js";
import House from "../models/House.js";
import Booking from "../models/Booking.js";

export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const houses = await House.countDocuments();
    const bookings = await Booking.countDocuments();

    const bookingData = await Booking.find();

    const revenue = bookingData.reduce(
      (total, item) => total + item.totalPrice,
      0
    );

    res.status(200).json({
      users,
      houses,
      bookings,
      revenue,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to fetch stats");
  }
};