import express from "express";
import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  getMyEquipment,
} from "../controllers/equipmentController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllEquipment);
router.get("/:id", getEquipmentById);

// Private
router.get("/my/listings", protect, restrictTo("owner"), getMyEquipment);
router.post("/", protect, restrictTo("owner"), createEquipment);
router.put("/:id", protect, restrictTo("owner"), updateEquipment);
router.delete("/:id", protect, restrictTo("owner"), deleteEquipment);

export default router;