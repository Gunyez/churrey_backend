import Booking from "../models/Booking.js";

import { stkPush } from "../utils/mpesa.js";

export const initiatePayment = async (req, res) => {

  try {

    const {
      bookingId,
      phone,
      amount,
    } = req.body;

    const response = await stkPush({
      bookingId,
      phone,
      amount,
    });

    res.status(200).json({
      message: "STK Push sent",
      data: response.data,
    });

  } catch (err) {

    console.log(err.response?.data || err);

    res.status(500).json("Payment failed");
  }
};

export const mpesaCallback = async (req, res) => {

  try {

    console.log(
      JSON.stringify(req.body, null, 2)
    );

    const callback =
      req.body.Body.stkCallback;

    if (callback.ResultCode === 0) {

      const metadata =
        callback.CallbackMetadata.Item;

      const receipt =
        metadata.find(
          (item) =>
            item.Name === "MpesaReceiptNumber"
        )?.Value;

      const bookingId =
        metadata.find(
          (item) =>
            item.Name === "AccountReference"
        )?.Value;

      // 1️⃣ Update booking

      const booking =
        await Booking.findByIdAndUpdate(
          bookingId,
          {
            paymentStatus: "paid",
            bookingStatus: "approved",
            mpesaReceipt: receipt,
          },
          { new: true }
        );

      // 2️⃣ Block house dates

      const dates = [];

      let current = new Date(
        booking.startDate
      );

      while (
        current <= new Date(booking.endDate)
      ) {

        dates.push(new Date(current));

        current.setDate(
          current.getDate() + 1
        );
      }

      await House.findByIdAndUpdate(
        booking.houseId,
        {
          $push: {
            unavailableDates: {
              $each: dates,
            },
          },
        }
      );
    }

    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json("Callback failed");
  }
};