import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";

import authRoutes from "./routes/auth.js";
import houseRoutes from "./routes/houses.js";
import bookingRoutes from "./routes/bookings.js";
import reviewRoutes from "./routes/reviews.js";
import adminRoute from "./routes/admin.js";
import adminBookingRoute from "./routes/adminBooking.js";
// import mpesaRoute from "./routes/mpesa.js";


dotenv.config();

const app = express();

// middleware
app.use(cors({
  origin:[
    "http://localhost:3000",
    "https://churrey-frontend-xmg5.vercel.app"
    ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/admin/bookings", adminBookingRoute);
// app.use("/api/mpesa", mpesaRoute);

app.get("/", (req, res) => {
  res.send("Churrey Backend is running");
});
// app.get("/test-email", async (req, res) => {
//   await sendVerificationEmail("lagatkipkemboi69@gmail.com", "123test");
//   res.send("Email test triggered");
// });

app.get("/env-check", (req, res) => {
  res.json({
    emailUser: process.env.EMAIL_USER,
    emailPassExists: !!process.env.EMAIL_PASS,
    clientUrl: process.env.CLIENT_URL,
  });
});

app.get("/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "YOUR_PERSONAL_EMAIL@gmail.com",
      subject: "Test Email",
      text: "Render email test",
    });

    res.json({
      success: true,
      messageId: info.messageId,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server running");
});
