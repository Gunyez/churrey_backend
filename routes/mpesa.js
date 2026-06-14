import express from "express";

import {
  initiatePayment,
  mpesaCallback,
} from "../controllers/mpesa.js";
import { getMpesaToken } from "../utils/mpesa.js";

const router = express.Router();

router.post("/pay", initiatePayment);

router.post("/callback", mpesaCallback);

router.get("/token", async (req, res) => {
  try {
    const token = await getMpesaToken();
    res.json({ token });
  } catch (err) {
    console.log(err.response?.data || err);
    res.status(500).json(err.response?.data || err.message);
  }
});

export default router;
