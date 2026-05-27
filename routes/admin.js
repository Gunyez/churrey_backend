import express from "express";
import { getDashboardStats } from "../controllers/admin.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/stats", verifyAdmin, getDashboardStats);

export default router;