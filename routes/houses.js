import express from "express";
import {
  getHouses,
  getHouse,
  createHouse,
  updateHouse,
  deleteHouse,
  getAllHouses,
} from "../controllers/houseController.js";
import { verifyAdmin } from "../middleware/verifyToken.js";
// import upload from "../middleware/upload.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.get("/", getHouses);
router.get("/:id", getHouse);
router.post("/", verifyAdmin, upload.array("photos", 6),createHouse);
router.put("/:id", verifyAdmin, updateHouse);
router.delete("/:id", verifyAdmin, deleteHouse);

export default router;