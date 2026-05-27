import Booking from "../models/Booking.js";

export const getAllBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate("userId", "username email")
      .populate("houseId", "title city photos");

    res.status(200).json(bookings);

  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to fetch bookings");
  }
};

export const updateBookingStatus = async (req, res) => {
  try {

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        bookingStatus: req.body.bookingStatus,
      },
      { new: true }
    );

    res.status(200).json(booking);

  } catch (err) {
    res.status(500).json("Failed to update booking");
  }
};

export const deleteBooking = async (req, res) => {
  try {

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json("Booking deleted");

  } catch (err) {
    res.status(500).json("Failed to delete booking");
  }
};