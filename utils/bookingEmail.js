import transporter from "./mailer.js";

export const sendBookingConfirmation =
  async (booking, user, house) => {

    await transporter.sendMail({
      to: user.email,

      subject:
        "Booking Confirmed",

      html: `
        <h2>Booking Confirmed</h2>

        <p>Hello ${user.username}</p>

        <p>
          Your booking for
          ${house.title}
          has been confirmed.
        </p>

        <p>
          Check-in:
          ${booking.startDate}
        </p>

        <p>
          Check-out:
          ${booking.endDate}
        </p>
      `,
    });
};

export const notifyAdmin =
  async (booking, user, house) => {

    await transporter.sendMail({
      to: process.env.ADMIN_EMAIL,

      subject:
        "New Booking Received",

      html: `
        <h2>New Booking</h2>

        <p>User:
        ${user.username}</p>

        <p>Email:
        ${user.email}</p>

        <p>House:
        ${house.title}</p>
      `,
    });
};