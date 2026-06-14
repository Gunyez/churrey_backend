import Booking from "../models/Booking.js";
import House from "../models/House.js";
import {isHouseAvailable} from "../utils/checkAvailability.js";

// export const createBooking = async (req, res) => {
//   try {
//     const { houseId, startDate, endDate } = req.body;

//     const dates = [];
//     let current = new Date(startDate);

//     while (current <= new Date(endDate)) {
//       dates.push(new Date(current));
//       current.setDate(current.getDate() + 1);
//     }

//     const house = await House.findById(houseId);

//     const isUnavailable = house.unavailableDates.some(date =>
//       dates.includes(date)
//     );

//     if (isUnavailable) {
//       return res.status(400).json("House not available");
//     }

//     house.unavailableDates.push(...dates);
//     await house.save();

//     const newBooking = new Booking(req.body);
//     const saved = await newBooking.save();

//     res.status(200).json(saved);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };




export const createBooking = async (
  req,
  res
) => {
  try {
    const {
      houseId,
      startDate,
      endDate,
    } = req.body;

    const house =
      await House.findById(houseId);

    if (!house) {
      return res
        .status(404)
        .json("House not found");
    }

    const available =
      isHouseAvailable(
        house,
        startDate,
        endDate
      );

    if (!available) {
      return res.status(400).json({
        message:
          "House already booked for selected dates",
      });
    }

    const booking = new Booking({
      ...req.body,
      paymentStatus: "pending",
      bookingStatus: "pending",
    });

    const saved =
      await booking.save();

    res.status(201).json(saved);

  } catch (err) {
    console.log(err);

    res.status(500).json(err.message);
  }
};

// controllers/bookingController.js
export const checkUserBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      userId: req.user.id,
      houseId: req.params.houseId,
    });

    if (!booking) {
      return res.status(404).json(false);
    }

    res.status(200).json(true);
  } catch (err) {
    res.status(500).json(err);
  }
};


export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id,
    }).populate("houseId");

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json("Failed to fetch bookings");
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json("Booking not found");
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json("Not authorized");
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json("Booking cancelled");
  } catch (err) {
    res.status(500).json("Failed to cancel booking");
  }
};