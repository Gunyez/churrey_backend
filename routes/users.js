import express from "express";
import { updateUser } from "../controllers/userController.js";
import { verifyUser } from "../middleware/verifyToken.js";

const router = express.Router();

router.put("/:id", verifyUser, updateUser);

export default router;