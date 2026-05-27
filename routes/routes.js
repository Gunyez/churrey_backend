import express from "express";
import { stkPush } from "../controllers/mpesa.js";

const router = express.Router();

router.post("/stk", stkPush);

router.post("/callback", (req, res) => {
  console.log("📥 M-Pesa Callback:", req.body);

  res.status(200).json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
});

export default router;