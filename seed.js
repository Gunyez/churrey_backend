import mongoose from "mongoose";
import dotenv from "dotenv";
import House from "./models/House.js";

dotenv.config();

const houses = [
  {
    title: "Modern Apartment in Kilimani",
    city: "Nairobi",
    address: "Kilimani",
    price: 5000,
    maxPeople: 4,
    desc: "Beautiful modern apartment with city view",
    photos: [
      "https://images.unsplash.com/photo-1",
      "https://images.unsplash.com/photo-2"
    ],
    amenities: ["WiFi", "TV", "Parking"],
    unavailableDates: []
  },
  {
    title: "Cozy Studio in Westlands",
    city: "Nairobi",
    address: "Westlands",
    price: 3500,
    maxPeople: 2,
    desc: "Perfect for short stays and business trips",
    photos: [
      "https://images.unsplash.com/photo-3"
    ],
    amenities: ["WiFi", "Kitchen"],
    unavailableDates: []
  },
  {
    title: "Luxury Villa in Karen",
    city: "Nairobi",
    address: "Karen",
    price: 12000,
    maxPeople: 6,
    desc: "Spacious villa with garden and pool",
    photos: [
      "https://images.unsplash.com/photo-4"
    ],
    amenities: ["Pool", "Garden", "Parking"],
    unavailableDates: []
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);

    console.log("Connected to MongoDB");

    await House.deleteMany(); // clear old data
    console.log("Old houses deleted");

    await House.insertMany(houses);
    console.log("Sample houses inserted");

    mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
};

seedDB();