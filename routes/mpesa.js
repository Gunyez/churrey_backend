import express from "express";

import {
  initiatePayment,
  mpesaCallback,
} from "../controllers/mpesa.js";

const router = express.Router();

router.post("/pay", initiatePayment);

router.post("/callback", mpesaCallback);

export default router;
