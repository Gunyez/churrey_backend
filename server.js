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
  origin: "http://localhost:3000",
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
app.get("/test-email", async (req, res) => {
  await sendVerificationEmail("lagatkipkemboi69@gmail.com", "123test");
  res.send("Email test triggered");
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server running");
});
